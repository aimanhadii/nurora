"use client";

import { useParams } from "next/navigation";
import { ChatScreen } from "@/components/chat/ChatScreen";

export function ConversationFromUrl() {
  const { id } = useParams<{ id: string }>();
  return <ChatScreen conversationId={id} />;
}
