"use client";

import { useEffect, useRef } from "react";
import { sendChatMessage, useTyping } from "@/lib/chat";
import { useLocalData } from "@/lib/local-store";
import { PLACEHOLDER_PROFILE } from "@/lib/profile";
import { formatLongDate } from "@/lib/time";
import type { Message } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { Skeleton } from "@/components/ui/skeleton";
import { Orb } from "@/components/ui/Orb";
import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { ChatEmpty } from "./ChatEmpty";
import { Composer } from "./Composer";
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

/**
 * Header, scrolling messages, composer — stacked. The composer is in the
 * normal layout flow, so it can never cover the last message.
 */
export function ChatScreen() {
  const data = useLocalData();
  const now = useNow();
  const typing = useTyping();
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  const messages = data?.messages ?? [];
  const empty = data !== null && messages.length === 0;

  // Keep the newest message in view: jump on first load, glide after that.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !data) return;
    el.scrollTo({ top: el.scrollHeight, behavior: hasScrolled.current ? "smooth" : "instant" });
    hasScrolled.current = true;
  }, [messages.length, typing, data]);

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 pt-[env(safe-area-inset-top)]">
        <div className={`${COLUMN} flex items-center gap-3 py-3 md:py-5`}>
          <Orb size={32} />
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-semibold">Teman</h1>
            <p className="truncate text-meta text-muted-foreground">
              {now ? formatLongDate(now) : " "}
            </p>
          </div>
          <div className="md:hidden">
            <ProfileMenu variant="avatar" />
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className={`${COLUMN} flex min-h-full flex-col`}>
          {!data ? (
            <ChatSkeleton />
          ) : empty ? (
            <ChatEmpty
              name={PLACEHOLDER_PROFILE.name}
              subtitle={now ? `It's ${formatLongDate(now)}. What's on your plate?` : " "}
              onPick={sendChatMessage}
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
          {!empty && data && <QuickChips onPick={sendChatMessage} disabled={typing} />}
          <Composer />
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
