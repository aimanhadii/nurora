import { useSyncExternalStore } from "react";

// One shared clock for the whole app, ticking every 30s while anything
// is listening. It is null on the server, where "now" would be the
// server's time and get baked into the HTML.

let now: Date | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function tick() {
  now = new Date();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    now = new Date();
    timer = setInterval(tick, 30_000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

function getSnapshot(): Date {
  if (!now) now = new Date();
  return now;
}

export function useNow(): Date | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
