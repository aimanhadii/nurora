import { Suspense, ViewTransition } from "react";
import { ChatScreen } from "@/components/chat/ChatScreen";
import { ConversationFromUrl } from "./ConversationFromUrl";

/**
 * One conversation. The id is only known at request time, so it's read
 * inside <Suspense>; the fallback is the same screen in its loading state.
 */
export default function ConversationPage() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <Suspense fallback={<ChatScreen conversationId={undefined} />}>
        <ConversationFromUrl />
      </Suspense>
    </ViewTransition>
  );
}
