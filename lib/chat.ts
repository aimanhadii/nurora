import { useSyncExternalStore } from "react";
import { appendMessage, createConversation } from "./conversations";
import { fakeReply } from "./fake-bot";
import { getLocalData } from "./local-store";

// Sending lives here (not inside the chat screen) so other screens, like
// "Ask Nurora" on Home, can send and then navigate to Chat while the reply
// is still being "typed".

/** The conversation whose reply is being "typed", if any. */
let typingIn: string | null = null;
const listeners = new Set<() => void>();

function setTypingIn(value: string | null) {
  typingIn = value;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Sends a message into `conversationId`, or starts a new conversation when
 * it's null (an unsaved "New chat" is only saved here, on first send).
 * Returns the conversation id, or null if nothing was sent.
 */
export function sendChatMessage(text: string, conversationId: string | null): string | null {
  const trimmed = text.trim();
  if (!trimmed || typingIn) return null;
  const id = conversationId ?? createConversation(trimmed).id;
  if (!appendMessage(id, "user", trimmed)) return null;
  setTypingIn(id);
  setTimeout(
    () => {
      appendMessage(id, "assistant", fakeReply(trimmed, getLocalData().tasks, new Date()));
      setTypingIn(null);
    },
    900 + Math.random() * 600,
  );
  return id;
}

/** True while a reply is being "typed" in this conversation. */
export function useTyping(conversationId: string | null | undefined): boolean {
  return useSyncExternalStore(
    subscribe,
    () => conversationId != null && typingIn === conversationId,
    () => false,
  );
}

/** True while any reply is being typed (sending pauses until it lands). */
export function useAnyTyping(): boolean {
  return useSyncExternalStore(subscribe, () => typingIn !== null, () => false);
}
