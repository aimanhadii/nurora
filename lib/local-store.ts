// Temporary in-browser data store (saved to localStorage).
// Slice 2 replaces this with Supabase.

import { useSyncExternalStore } from "react";
import { dateKeyInDays, localToUtcIso, timeKey } from "./time";
import type { Message, NewTaskInput, Task } from "./types";

type LocalState = {
  tasks: Task[];
  messages: Message[];
};

const STORAGE_KEY = "teman:v2";

let state: LocalState | null = null;
const listeners = new Set<() => void>();

// crypto.randomUUID only exists on https/localhost, and the phone hits
// the dev server over plain http on the LAN.
function newId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  );
}

function seed(): LocalState {
  const now = new Date();
  const createdAt = now.toISOString();
  const today = dateKeyInDays(now, 0);
  const tomorrow = dateKeyInDays(now, 1);
  const yesterday = dateKeyInDays(now, -1);

  const task = (
    title: string,
    dueAt: string | null,
    allDay = false,
    done = false,
  ): Task => ({
    id: newId(),
    title,
    dueAt,
    allDay,
    status: done ? "done" : "pending",
    completedAt: done ? createdAt : null,
    createdAt,
  });

  return {
    tasks: [
      task("Pay phone bill", localToUtcIso(yesterday, "21:00")),
      task("Team meeting", localToUtcIso(today, "15:00")),
      task("Drink 2L water", localToUtcIso(today), true),
      task("Gym", localToUtcIso(tomorrow, "19:00")),
      task("Buy groceries", null),
      task("Morning walk", localToUtcIso(today, "07:00"), false, true),
    ],
    messages: [],
  };
}

function load(): LocalState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LocalState;
  } catch {
    // Corrupt or blocked storage: start fresh.
  }
  return seed();
}

function getSnapshot(): LocalState {
  if (!state) state = load();
  return state;
}

// On the server there is no localStorage, so there is no data yet.
function getServerSnapshot(): LocalState | null {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function update(change: (current: LocalState) => LocalState) {
  state = change(getSnapshot());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: keep working in memory.
  }
  listeners.forEach((listener) => listener());
}

/** Current data, for use outside React (e.g. inside event handlers). */
export function getLocalData(): LocalState {
  return getSnapshot();
}

/** Returns null until the browser has loaded the data. */
export function useLocalData(): LocalState | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function schedule(input: NewTaskInput): Pick<Task, "dueAt" | "allDay"> {
  return {
    dueAt: input.date ? localToUtcIso(input.date, input.time) : null,
    allDay: Boolean(input.date && !input.time),
  };
}

export function addTask(input: NewTaskInput) {
  const title = input.title.trim();
  if (!title) return;
  const task: Task = {
    id: newId(),
    title,
    ...schedule(input),
    status: "pending",
    completedAt: null,
    createdAt: new Date().toISOString(),
  };
  update((s) => ({ ...s, tasks: [...s.tasks, task] }));
}

export function updateTask(id: string, input: NewTaskInput) {
  const title = input.title.trim();
  if (!title) return;
  update((s) => ({
    ...s,
    tasks: s.tasks.map((t) =>
      t.id === id ? { ...t, title, ...schedule(input) } : t,
    ),
  }));
}

/** Moves a task to tomorrow, keeping its time of day. */
export function moveTaskToTomorrow(id: string) {
  const tomorrow = dateKeyInDays(new Date(), 1);
  update((s) => ({
    ...s,
    tasks: s.tasks.map((t) => {
      if (t.id !== id) return t;
      const time = t.dueAt && !t.allDay ? timeKey(t.dueAt) : undefined;
      return {
        ...t,
        ...schedule({ title: t.title, date: tomorrow, time }),
        status: "pending",
        completedAt: null,
      };
    }),
  }));
}

/** Puts a deleted task back (for "Undo"). */
export function restoreTask(task: Task) {
  update((s) =>
    s.tasks.some((t) => t.id === task.id)
      ? s
      : { ...s, tasks: [...s.tasks, task] },
  );
}

export function toggleTask(id: string) {
  update((s) => ({
    ...s,
    tasks: s.tasks.map((t) =>
      t.id !== id
        ? t
        : t.status === "done"
          ? { ...t, status: "pending", completedAt: null }
          : { ...t, status: "done", completedAt: new Date().toISOString() },
    ),
  }));
}

export function deleteTask(id: string) {
  update((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
}

export function addMessage(role: Message["role"], content: string) {
  const message: Message = {
    id: newId(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
  update((s) => ({ ...s, messages: [...s.messages, message] }));
}

export function deleteMessage(id: string) {
  update((s) => ({ ...s, messages: s.messages.filter((m) => m.id !== id) }));
}

/** Puts a deleted message back in its original place (for "Undo"). */
export function restoreMessage(message: Message) {
  update((s) =>
    s.messages.some((m) => m.id === message.id)
      ? s
      : {
          ...s,
          messages: [...s.messages, message].sort((a, b) =>
            a.createdAt.localeCompare(b.createdAt),
          ),
        },
  );
}

export function resetLocalData() {
  update(() => seed());
}
