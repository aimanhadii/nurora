import { dateKey, dateKeyInDays } from "@/lib/time";
import type { Conversation } from "@/lib/types";

export type ConversationGroup = { label: string; items: Conversation[] };

const ORDER = ["Pinned", "Today", "Yesterday", "Previous 7 days", "Older"];

/** Buckets conversations (already newest-first) under the history labels. */
export function groupConversations(conversations: Conversation[], now: Date): ConversationGroup[] {
  const today = dateKey(now);
  const yesterday = dateKeyInDays(now, -1);
  const weekAgo = dateKeyInDays(now, -7);
  const buckets = new Map<string, Conversation[]>();

  for (const c of conversations) {
    const day = dateKey(new Date(c.updatedAt));
    const label = c.pinned
      ? "Pinned"
      : day === today
        ? "Today"
        : day === yesterday
          ? "Yesterday"
          : day >= weekAgo
            ? "Previous 7 days"
            : "Older";
    buckets.set(label, [...(buckets.get(label) ?? []), c]);
  }

  return ORDER.filter((label) => buckets.has(label)).map((label) => ({
    label,
    items: buckets.get(label)!,
  }));
}

/** Case-insensitive title filter. */
export function filterConversations(conversations: Conversation[], query: string): Conversation[] {
  const q = query.trim().toLowerCase();
  return q ? conversations.filter((c) => c.title.toLowerCase().includes(q)) : conversations;
}
