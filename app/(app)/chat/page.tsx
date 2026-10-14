import type { Metadata } from "next";
import { ViewTransition } from "react";
import { ChatScreen } from "@/components/chat/ChatScreen";

export const metadata: Metadata = { title: "Chat · Teman" };

export default function ChatPage() {
  return (
    // Crossfades when switching tabs.
    <ViewTransition enter="auto" exit="auto" default="none">
      <ChatScreen />
    </ViewTransition>
  );
}
