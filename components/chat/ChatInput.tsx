"use client";

import { useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";
import { Surface } from "@/components/ui/Surface";
import { AddTaskButton } from "@/components/tasks/TaskSheet";

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
    <Surface
      as="form"
      onSubmit={handleSubmit}
      className="flex items-center gap-1 rounded-full p-1.5 transition focus-within:border-border-strong focus-within:shadow-active"
    >
      <AddTaskButton variant="icon" />
      <label htmlFor="chat-input" className="sr-only">
        Message Teman
      </label>
      <input
        id="chat-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask Teman anything..."
        autoComplete="off"
        enterKeyHint="send"
        // 16px text stops iOS Safari from zooming in on focus.
        className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base outline-none placeholder:text-text-3 focus-visible:outline-none"
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send message"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg transition active:scale-90 disabled:opacity-25"
      >
        <ArrowUp className="size-5" strokeWidth={2} />
      </button>
    </Surface>
  );
}
