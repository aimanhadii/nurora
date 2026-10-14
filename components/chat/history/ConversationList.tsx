"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useConversations } from "@/lib/conversations";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConversationRow } from "./ConversationRow";
import { filterConversations, groupConversations } from "./group";

/** Grouped, searchable chat history. Shared by the sidebar and the phone sheet. */
export function ConversationList({
  query,
  variant,
  onNavigate,
}: {
  query: string;
  variant: "sidebar" | "sheet";
  onNavigate?: () => void;
}) {
  const conversations = useConversations();
  const now = useNow(60_000);
  const pathname = usePathname();
  if (!conversations || !now) return null;

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-3 py-6 text-center">
        <MessageCircle className="size-5 text-muted-foreground" strokeWidth={1.5} />
        <p className="text-meta text-muted-foreground">No chats yet</p>
        <Button asChild variant="outline" size="sm" className="h-11 md:h-8">
          <Link href="/chat/new" onClick={onNavigate}>
            Start a new chat
          </Link>
        </Button>
      </div>
    );
  }

  const groups = groupConversations(filterConversations(conversations, query), now);
  if (groups.length === 0) {
    return (
      <p className="px-3 py-6 text-center text-meta text-muted-foreground">
        No chats match “{query.trim()}”
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <section key={group.label} aria-label={group.label}>
          <h3 className={cn("px-3 pb-1 text-xs text-muted-foreground", variant === "sheet" && "pb-2")}>
            {group.label}
          </h3>
          <ul className="space-y-px">
            {group.items.map((c) => (
              <ConversationRow
                key={c.id}
                conversation={c}
                active={pathname === `/chat/${c.id}`}
                variant={variant}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
