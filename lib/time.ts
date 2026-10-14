// All times are stored in UTC. These helpers convert to and from the
// user's timezone for display and for reading form inputs.

export const DEFAULT_TIMEZONE = "Asia/Kuala_Lumpur";

const DAY_MS = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" for the given instant, as seen in `timeZone`. */
export function dateKey(date: Date, timeZone = DEFAULT_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** How far `timeZone` is ahead of UTC at the given instant, in ms. */
function offsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(date);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/**
 * Turns a local date ("2026-10-14") and optional time ("15:00") in
 * `timeZone` into a UTC ISO string. No time means start of that day.
 */
export function localToUtcIso(
  date: string,
  time?: string,
  timeZone = DEFAULT_TIMEZONE,
): string {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time || "00:00").split(":").map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d, hh, mm));
  return new Date(guess.getTime() - offsetMs(guess, timeZone)).toISOString();
}

/** "3:00 PM" in the user's timezone. */
export function formatTime(iso: string, timeZone = DEFAULT_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

/** "Today", "Tomorrow", "Yesterday" or "Wed, 16 Oct". */
export function formatDay(
  iso: string,
  now: Date,
  timeZone = DEFAULT_TIMEZONE,
): string {
  const key = dateKey(new Date(iso), timeZone);
  if (key === dateKey(now, timeZone)) return "Today";
  if (key === dateKey(new Date(now.getTime() + DAY_MS), timeZone))
    return "Tomorrow";
  if (key === dateKey(new Date(now.getTime() - DAY_MS), timeZone))
    return "Yesterday";
  return new Intl.DateTimeFormat("en-MY", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

/** "Wednesday, 14 October" in the user's timezone. */
export function formatLongDate(date: Date, timeZone = DEFAULT_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

/** Time-of-day greeting based on the hour in the user's timezone. */
export function greeting(date: Date, timeZone = DEFAULT_TIMEZONE): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "numeric",
      hourCycle: "h23",
    }).format(date),
  );
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** "YYYY-MM-DD" for `days` days after `now`, in `timeZone`. */
export function dateKeyInDays(
  now: Date,
  days: number,
  timeZone = DEFAULT_TIMEZONE,
): string {
  return dateKey(new Date(now.getTime() + days * DAY_MS), timeZone);
}
