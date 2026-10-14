import { useSyncExternalStore } from "react";
import { fakeReply } from "./fake-bot";
import { addMessage, getLocalData } from "./local-store";

// Sending lives here (not inside the chat screen) so other screens, like
// "Ask Ilmora" on Home, can send and then navigate to Chat while the reply
// is still being "typed".

let typing = false;
const listeners = new Set<() => void>();

function setTyping(value: boolean) {
  typing = value;
  listeners.forEach((listener) => listener());
}

export function sendChatMessage(text: string) {
  const trimmed = text.trim();
  if (!trimmed || typing) return;
  addMessage("user", trimmed);
  setTyping(true);
  setTimeout(
    () => {
      addMessage("assistant", fakeReply(trimmed, getLocalData().tasks, new Date()));
      setTyping(false);
    },
    900 + Math.random() * 600,
  );
}

export function useTyping(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => typing,
    () => false,
  );
}
