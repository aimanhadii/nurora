import { useSyncExternalStore } from "react";

// Shared clocks, one per tick speed (e.g. 30s for most UI, 1s for a
// countdown). Each only runs while something is listening. They return
// null on the server, where "now" would be the server's time and get
// baked into the HTML.

type Clock = {
  now: Date | null;
  timer?: ReturnType<typeof setInterval>;
  listeners: Set<() => void>;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => Date;
};

const clocks = new Map<number, Clock>();

function getClock(intervalMs: number): Clock {
  const existing = clocks.get(intervalMs);
  if (existing) return existing;

  const clock: Clock = {
    now: null,
    listeners: new Set(),
    subscribe(listener) {
      clock.listeners.add(listener);
      if (!clock.timer) {
        clock.now = new Date();
        clock.timer = setInterval(() => {
          clock.now = new Date();
          clock.listeners.forEach((l) => l());
        }, intervalMs);
      }
      return () => {
        clock.listeners.delete(listener);
        if (clock.listeners.size === 0) {
          clearInterval(clock.timer);
          clock.timer = undefined;
        }
      };
    },
    getSnapshot() {
      if (!clock.now) clock.now = new Date();
      return clock.now;
    },
  };
  clocks.set(intervalMs, clock);
  return clock;
}

export function useNow(intervalMs = 30_000): Date | null {
  const clock = getClock(intervalMs);
  return useSyncExternalStore(clock.subscribe, clock.getSnapshot, () => null);
}
