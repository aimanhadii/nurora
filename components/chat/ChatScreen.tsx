"use client";

import { useEffect, useRef, useState } from "react";
import { fakeReply } from "@/lib/fake-bot";
import { addMessage, getLocalData, useLocalData } from "@/lib/local-store";
import { PLACEHOLDER_PROFILE } from "@/lib/profile";
import { formatLongDate, greeting } from "@/lib/time";
import { useNow } from "@/lib/use-now";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChatInput } from "./ChatInput";
import { ChatWelcome } from "./ChatWelcome";
import { MessageBubble, TypingIndicator } from "./MessageBubble";
import { QuickReplies } from "./QuickReplies";

export function ChatScreen() {
  const data = useLocalData();
  const now = useNow();
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  const messages = data?.messages ?? [];

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
      700 + Math.random() * 500,
    );
  }

  const name = PLACEHOLDER_PROFILE.name;

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain">
      <div className="mx-auto flex min-h-full max-w-[720px] flex-col px-3 md:px-2">
        <PageHeader
          title={
            // Hidden until the browser knows the real time, so the server
            // never shows "Good morning" at night.
            <span className={now ? "animate-fade-in" : "invisible"}>
              {now ? greeting(now) : "Hello"}, {name}
            </span>
          }
          subtitle={
            <span className={now ? "" : "invisible"}>
              {now ? formatLongDate(now) : "Today"}
            </span>
          }
        />

        {data && messages.length === 0 ? (
          <ChatWelcome name={name} />
        ) : (
          <div
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="flex-1 space-y-4 px-1 py-6"
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

        {/* Composer sticks to the bottom, above the floating tab bar. The
            fade keeps chips readable over messages scrolling underneath. */}
        <div className="sticky bottom-0 z-10 -mx-3 bg-linear-to-t from-bg/90 from-40% to-transparent px-3 pt-6 pb-[calc(var(--nav-h)+0.5rem)] md:mx-0 md:px-0 md:pb-0">
          <QuickReplies onPick={handleSend} disabled={!data || typing} />
          <ChatInput onSend={handleSend} disabled={!data || typing} />
        </div>
      </div>
    </div>
  );
}
