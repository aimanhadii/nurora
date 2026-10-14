"use client";

import { useEffect, useRef, useState } from "react";
import { fakeReply } from "@/lib/fake-bot";
import { addMessage, getLocalData, useLocalData } from "@/lib/local-store";
import { PLACEHOLDER_PROFILE } from "@/lib/profile";
import { formatLongDate } from "@/lib/time";
import { useNow } from "@/lib/use-now";
import { PageHeader } from "@/components/layout/PageHeader";
import { Orb } from "@/components/ui/Orb";
import { ChatInput } from "./ChatInput";
import { ChatWelcome } from "./ChatWelcome";
import { MessageBubble, TypingIndicator } from "./MessageBubble";
import { QuickReplies } from "./QuickReplies";

/**
 * Three stacked rows: header, scrolling messages, composer. The composer
 * is in the normal layout flow (not floating), so it can never cover the
 * last message — the message list simply ends where the composer begins.
 */
export function ChatScreen() {
  const data = useLocalData();
  const now = useNow();
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  const messages = data?.messages ?? [];
  const empty = data !== null && messages.length === 0;

  // Keep the newest message in view. Jump on first load, glide after that.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !data) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: hasScrolled.current ? "smooth" : "instant",
    });
    hasScrolled.current = true;
  }, [messages.length, typing, data]);

  function handleSend(text: string) {
    addMessage("user", text);
    setTyping(true);
    setTimeout(
      () => {
        addMessage(
          "assistant",
          fakeReply(text, getLocalData().tasks, new Date()),
        );
        setTyping(false);
      },
      900 + Math.random() * 600,
    );
  }

  const date = now ? formatLongDate(now) : "";

  return (
    <div className="flex h-full flex-col md:surface-glass md:overflow-hidden md:rounded-card">
      <PageHeader
        leading={<Orb size={36} />}
        title="Teman"
        // Hidden until the browser knows the real date.
        subtitle={<span className={now ? "" : "invisible"}>{date || "Today"}</span>}
      />

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto flex min-h-full max-w-[760px] flex-col px-4 md:px-6">
          {empty ? (
            <ChatWelcome
              name={PLACEHOLDER_PROFILE.name}
              subtitle={date ? `It's ${date}. What's on your plate?` : " "}
              onPick={handleSend}
              disabled={typing}
            />
          ) : (
            <div
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              className="flex-1 space-y-5 py-4"
            >
              {messages.map((m, i) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  animate={i === messages.length - 1}
                />
              ))}
              {typing && <TypingIndicator />}
            </div>
          )}
        </div>
      </div>

      {/* Composer: sits above the floating tab bar on phones. */}
      <div className="shrink-0 px-3 pt-2 pb-[calc(var(--nav-h)+0.5rem)] md:px-6 md:pb-5">
        <div className="mx-auto max-w-[760px]">
          {!empty && data && (
            <QuickReplies onPick={handleSend} disabled={typing} />
          )}
          <ChatInput onSend={handleSend} disabled={!data || typing} />
        </div>
      </div>
    </div>
  );
}
