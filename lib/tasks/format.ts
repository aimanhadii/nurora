import { formatDay, formatTime } from "@/lib/time";
import type { Task } from "@/lib/types";

/** "3:00 pm", "All day", "Tomorrow · 9:30 am", "Thu 16 Oct" — or null for someday tasks. */
export function taskTimeLabel(task: Task, now: Date): string | null {
  if (!task.dueAt) return null;
  const day = formatDay(task.dueAt, now);
  if (task.allDay) return day === "Today" ? "All day" : day;
  const time = formatTime(task.dueAt);
  return day === "Today" ? time : `${day} · ${time}`;
}

/** Just the time ("3:00 pm") or "All day" — for lists already grouped by day. */
export function taskTimeOnly(task: Task): string | null {
  if (!task.dueAt) return null;
  return task.allDay ? "All day" : formatTime(task.dueAt);
}
