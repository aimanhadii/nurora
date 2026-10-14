"use client";

import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTaskButton } from "@/components/tasks/TaskFormDialog";

// 5 lines of 24px text + 16px padding.
const MAX_HEIGHT_PX = 136;

/**
 * Rounded input card: "+" (add task) on the left, an auto-growing
 * textarea, and a send button that turns primary once there's text.
 * `onSend` returns false if nothing was sent (the text is then kept).
 */
export function Composer({ onSend, busy }: { onSend: (text: string) => boolean; busy: boolean }) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  // Unique per instance: Next keeps the previous chat page mounted (hidden),
  // so a fixed id would appear twice.
  const inputId = useId();
  const canSend = text.trim().length > 0 && !busy;

  // Grow with the content, up to 5 lines; then it scrolls.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [text]);

  function send() {
    if (!canSend) return;
    if (onSend(text)) setText("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter adds a new line. Ignore Enter while an
    // IME (e.g. emoji / predictive text) is still composing.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="flex items-end gap-2 rounded-xl border bg-card p-2 shadow-sm transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
      <AddTaskButton iconOnly variant="ghost" size="icon" className="size-11 md:size-10" />
      <label htmlFor={inputId} className="sr-only">
        Message Nurora
      </label>
      <textarea
        id={inputId}
        data-chat-input
        ref={ref}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Nurora anything..."
        enterKeyHint="send"
        className="max-h-34 min-h-11 flex-1 resize-none bg-transparent px-1 py-2 text-base outline-none placeholder:text-subtle-foreground md:min-h-10"
      />
      <Button
        type="button"
        size="icon"
        variant={canSend ? "default" : "ghost"}
        disabled={!canSend}
        onClick={send}
        aria-label="Send message"
        className="size-11 rounded-full md:size-10"
      >
        <ArrowUp strokeWidth={1.5} />
      </Button>
    </div>
  );
}
