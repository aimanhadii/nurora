import type { Metadata } from "next";
import { ChatScreen } from "@/components/chat/ChatScreen";

export const metadata: Metadata = { title: "Chat · Teman" };

export default function ChatPage() {
  return <ChatScreen />;
}
