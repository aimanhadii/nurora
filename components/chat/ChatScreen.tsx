"use client";

import { useEffect, useRef, useState } from "react";
import { addMessage, useLocalData } from "@/lib/local-store";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ChatInput } from "./ChatInput";
import { MessageBubble, TypingBubble } from "./MessageBubble";

// Placeholder until the real agent arrives in slice 3.
function fakeReply(text: string): string {
  return `Noted! 🌸 (I'm still in practice mode — my brain gets connected soon.)\n\nYou said: "${text}"`;
}

export function ChatScreen() {
  const data = useLocalData();
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messageCount = data?.messages.length ?? 0;
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount, typing]);

  function handleSend(text: string) {
    addMessage("user", text);
    setTyping(true);
    setTimeout(() => {
      addMessage("assistant", fakeReply(text));
      setTyping(false);
    }, 900);
  }

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="Teman" subtitle="your daily companion 🌷" />

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {data?.messages.map((m) => <MessageBubble key={m.id} message={m} />)}
        {typing && <TypingBubble />}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={!data || typing} />
    </div>
  );
}
