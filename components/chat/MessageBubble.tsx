"use client";

import { Copy, MoreHorizontal, Share, Trash2 } from "lucide-react";
import { deleteMessage, restoreMessage } from "@/lib/local-store";
import { copyText, shareText } from "@/lib/share";
import { formatTime } from "@/lib/time";
import { showToast } from "@/lib/toast";
import type { Message } from "@/lib/types";
import { ContextMenu, useContextMenu, type MenuItem } from "@/components/ui/ContextMenu";

export function MessageBubble({
  message,
  animate,
}: {
  message: Message;
  animate?: boolean;
}) {
  const isUser = message.role === "user";
  const menu = useContextMenu();

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

  return (
    <div
      className={`group flex flex-col ${isUser ? "items-end" : "items-start"} ${
        animate ? "animate-message-in" : ""
      }`}
    >
      <div
        className={`flex max-w-[88%] items-center gap-1 md:max-w-[78%] ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        <div
          {...menu.targetProps}
          className={`long-press min-w-0 rounded-[22px] px-4 py-2.5 text-[15px] leading-relaxed ${
            isUser ? "accent-fill rounded-br-md" : "glass-flat rounded-bl-md"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {/* Desktop: "…" appears on hover/focus. Phones use long-press. */}
        <button
          type="button"
          {...menu.buttonProps}
          aria-label="Message options"
          className="hidden size-8 shrink-0 items-center justify-center rounded-full text-fg-3 opacity-0 transition hover:bg-glass-hover hover:text-fg group-hover:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100 md:flex"
        >
          <MoreHorizontal className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      <time dateTime={message.createdAt} className="mt-1 px-2 text-[11px] text-fg-3">
        {isUser ? "" : "Teman · "}
        {formatTime(message.createdAt)}
      </time>

      <ContextMenu
        position={menu.position}
        items={items}
        label="Message options"
        onClose={menu.close}
      />
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex animate-message-in items-start">
      <div
        role="status"
        aria-label="Teman is typing"
        className="glass-flat flex gap-1.5 rounded-[22px] rounded-bl-md px-4 py-4"
      >
        {[0, 180, 360].map((delay) => (
          <span
            key={delay}
            className="size-2 animate-pulse-dot rounded-full bg-fg-2"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
