"use client";

import { useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";

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
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-[22px] border border-line bg-surface p-1 pl-4 transition-shadow focus-within:border-line-strong focus-within:shadow-[0_0_0_4px_var(--line)]"
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
        className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-subtle focus-visible:outline-none"
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send message"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition active:scale-90 disabled:bg-surface-2 disabled:text-subtle"
      >
        <ArrowUp className="size-5" strokeWidth={2.25} />
      </button>
    </form>
  );
}
