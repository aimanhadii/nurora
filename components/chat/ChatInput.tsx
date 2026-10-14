"use client";

import { useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0 && !disabled;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <GlassPanel
      as="form"
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-full p-1.5 pl-5 transition-[border-color] focus-within:border-white/25"
    >
      <label htmlFor="chat-input" className="sr-only">
        Message Teman
      </label>
      <input
        id="chat-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message Teman…"
        autoComplete="off"
        enterKeyHint="send"
        // 16px text stops iOS Safari from zooming in on focus.
        className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-fg-3 focus-visible:outline-none"
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send message"
        className="accent-fill flex size-11 shrink-0 items-center justify-center rounded-full transition active:scale-90 disabled:opacity-35 disabled:saturate-50"
      >
        <ArrowUp className="size-5" strokeWidth={2.25} />
      </button>
    </GlassPanel>
  );
}
