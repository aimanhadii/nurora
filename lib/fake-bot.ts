// Canned replies until the real agent arrives in slice 3.
// Plain code reading local tasks, no AI involved.

import { groupTasks } from "./tasks/group";
import { formatDay, formatTime } from "./time";
import type { Task } from "./types";

const HYPE = [
  "You've handled every hard day so far — that's a 100% track record. Today's no different 💪",
  "Small steps still move you forward. Pick one thing and start; momentum will do the rest.",
  "You don't need to feel ready. You just need to begin. Jom!",
  "Rest is part of the plan, not a break from it. Be kind to yourself today.",
];

function taskLine(task: Task, now: Date): string {
  if (!task.dueAt || task.allDay) return `• ${task.title}`;
  const day = formatDay(task.dueAt, now);
  const time = formatTime(task.dueAt);
  return `• ${day === "Today" ? time : `${day}, ${time}`} — ${task.title}`;
}

export function fakeReply(text: string, tasks: Task[], now: Date): string {
  const groups = groupTasks(tasks, now);
  const message = text.trim().toLowerCase();

  if (message === "plan my day") {
    const todo = [...groups.overdue, ...groups.today];
    if (todo.length === 0)
      return "Your day is wide open ✨ Want to add something, or just enjoy it?";
    return `Here's your day:\n${todo.map((t) => taskLine(t, now)).join("\n")}`;
  }

  if (message === "what's next?") {
    const next =
      groups.today.find((t) => t.dueAt && !t.allDay && t.dueAt > now.toISOString()) ??
      groups.overdue[0] ??
      groups.today[0] ??
      groups.upcoming[0];
    return next
      ? `Next up:\n${taskLine(next, now)}`
      : "Nothing scheduled — you're all caught up 🙌";
  }

  if (message === "hype me up") {
    return HYPE[Math.floor(Math.random() * HYPE.length)];
  }

  if (message === "add a task") {
    return "Just tell me what and when — like “esok 3pm meeting”. I'm still in practice mode though, so for now add it from the Tasks tab ✍️";
  }

  return `Noted! I'm still in practice mode — my brain gets connected soon.\n\nYou said: “${text}”`;
}
