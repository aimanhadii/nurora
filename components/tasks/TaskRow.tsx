"use client";

import { useState, type ReactNode } from "react";
import { CalendarClock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { setTaskDone } from "@/lib/local-store";
import {
  completeTaskWithToast,
  deleteTaskWithToast,
  moveToTomorrowWithToast,
} from "@/lib/tasks/actions";
import { taskTimeLabel, taskTimeOnly } from "@/lib/tasks/format";
import { isOverdue } from "@/lib/tasks/group";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskFormDialog } from "./TaskFormDialog";

// Long enough to see the check animation before the task moves away.
const COMPLETE_DELAY_MS = 450;

export function TaskRow({
  task,
  now,
  compact = false,
  timeOnly = false,
}: {
  task: Task;
  now: Date;
  /** Hide the notes line (Home's Today card). */
  compact?: boolean;
  /** Show "3:00 pm" instead of "Tomorrow · 3:00 pm" (lists already grouped by day). */
  timeOnly?: boolean;
}) {
  const [completing, setCompleting] = useState(false);
  const [editing, setEditing] = useState(false);

  const done = task.status === "done" || completing;
  const overdue = !done && isOverdue(task, now);
  const label = timeOnly && !overdue ? taskTimeOnly(task) : taskTimeLabel(task, now);

  function handleCheckedChange(checked: boolean) {
    if (!checked) return setTaskDone(task.id, false);
    setCompleting(true);
    setTimeout(() => completeTaskWithToast(task), COMPLETE_DELAY_MS);
  }

  return (
    <li className="group @container flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-accent/60">
      <Checkbox
        checked={done}
        onCheckedChange={(c) => handleCheckedChange(c === true)}
        aria-label={`${done ? "Mark as not done" : "Complete"}: ${task.title}`}
      />

      {/* Narrow row (phones, Home card): time chip under the title.
          Wide row: chip on the right. "@lg:" reacts to the row's own width. */}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2 @lg:flex-row @lg:gap-3">
        <div className="w-full min-w-0 @lg:flex-1">
          <p
            className={cn(
              "truncate text-sm transition-colors duration-300",
              done && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </p>
          {!compact && task.notes && (
            <p className="mt-1 truncate text-meta text-muted-foreground">{task.notes}</p>
          )}
        </div>

        {label && (
          <Badge
            variant={overdue ? "warning" : "brand"}
            className="font-mono tabular-nums"
          >
            {overdue && <span className="sr-only">Overdue: </span>}
            {label}
          </Badge>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Options for ${task.title}`}
            // 44px tap target on phones; on desktop it appears on hover/focus.
            className="-my-3 size-11 md:-my-1 md:size-8 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 md:aria-expanded:opacity-100"
          >
            <MoreHorizontal strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={() => setEditing(true)}>
            <Pencil strokeWidth={1.5} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => moveToTomorrowWithToast(task)}>
            <CalendarClock strokeWidth={1.5} />
            Move to tomorrow
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => deleteTaskWithToast(task)}>
            <Trash2 strokeWidth={1.5} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TaskFormDialog open={editing} onOpenChange={setEditing} task={task} />
    </li>
  );
}

/** A card-less list of rows; put it inside a Card. */
export function TaskList({ children }: { children: ReactNode }) {
  return <ul className="-mx-2 flex flex-col">{children}</ul>;
}
