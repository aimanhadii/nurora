"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SquarePen } from "lucide-react";
import { sendChatMessage, useAnyTyping, useTyping } from "@/lib/chat";
import {
  getMostRecentConversationId,
  setLastOpenedConversation,
  useConversation,
  useMessages,
} from "@/lib/conversations";
import { useDisplayName } from "@/lib/profile";
import type { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Orb } from "@/components/ui/Orb";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { ChatEmpty } from "./ChatEmpty";
import { Composer } from "./Composer";
import { HistorySheet } from "./history/HistorySheet";
import { MessageGroup } from "./MessageGroup";
import { QuickChips } from "./QuickChips";

// Same sender within 5 minutes = same group.
const GROUP_GAP_MS = 5 * 60_000;

function groupMessages(messages: Message[]): Message[][] {
  const groups: Message[][] = [];
  for (const m of messages) {
    const group = groups[groups.length - 1];
    const prev = group?.[group.length - 1];
    if (
      prev &&
      prev.role === m.role &&
      new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() < GROUP_GAP_MS
    ) {
      group.push(m);
    } else {
      groups.push([m]);
    }
  }
  return groups;
}

// One 720px column shared by header, messages and composer, so their
// edges line up exactly.
const COLUMN = "mx-auto w-full max-w-180 px-4 md:px-6";

// Where each conversation was scrolled to, so switching back restores it.
const scrollPositions = new Map<string, number>();

/**
 * One conversation: header, scrolling messages, composer — stacked. The
 * composer is in the normal layout flow, so it can never cover a message.
 *
 * conversationId: an id = a saved chat; null = a new, unsaved chat (saved
 * on first send); undefined = still working out which chat to show.
 */
export function ChatScreen({ conversationId }: { conversationId: string | null | undefined }) {
  const router = useRouter();
  const name = useDisplayName();
  const messages = useMessages(conversationId);
  const conversation = useConversation(conversationId);
  const typing = useTyping(conversationId);
  const busy = useAnyTyping();
  const scrollRef = useRef<HTMLDivElement>(null);
  const shown = useRef<{ key: string | null; count: number }>({ key: null, count: 0 });

  const loading = conversationId === undefined || messages === null;
  const missing = !loading && conversationId !== null && conversation === null;
  const empty = !loading && !missing && messages.length === 0;
  const key = conversationId ?? "new";

  // A deleted or unknown chat: go straight to the most recent one (the same
  // place the Delete action sends you, so the two never race).
  useEffect(() => {
    if (!missing) return;
    const next = getMostRecentConversationId();
    router.replace(next ? `/chat/${next}` : "/chat/new");
  }, [missing, router]);

  // Remember the open chat, so Home's "Ask Nurora" continues it.
  useEffect(() => {
    if (conversation) setLastOpenedConversation(conversation.id);
  }, [conversation]);

  // On open: restore this chat's scroll position, or jump to the newest
  // message. Afterwards: glide to each new message.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || loading) return;
    if (shown.current.key !== key) {
      shown.current = { key, count: messages.length };
      el.scrollTo({ top: scrollPositions.get(key) ?? el.scrollHeight, behavior: "instant" });
      return;
    }
    if (messages.length !== shown.current.count || typing) {
      shown.current.count = messages.length;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [key, loading, messages, typing]);

  function send(text: string): boolean {
    const id = sendChatMessage(text, conversationId ?? null);
    if (!id) return false;
    // A new chat is saved on its first message; give it its own URL.
    if (conversationId !== id) router.replace(`/chat/${id}`);
    return true;
  }

  return (
    <div className="flex h-full flex-col">
      <h1 className="sr-only">{conversation ? `Chat: ${conversation.title}` : "New chat with Nurora"}</h1>
      <MobileHeader
        scrollRef={scrollRef}
        rowClassName={`${COLUMN} md:py-5`}
        actions={
          <>
            <HistorySheet />
            <Button asChild variant="ghost" size="icon-lg">
              <Link href="/chat/new" aria-label="New chat">
                <SquarePen className="size-5" strokeWidth={1.5} />
              </Link>
            </Button>
          </>
        }
      />

      <div
        ref={scrollRef}
        onScroll={(e) => scrollPositions.set(key, e.currentTarget.scrollTop)}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        {/* Re-keyed per chat so switching conversations fades the new one in. */}
        <div key={key} className={`${COLUMN} flex min-h-full animate-fade-in flex-col`}>
          {loading || missing ? (
            <ChatSkeleton />
          ) : empty ? (
            <ChatEmpty
              name={name}
              subtitle="A little light for your day."
              onPick={send}
            />
          ) : (
            <div role="log" aria-live="polite" aria-label="Conversation" className="flex flex-col gap-5 py-6">
              {groupMessages(messages).map((group) => (
                <MessageGroup
                  key={group[0].id}
                  messages={group}
                  animateId={messages[messages.length - 1].id}
                />
              ))}
              {typing && (
                <div role="status" className="flex animate-message-in items-center gap-3">
                  <Orb size={40} thinking />
                  <span className="text-sm text-muted-foreground">Thinking…</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0">
        <div className={`${COLUMN} space-y-3 pt-3 pb-[calc(var(--tabbar-h)+12px)] md:pb-6`}>
          {!empty && !loading && <QuickChips onPick={send} disabled={busy} />}
          <Composer onSend={send} busy={busy} />
        </div>
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-5 py-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="ml-auto h-10 w-40 rounded-xl" />
      <div className="flex gap-3">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-20 w-2/3 rounded-xl" />
      </div>
    </div>
  );
}
