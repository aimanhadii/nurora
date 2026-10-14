import { dateKey, DEFAULT_TIMEZONE } from "@/lib/time";
import type { Task } from "@/lib/types";

export type TaskGroups = {
  overdue: Task[];
  today: Task[];
  upcoming: Task[];
  someday: Task[];
  done: Task[];
};

const byDue = (a: Task, b: Task) =>
  (a.dueAt ?? "").localeCompare(b.dueAt ?? "");

/** Sorts tasks into the sections shown on the task list. */
export function groupTasks(
  tasks: Task[],
  now: Date,
  timeZone = DEFAULT_TIMEZONE,
): TaskGroups {
  const todayKey = dateKey(now, timeZone);
  const groups: TaskGroups = {
    overdue: [],
    today: [],
    upcoming: [],
    someday: [],
    done: [],
  };

  for (const task of tasks) {
    if (task.status === "done") groups.done.push(task);
    else if (!task.dueAt) groups.someday.push(task);
    else {
      const key = dateKey(new Date(task.dueAt), timeZone);
      if (key < todayKey) groups.overdue.push(task);
      else if (key === todayKey) groups.today.push(task);
      else groups.upcoming.push(task);
    }
  }

  groups.overdue.sort(byDue);
  groups.today.sort(byDue);
  groups.upcoming.sort(byDue);
  groups.done.sort((a, b) =>
    (b.completedAt ?? "").localeCompare(a.completedAt ?? ""),
  );
  return groups;
}
