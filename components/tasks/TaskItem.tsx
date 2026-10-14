"use client";

import { deleteTask, toggleTask } from "@/lib/local-store";
import { formatDay, formatTime } from "@/lib/time";
import type { Task } from "@/lib/types";
import { CheckIcon, TrashIcon } from "@/components/ui/icons";

function dueLabel(task: Task, now: Date): string | null {
  if (!task.dueAt) return null;
  const day = formatDay(task.dueAt, now);
  return task.allDay ? day : `${day}, ${formatTime(task.dueAt)}`;
}

export function TaskItem({
  task,
  now,
  overdue,
}: {
  task: Task;
  now: Date;
  overdue?: boolean;
}) {
  const done = task.status === "done";
  const label = dueLabel(task, now);

  return (
    <li className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm">
      <button
        type="button"
        onClick={() => toggleTask(task.id)}
        aria-label={done ? "Mark as not done" : "Mark as done"}
        className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition active:scale-90 ${
          done
            ? "border-rose-400 bg-rose-400 text-white"
            : "border-rose-300 text-transparent"
        }`}
      >
        <CheckIcon className="size-4" strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate ${done ? "text-stone-400 line-through" : "text-stone-800"}`}
        >
          {task.title}
        </p>
        {label && (
          <p
            className={`text-xs ${overdue && !done ? "text-rose-500" : "text-stone-400"}`}
          >
            {label}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          if (confirm(`Delete "${task.title}"?`)) deleteTask(task.id);
        }}
        aria-label="Delete task"
        className="p-1 text-stone-300 transition hover:text-rose-400"
      >
        <TrashIcon className="size-5" />
      </button>
    </li>
  );
}
