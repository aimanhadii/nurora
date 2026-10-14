// Temporary in-browser data store (saved to localStorage).
// Slice 2 replaces this with Supabase.

import { useSyncExternalStore } from "react";
import { dateKey, dateKeyInDays, localToUtcIso, timeKey } from "./time";
import type { Message, NewTaskInput, Task } from "./types";

type LocalState = {
  tasks: Task[];
  messages: Message[];
  savedAffirmations: string[];
};

const STORAGE_KEY = "ilmora:v3";
/** Where data lived before the app was renamed; moved over once. */
const LEGACY_STORAGE_KEY = "teman:v3";

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

const HOUR = 60 * 60 * 1000;

/** Realistic sample data, with times relative to now so it always looks alive. */
function seed(): LocalState {
  const now = new Date();
  const day = (offset: number) => dateKeyInDays(now, offset);
  const at = (offset: number, time?: string) => localToUtcIso(day(offset), time);

  const make = (
    title: string,
    dueAt: string | null,
    opts: { notes?: string; allDay?: boolean; doneAt?: string } = {},
  ): Task => ({
    id: newId(),
    title,
    notes: opts.notes,
    dueAt,
    allDay: opts.allDay ?? false,
    status: opts.doneAt ? "done" : "pending",
    completedAt: opts.doneAt ?? null,
    createdAt: now.toISOString(),
  });

  // Next two timed tasks: ~75 min from now (rounded to 15 min), then +3h.
  // If that runs past midnight they move to tomorrow.
  const slot = new Date(Math.ceil((now.getTime() + 75 * 60_000) / (15 * 60_000)) * 15 * 60_000);
  const slotDay = dateKey(slot) === day(0) ? 0 : 1;
  const later = new Date(slot.getTime() + 3 * HOUR);
  const laterDay = dateKey(later) === day(slotDay) ? slotDay : slotDay + 1;

  const doneOn = (offset: number, time: string) => at(offset, time);
  const history: [number, string[]][] = [
    [-1, ["Laundry", "Grocery run", "Read 20 pages"]],
    [-2, ["Yoga class", "Pay electricity bill"]],
    [-3, ["Meal prep for the week", "Morning walk", "Call Aisyah", "Clear email inbox"]],
    // -4: a rest day, which is what ends the streak at 4.
    [-5, ["Morning walk", "Water the plants"]],
    [-6, ["Weekly review"]],
  ];

  return {
    tasks: [
      // Today
      make("Morning walk", at(0, "07:00"), {
        doneAt: new Date(now.getTime() - 3 * HOUR).toISOString(),
      }),
      make("Reply to Mak's WhatsApp", at(0), {
        allDay: true,
        doneAt: new Date(now.getTime() - HOUR).toISOString(),
      }),
      make("Review Q3 budget deck", at(slotDay, timeKey(slot.toISOString())), {
        notes: "Check the numbers on slide 12 with Farah",
      }),
      make("Gym — leg day", at(laterDay, timeKey(later.toISOString())), {
        notes: "Squats, lunges, 20 min stretch",
      }),
      make("Drink 2L water", at(0), { allDay: true }),
      // Overdue
      make("Pay phone bill", at(-1, "21:00"), { notes: "Maxis · RM 98" }),
      // Upcoming
      make("Dentist appointment", at(1, "09:30"), { notes: "Klinik Pergigian, Bangsar" }),
      make("Call mum", at(1, "20:00")),
      make("Submit medical claim", at(2), { allDay: true, notes: "Receipts are in the blue folder" }),
      make("Dinner with Sarah", at(4, "20:00"), { notes: "Table for two at Fuego, TRX" }),
      make("Car service", at(6, "10:00")),
      // Someday
      make("Buy groceries", null, { notes: "Eggs, milk, bread, sambal" }),
      make("Book flights to Penang", null),
      // History: completed on previous days (feeds the streak and "This week").
      ...history.flatMap(([offset, titles]) =>
        titles.map((title, i) =>
          make(title, at(offset, "18:00"), { doneAt: doneOn(offset, `1${i + 2}:30`) }),
        ),
      ),
    ],
    messages: [],
    savedAffirmations: [],
  };
}

