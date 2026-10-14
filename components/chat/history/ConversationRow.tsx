"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Pin, PinOff, Trash2 } from "lucide-react";
import {
  deleteConversation,
  getMostRecentConversationId,
  renameConversation,
  setConversationPinned,
} from "@/lib/conversations";
import type { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DeleteConversationDialog } from "./DeleteConversationDialog";

type Action = { label: string; Icon: typeof Pin; onSelect: () => void; destructive?: boolean };

/**
 * One chat in the history list. Tap/click opens it; "…" (or right-click /
 * long-press) offers Rename, Pin and Delete. Rename edits the title in place.
 */
export function ConversationRow({
  conversation,
  active,
  variant,
  onNavigate,
}: {
  conversation: Conversation;
  active: boolean;
  /** "sidebar": compact, "…" on hover. "sheet": 44px rows, "…" always shown. */
  variant: "sidebar" | "sheet";
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const actions: Action[] = [
    { label: "Rename", Icon: Pencil, onSelect: () => setEditing(true) },
    conversation.pinned
      ? { label: "Unpin", Icon: PinOff, onSelect: () => setConversationPinned(conversation.id, false) }
      : { label: "Pin", Icon: Pin, onSelect: () => setConversationPinned(conversation.id, true) },
    { label: "Delete", Icon: Trash2, onSelect: () => setConfirming(true), destructive: true },
  ];

  function confirmDelete() {
    deleteConversation(conversation.id);
    setConfirming(false);
    toast("Chat deleted");
    if (active) {
      const next = getMostRecentConversationId();
      router.replace(next ? `/chat/${next}` : "/chat/new");
    }
  }

  const rowHeight = variant === "sheet" ? "h-11" : "h-9";

  if (editing) {
    return (
      <li>
        <RenameField
          initial={conversation.title}
          className={rowHeight}
          onDone={(title) => {
            if (title !== null) renameConversation(conversation.id, title);
            setEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <li className="group/row relative">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Link
            href={`/chat/${conversation.id}`}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "long-press flex items-center rounded-lg pr-10 pl-3 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40",
              rowHeight,
              active ? "bg-brand-soft font-medium text-brand-text" : "hover:bg-accent",
            )}
          >
            <span className="truncate">{conversation.title}</span>
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-44">
          {actions.map(({ label, Icon, onSelect, destructive }) => (
            <MenuItemWithSeparator key={label} destructive={destructive}>
              <ContextMenuItem variant={destructive ? "destructive" : "default"} onSelect={onSelect}>
                <Icon strokeWidth={1.5} />
                {label}
              </ContextMenuItem>
            </MenuItemWithSeparator>
          ))}
        </ContextMenuContent>
      </ContextMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Options for ${conversation.title}`}
            className={cn(
              "absolute top-1/2 right-1 -translate-y-1/2",
              variant === "sheet"
                ? "size-11"
                : "opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100",
            )}
          >
            <MoreHorizontal strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>
        {/* Don't hand focus back to "…" after Rename: the title field wants it. */}
        <DropdownMenuContent align="end" className="w-44" onCloseAutoFocus={(e) => e.preventDefault()}>
          {actions.map(({ label, Icon, onSelect, destructive }) => (
            <MenuItemWithSeparator key={label} destructive={destructive} dropdown>
              <DropdownMenuItem variant={destructive ? "destructive" : "default"} onSelect={onSelect}>
                <Icon strokeWidth={1.5} />
                {label}
              </DropdownMenuItem>
            </MenuItemWithSeparator>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConversationDialog
        title={conversation.title}
        open={confirming}
        onOpenChange={setConfirming}
        onConfirm={confirmDelete}
      />
    </li>
  );
}

/** Puts a divider above the destructive action. */
function MenuItemWithSeparator({
  destructive,
  dropdown,
  children,
}: {
  destructive?: boolean;
  dropdown?: boolean;
  children: ReactNode;
}) {
  if (!destructive) return <>{children}</>;
  return (
    <>
      {dropdown ? <DropdownMenuSeparator /> : <ContextMenuSeparator />}
      {children}
    </>
  );
}

/** Inline title editor: Enter or blur saves, Escape cancels. */
function RenameField({
  initial,
  className,
  onDone,
}: {
  initial: string;
  className: string;
  onDone: (title: string | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const finished = useRef(false);

  // Focus after the menu has finished closing.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.select();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function finish(value: string | null) {
    if (finished.current) return;
    finished.current = true;
    onDone(value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      finish(e.currentTarget.value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation(); // don't also close the history sheet
      finish(null);
    }
  }

  return (
    <Input
      ref={ref}
      defaultValue={initial}
      aria-label="Chat title"
      onKeyDown={handleKeyDown}
      onBlur={(e) => finish(e.currentTarget.value)}
      className={cn("rounded-lg px-3 text-base md:text-sm", className)}
    />
  );
}
