"use client";

import { useState } from "react";
import { CalendarClock, MoreHorizontal, Pencil, Share, Trash2 } from "lucide-react";
import {
  deleteTask,
  moveTaskToTomorrow,
  restoreTask,
  toggleTask,
} from "@/lib/local-store";
import { shareText } from "@/lib/share";
import { isOverdue } from "@/lib/tasks/group";
import { formatDay, formatTime } from "@/lib/time";
import { showToast } from "@/lib/toast";
import type { Task } from "@/lib/types";
import { ContextMenu, useContextMenu, type MenuItem } from "@/components/ui/ContextMenu";
import { Surface } from "@/components/ui/Surface";
import { TaskCheckbox } from "./TaskCheckbox";
import { TaskSheet } from "./TaskSheet";

// Long enough to see the check animation before the task moves to "Done".
const COMPLETE_DELAY_MS = 500;

function timeLabel(task: Task, now: Date): string | null {
  if (!task.dueAt) return null;
  const day = formatDay(task.dueAt, now);
  if (task.allDay) return day === "Today" ? "All day" : day;
  const time = formatTime(task.dueAt);
  return day === "Today" ? time : `${day} · ${time}`;
}

export function TaskItem({ task, now }: { task: Task; now: Date }) {
  const [completing, setCompleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const menu = useContextMenu();

  const done = task.status === "done" || completing;
  const overdue = !done && isOverdue(task, now);
  const label = timeLabel(task, now);

  function handleToggle() {
    if (task.status === "done") return toggleTask(task.id);
    setCompleting(true);
    setTimeout(() => toggleTask(task.id), COMPLETE_DELAY_MS);
  }

  const items: MenuItem[] = [
    { label: "Edit", Icon: Pencil, onSelect: () => setEditing(true) },
    {
      label: "Share",
      Icon: Share,
      onSelect: () => shareText(label ? `${task.title} — ${label}` : task.title),
    },
    {
      label: "Move to tomorrow",
      Icon: CalendarClock,
      onSelect: () => {
        moveTaskToTomorrow(task.id);
        showToast("Moved to tomorrow");
      },
    },
    {
      label: "Delete",
      Icon: Trash2,
      destructive: true,
      onSelect: () => {
        deleteTask(task.id);
        showToast("Task deleted", { label: "Undo", run: () => restoreTask(task) });
      },
    },
  ];

  return (
    <Surface
      variant="item"
      as="li"
      {...menu.targetProps}
      className="long-press @container flex min-h-14 items-center gap-3 rounded-item py-1.5 pr-1 pl-4"
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
            done ? "text-text-3 line-through decoration-text-3" : ""
          }`}
        >
          {task.title}
        </p>

        {label && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums ${
              overdue
                ? "bg-danger-soft text-danger-soft-fg"
                : "bg-surface-2 text-text-2"
            }`}
          >
            {overdue && <span className="sr-only">Overdue: </span>}
            {label}
          </span>
        )}
      </div>

      <button
        type="button"
        {...menu.buttonProps}
        aria-label={`Options for ${task.title}`}
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-text-3 transition hover:bg-surface-2 hover:text-text"
      >
        <MoreHorizontal className="size-5" strokeWidth={1.5} />
      </button>

      <ContextMenu
        position={menu.position}
        items={items}
        label={`Options for ${task.title}`}
        onClose={menu.close}
      />
      {editing && <TaskSheet task={task} onClose={() => setEditing(false)} />}
    </Surface>
  );
}