/** Moves data saved under the old app name to the new key (once). */
function migrateLegacyKey() {
  const old = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (old === null) return;
  if (localStorage.getItem(STORAGE_KEY) === null) localStorage.setItem(STORAGE_KEY, old);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

function load(): LocalState {
  try {
    migrateLegacyKey();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { savedAffirmations: [], ...JSON.parse(raw) } as LocalState;
  } catch {
    // Corrupt or blocked storage: start fresh.
  }
  // Save the sample data right away so a reload shows the same data.
  const fresh = seed();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    // Storage blocked: keep it in memory only.
  }
  return fresh;
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

function updateTasks(change: (tasks: Task[]) => Task[]) {
  update((s) => ({ ...s, tasks: change(s.tasks) }));
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

/** Adds a task and returns it (so callers can offer "Undo"). */
export function addTask(input: NewTaskInput): Task | null {
  const title = input.title.trim();
  if (!title) return null;
  const task: Task = {
    id: newId(),
    title,
    notes: input.notes?.trim() || undefined,
    ...schedule(input),
    status: "pending",
    completedAt: null,
    createdAt: new Date().toISOString(),
  };
  updateTasks((tasks) => [...tasks, task]);
  return task;
}

export function updateTask(id: string, input: NewTaskInput) {
  const title = input.title.trim();
  if (!title) return;
  updateTasks((tasks) =>
    tasks.map((t) =>
      t.id === id
        ? { ...t, title, notes: input.notes?.trim() || undefined, ...schedule(input) }
        : t,
    ),
  );
}

/** Replaces a task wholesale — used to undo edits like snooze or move. */
export function replaceTask(task: Task) {
  updateTasks((tasks) => tasks.map((t) => (t.id === task.id ? task : t)));
}

/** Moves a task to tomorrow, keeping its time of day. */
export function moveTaskToTomorrow(id: string) {
  const tomorrow = dateKeyInDays(new Date(), 1);
  updateTasks((tasks) =>
    tasks.map((t) => {
      if (t.id !== id) return t;
      const time = t.dueAt && !t.allDay ? timeKey(t.dueAt) : undefined;
      return {
        ...t,
        ...schedule({ title: t.title, date: tomorrow, time }),
        status: "pending",
        completedAt: null,
      };
    }),
  );
}

/** Pushes a timed task later by `minutes`. */
export function snoozeTask(id: string, minutes: number) {
  updateTasks((tasks) =>
    tasks.map((t) =>
      t.id === id && t.dueAt
        ? {
            ...t,
            allDay: false,
            dueAt: new Date(new Date(t.dueAt).getTime() + minutes * 60_000).toISOString(),
          }
        : t,
    ),
  );
}

/** Puts a deleted task back (for "Undo"). */
export function restoreTask(task: Task) {
  updateTasks((tasks) =>
    tasks.some((t) => t.id === task.id) ? tasks : [...tasks, task],
  );
}

export function setTaskDone(id: string, done: boolean) {
  updateTasks((tasks) =>
    tasks.map((t) =>
      t.id !== id
        ? t
        : done
          ? { ...t, status: "done", completedAt: new Date().toISOString() }
          : { ...t, status: "pending", completedAt: null },
    ),
  );
}

export function deleteTask(id: string) {
  updateTasks((tasks) => tasks.filter((t) => t.id !== id));
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

/** Saves or un-saves an affirmation. Returns true if it's now saved. */
export function toggleSavedAffirmation(text: string): boolean {
  const saved = getSnapshot().savedAffirmations.includes(text);
  update((s) => ({
    ...s,
    savedAffirmations: saved
      ? s.savedAffirmations.filter((a) => a !== text)
      : [...s.savedAffirmations, text],
  }));
  return !saved;
}

export function resetLocalData() {
  update(() => seed());
}
