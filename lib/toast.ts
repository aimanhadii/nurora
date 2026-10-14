import { useSyncExternalStore } from "react";

// One short-lived notice at a time, e.g. "Task deleted · Undo".

export type Toast = {
  id: number;
  message: string;
  action?: { label: string; run: () => void };
};

let current: Toast | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function showToast(message: string, action?: Toast["action"]) {
  clearTimeout(timer);
  current = { id: Date.now(), message, action };
  emit();
  timer = setTimeout(dismissToast, action ? 5000 : 2500);
}

export function dismissToast() {
  clearTimeout(timer);
  current = null;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useToast(): Toast | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
