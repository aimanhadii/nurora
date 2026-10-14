"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteTask, toggleTask } from "@/lib/local-store";
import { isOverdue } from "@/lib/tasks/group";
import { formatDay, formatTime } from "@/lib/time";
import type { Task } from "@/lib/types";
import { TaskCheckbox } from "./TaskCheckbox";

// Long enough to see the check animation before the task moves to "Done".
const COMPLETE_DELAY_MS = 450;

function timeLabel(task: Task, now: Date): string | null {
  if (!task.dueAt) return null;
  const day = formatDay(task.dueAt, now);
  if (task.allDay) return day === "Today" ? "All day" : day;
  const time = formatTime(task.dueAt);
  return day === "Today" ? time : `${day} · ${time}`;
}

export function TaskItem({ task, now }: { task: Task; now: Date }) {
  const [completing, setCompleting] = useState(false);
  const done = task.status === "done" || completing;
  const overdue = !done && isOverdue(task, now);
  const label = timeLabel(task, now);

  function handleToggle() {
    if (task.status === "done") return toggleTask(task.id);
    setCompleting(true);
    setTimeout(() => toggleTask(task.id), COMPLETE_DELAY_MS);
  }

  return (
    <li
      className={`group @container flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-2 transition-colors ${
        overdue ? "border-danger/25 bg-danger/[0.04]" : "border-line bg-surface"
      }`}
    >
      <TaskCheckbox
        checked={done}
        onToggle={handleToggle}
        label={`${done ? "Mark as not done" : "Complete"}: ${task.title}`}
      />

      {/* Narrow row: chip under the title. Wide row: chip on the right.
          "@md:" reacts to this row's own width, not the screen's. */}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1 py-1 @md:flex-row @md:items-center @md:gap-3">
        <p
          className={`w-full min-w-0 truncate text-[15px] transition-colors duration-300 @md:flex-1 ${
            done ? "text-subtle line-through" : ""
          }`}
        >
          {task.title}
        </p>

        {label && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums ${
              overdue ? "bg-danger/10 text-danger" : "bg-surface-2 text-muted"
            }`}
          >
            {overdue && <span className="sr-only">Overdue: </span>}
            {label}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          if (confirm(`Delete “${task.title}”?`)) deleteTask(task.id);
        }}
        aria-label={`Delete ${task.title}`}
        className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-subtle transition hover:text-danger focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        <Trash2 className="size-[18px]" strokeWidth={1.75} />
      </button>
    </li>
  );
}
