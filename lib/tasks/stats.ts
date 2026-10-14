import { dateKey, dateKeyInDays, DEFAULT_TIMEZONE } from "@/lib/time";
import type { Task } from "@/lib/types";

/** Days in a row (ending today, or yesterday if nothing is done yet today) with ≥1 task done. */
export function streakDays(tasks: Task[], now: Date, timeZone = DEFAULT_TIMEZONE): number {
  const doneDays = new Set(
    tasks
      .filter((t) => t.completedAt)
      .map((t) => dateKey(new Date(t.completedAt!), timeZone)),
  );
  let offset = doneDays.has(dateKeyInDays(now, 0, timeZone)) ? 0 : -1;
  let streak = 0;
  while (doneDays.has(dateKeyInDays(now, offset, timeZone))) {
    streak++;
    offset--;
  }
  return streak;
}

export type DayCount = { key: string; label: string; count: number; isToday: boolean };

/** Tasks completed on each of the last 7 days, oldest first. */
export function lastSevenDays(tasks: Task[], now: Date, timeZone = DEFAULT_TIMEZONE): DayCount[] {
  const counts = new Map<string, number>();
  for (const t of tasks) {
    if (!t.completedAt) continue;
    const key = dateKey(new Date(t.completedAt), timeZone);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const weekday = new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "narrow" });
  return Array.from({ length: 7 }, (_, i) => {
    const offset = i - 6;
    const key = dateKeyInDays(now, offset, timeZone);
    return {
      key,
      label: weekday.format(new Date(now.getTime() + offset * 86_400_000)),
      count: counts.get(key) ?? 0,
      isToday: offset === 0,
    };
  });
}

/** The next timed task that hasn't started yet (today first, then later days). */
export function nextUpTask(tasks: Task[], now: Date): Task | null {
  const iso = now.toISOString();
  return (
    tasks
      .filter((t) => t.status === "pending" && t.dueAt && !t.allDay && t.dueAt > iso)
      .sort((a, b) => a.dueAt!.localeCompare(b.dueAt!))[0] ?? null
  );
}

/** "1h 24m", "12m 05s", "now" — digits only, so it can be set in mono. */
export function countdown(target: string, now: Date): string {
  const ms = new Date(target).getTime() - now.getTime();
  if (ms <= 0) return "now";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}
