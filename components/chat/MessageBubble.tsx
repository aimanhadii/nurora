"use client";

import { useState, type ReactNode } from "react";
import {
  Copy,
  MoreHorizontal,
  Share,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { deleteMessage, restoreMessage } from "@/lib/local-store";
import { copyText, shareText } from "@/lib/share";
import { formatTime } from "@/lib/time";
import { showToast } from "@/lib/toast";
import type { Message } from "@/lib/types";
import { ContextMenu, useContextMenu, type MenuItem } from "@/components/ui/ContextMenu";
import { Orb } from "@/components/ui/Orb";

type Feedback = "up" | "down" | null;

/** Tiny icon button with a 44px tap area around a small visible icon. */
function FeedbackButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`relative flex size-7 items-center justify-center rounded-full transition before:absolute before:-inset-2 hover:bg-surface-2 active:scale-90 ${
        pressed ? "text-accent" : "text-text-3 hover:text-text-2"
      }`}
    >
      {children}
    </button>
  );
}

export function MessageBubble({
  message,
  animate,
}: {
  message: Message;
  animate?: boolean;
}) {
  const isUser = message.role === "user";
  const menu = useContextMenu();
  // Not saved anywhere yet; becomes real feedback once the AI is connected.
  const [feedback, setFeedback] = useState<Feedback>(null);

  const items: MenuItem[] = [
    {
      label: "Copy",
      Icon: Copy,
      onSelect: async () =>
        showToast((await copyText(message.content)) ? "Copied" : "Couldn't copy"),
    },
    { label: "Share", Icon: Share, onSelect: () => shareText(message.content) },
    {
      label: "Delete",
      Icon: Trash2,
      destructive: true,
      onSelect: () => {
        deleteMessage(message.id);
        showToast("Message deleted", {
          label: "Undo",
          run: () => restoreMessage(message),
        });
      },
    },
  ];

  const time = (
    <time dateTime={message.createdAt} className="text-[11px] text-text-3">
      {formatTime(message.createdAt)}
    </time>
  );

  const optionsButton = (
    // Desktop: "…" appears on hover/focus. Phones use long-press.
    <button
      type="button"
      {...menu.buttonProps}
      aria-label="Message options"
      className="hidden size-8 shrink-0 items-center justify-center rounded-full text-text-3 opacity-0 transition hover:bg-surface-2 hover:text-text group-hover:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100 md:flex"
    >
      <MoreHorizontal className="size-4" strokeWidth={1.5} />
    </button>
  );

  return (
    <div className={`group ${animate ? "animate-message-in" : ""}`}>
      {isUser ? (
        <div className="flex flex-col items-end">
          <div className="flex max-w-[85%] flex-row-reverse items-center gap-1 md:max-w-[75%]">
            <div
              {...menu.targetProps}
              className="long-press min-w-0 rounded-[22px] rounded-br-md bg-user-bubble px-4 py-2.5 text-[15px] leading-relaxed text-user-bubble-fg"
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </div>
            {optionsButton}
          </div>
          <div className="mt-1 px-2">{time}</div>
        </div>
      ) : (
        <div className="flex items-start gap-2.5">
          <Orb size={28} className="mt-1" />
          <div className="flex min-w-0 max-w-[85%] flex-col items-start md:max-w-[75%]">
            <div className="flex w-full items-center gap-1">
              <div
                {...menu.targetProps}
                className="long-press min-w-0 rounded-[22px] rounded-tl-md border border-border bg-bot-bubble px-4 shadow-soft py-2.5 text-[15px] leading-relaxed"
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
              {optionsButton}
            </div>
            <div className="mt-1 flex items-center gap-1 pl-1">
              {time}
              <span className="ml-1.5 flex items-center gap-0.5">
                <FeedbackButton
                  label="Good reply"
                  pressed={feedback === "up"}
                  onClick={() => setFeedback(feedback === "up" ? null : "up")}
                >
                  <ThumbsUp className="size-3.5" strokeWidth={1.5} />
                </FeedbackButton>
                <FeedbackButton
                  label="Bad reply"
                  pressed={feedback === "down"}
                  onClick={() => setFeedback(feedback === "down" ? null : "down")}
                >
                  <ThumbsDown className="size-3.5" strokeWidth={1.5} />
                </FeedbackButton>
              </span>
            </div>
          </div>
        </div>
      )}

      <ContextMenu
        position={menu.position}
        items={items}
        label="Message options"
        onClose={menu.close}
      />
    </div>
  );
}

/** Teman "thinking": the orb breathes while a reply is on its way. */
export function TypingIndicator() {
  return (
    <div
      role="status"
      aria-label="Teman is thinking"
      className="flex animate-message-in items-center gap-3"
    >
      <Orb size={40} thinking />
      <span className="text-sm text-text-3">Thinking…</span>
    </div>
  );
}
