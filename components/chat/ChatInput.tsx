"use client";

import { useState, type FormEvent } from "react";
import { SendIcon } from "@/components/ui/icons";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-rose-100 bg-white px-3 py-2"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message…"
        enterKeyHint="send"
        // 16px text stops iOS Safari from zooming in on focus.
        className="min-w-0 flex-1 rounded-full bg-rose-50 px-4 py-2.5 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-rose-200"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        aria-label="Send"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-400 text-white transition active:scale-95 disabled:bg-rose-200"
      >
        <SendIcon className="size-5" />
      </button>
    </form>
  );
}
