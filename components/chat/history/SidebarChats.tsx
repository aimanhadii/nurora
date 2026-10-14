"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useConversations } from "@/lib/conversations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConversationList } from "./ConversationList";

/** "New chat" + searchable Recents, under the Chat nav item on desktop. */
export function SidebarChats() {
  const [query, setQuery] = useState("");
  const conversations = useConversations();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="outline" className="h-10 w-full justify-start gap-3 rounded-lg px-3">
            <Link href="/chat/new">
              <Plus className="size-5" strokeWidth={1.5} />
              New chat
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">New chat · Ctrl/⌘ + Shift + O</TooltipContent>
      </Tooltip>

      <div className="flex min-h-0 flex-1 flex-col">
        <p className="px-3 pb-2 text-meta text-muted-foreground">Recents</p>
        {conversations && conversations.length > 0 && (
          <div className="relative mb-3">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.5}
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              aria-label="Search chats"
              className="h-9 pl-9 text-sm md:h-9"
            />
          </div>
        )}
        <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
          <ConversationList query={query} variant="sidebar" />
        </div>
      </div>
    </div>
  );
}
