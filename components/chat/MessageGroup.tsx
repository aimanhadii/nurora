"use client";

import { useState, type ReactNode } from "react";
import { Copy, Share, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteMessage, restoreMessage } from "@/lib/local-store";
import { copyWithToast, shareText } from "@/lib/share";
import { formatTime } from "@/lib/time";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Orb } from "@/components/ui/Orb";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Feedback = "up" | "down" | null;

/** Consecutive messages from one sender, shown with one avatar and one time. */
export function MessageGroup({
  messages,
  animateId,
}: {
  messages: Message[];
  animateId?: string;
}) {
  const isUser = messages[0].role === "user";
  const last = messages[messages.length - 1];
  // Not saved yet; becomes real feedback once the AI is connected.
  const [feedback, setFeedback] = useState<Feedback>(null);
  const toggle = (value: Exclude<Feedback, null>) =>
    setFeedback(feedback === value ? null : value);

  const bubbles = messages.map((m) => (
    <Bubble
      key={m.id}
      message={m}
      isUser={isUser}
      animate={m.id === animateId}
      feedback={isUser ? undefined : feedback}
      onFeedback={isUser ? undefined : toggle}
    />
  ));

  const time = (
    <time dateTime={last.createdAt} className="text-xs tabular-nums text-muted-foreground">
      {formatTime(last.createdAt)}
    </time>
  );

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-2">
        {bubbles}
        <div className="px-1">{time}</div>
      </div>
    );
  }

  return (
    <div className="group/msg flex gap-3">
      <Orb size={28} className="mt-1" />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        {bubbles}
        <div className="flex h-8 items-center gap-1 px-1">
          {time}
          {/* Desktop: actions on hover/focus. Phones: long-press a bubble. */}
          <div className="ml-2 hidden items-center gap-1 opacity-0 transition-opacity group-hover/msg:opacity-100 focus-within:opacity-100 md:flex">
            <ActionButton
              label="Copy"
              onClick={() => copyWithToast(messages.map((m) => m.content).join("\n\n"))}
            >
              <Copy strokeWidth={1.5} />
            </ActionButton>
            <ActionButton label="Good reply" pressed={feedback === "up"} onClick={() => toggle("up")}>
              <ThumbsUp strokeWidth={1.5} />
            </ActionButton>
            <ActionButton label="Bad reply" pressed={feedback === "down"} onClick={() => toggle("down")}>
              <ThumbsDown strokeWidth={1.5} />
            </ActionButton>
          </div>
          {feedback && (
            <span className="ml-2 text-xs text-brand md:hidden">
              {feedback === "up" ? "👍" : "👎"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          aria-pressed={pressed}
          onClick={onClick}
          className={cn(pressed && "text-brand hover:text-brand")}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function Bubble({
  message,
  isUser,
  animate,
  feedback,
  onFeedback,
}: {
  message: Message;
  isUser: boolean;
  animate: boolean;
  feedback?: Feedback;
  onFeedback?: (value: "up" | "down") => void;
}) {
  function remove() {
    deleteMessage(message.id);
    toast("Message deleted", {
      action: { label: "Undo", onClick: () => restoreMessage(message) },
    });
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            "long-press rounded-xl px-4 py-2 text-base break-words whitespace-pre-wrap",
            isUser ? "max-w-4/5 bg-primary text-primary-foreground" : "max-w-full border bg-card shadow-sm",
            animate && "animate-message-in",
          )}
        >
          {message.content}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem onSelect={() => copyWithToast(message.content)}>
          <Copy strokeWidth={1.5} />
          Copy
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => shareText(message.content)}>
          <Share strokeWidth={1.5} />
          Share
        </ContextMenuItem>
        {onFeedback && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={() => onFeedback("up")}>
              <ThumbsUp strokeWidth={1.5} className={cn(feedback === "up" && "text-brand")} />
              Good reply
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onFeedback("down")}>
              <ThumbsDown strokeWidth={1.5} className={cn(feedback === "down" && "text-brand")} />
              Bad reply
            </ContextMenuItem>
          </>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onSelect={remove}>
          <Trash2 strokeWidth={1.5} />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
