import type { Metadata } from "next";
import { ViewTransition } from "react";
import { ChatScreen } from "@/components/chat/ChatScreen";

export const metadata: Metadata = { title: "New chat" };

/** A fresh, unsaved chat. It's saved on the first message. */
export default function NewChatPage() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <ChatScreen conversationId={null} />
    </ViewTransition>
  );
}
