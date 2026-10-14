"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMostRecentConversationId, useConversations } from "@/lib/conversations";
import { ChatScreen } from "@/components/chat/ChatScreen";

/** /chat → the most recent conversation, or a new one if there are none. */
export default function ChatIndexPage() {
  const router = useRouter();
  const conversations = useConversations();

  useEffect(() => {
    if (!conversations) return;
    const id = getMostRecentConversationId();
    router.replace(id ? `/chat/${id}` : "/chat/new");
  }, [conversations, router]);

  // Same screen in its loading state, so nothing jumps while redirecting.
  return <ChatScreen conversationId={undefined} />;
}
