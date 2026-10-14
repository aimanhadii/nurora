"use client";

import { useId, useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { CalendarDays, Plus, Sun, Sunrise } from "lucide-react";
import { useIsDesktop } from "@/hooks/use-media-query";
import { updateTask } from "@/lib/local-store";
import { addTaskWithToast } from "@/lib/tasks/actions";
import { dateKey, dateKeyInDays, timeKey } from "@/lib/time";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function TaskForm({ task, onDone }: { task?: Task; onDone: () => void }) {
  const id = useId();
  const [title, setTitle] = useState(task?.title ?? "");
  const [date, setDate] = useState(task?.dueAt ? dateKey(new Date(task.dueAt)) : "");
  const [time, setTime] = useState(task?.dueAt && !task.allDay ? timeKey(task.dueAt) : "");
  const [notes, setNotes] = useState(task?.notes ?? "");

  // Computed on render inside a client-only dialog, so "now" is the browser's.
  const today = dateKeyInDays(new Date(), 0);
  const tomorrow = dateKeyInDays(new Date(), 1);
  const picked = date !== "" && date !== today && date !== tomorrow;

  function openDatePicker() {
    const input = document.getElementById(`${id}-date`) as HTMLInputElement | null;
    if (!input) return;
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  }

  const quick = [
    { label: "Today", Icon: Sun, active: date === today, onClick: () => setDate(date === today ? "" : today) },
    { label: "Tomorrow", Icon: Sunrise, active: date === tomorrow, onClick: () => setDate(date === tomorrow ? "" : tomorrow) },
    { label: "Pick date", Icon: CalendarDays, active: picked, onClick: openDatePicker },
  ];

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // Opened from inside other forms (e.g. chat); React bubbles events
    // through portals, so don't let this submit reach them.
    event.stopPropagation();
    if (!title.trim()) return;
    const input = { title, date: date || undefined, time: date ? time : undefined, notes };
    if (task) {
      updateTask(task.id, input);
      toast.success("Task updated");
    } else {
      addTaskWithToast(input);
    }
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Title" htmlFor={`${id}-title`}>
        <Input
          id={`${id}-title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need to do?"
          autoComplete="off"
          autoFocus
          required
        />
      </Field>

      <div className="space-y-2">
        <p className="text-sm font-medium" id={`${id}-when`}>
          When
        </p>
        <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby={`${id}-when`}>
          {quick.map(({ label, Icon, active, onClick }) => (
            <Button
              key={label}
              type="button"
              variant="outline"
              aria-pressed={active}
              onClick={onClick}
              className={cn(
                "h-11 md:h-10",
                active && "border-brand bg-brand-soft text-brand hover:bg-brand-soft hover:text-brand",
              )}
            >
              <Icon strokeWidth={1.5} />
              {label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            id={`${id}-date`}
            type="date"
            aria-label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="time"
            aria-label="Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={!date}
          />
        </div>
      </div>

      <Field label="Notes" htmlFor={`${id}-notes`}>
        <Textarea
          id={`${id}-notes`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add details (optional)"
          rows={2}
        />
      </Field>

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" className="h-11 md:h-9" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" className="h-11 md:h-9" disabled={!title.trim()}>
          {task ? "Save changes" : "Add task"}
        </Button>
      </div>
    </form>
  );
}

/** Add/edit form: a centred Dialog on tablet+, a bottom Sheet on phones. */
export function TaskFormDialog({
  open,
  onOpenChange,
  task,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}) {
  const isDesktop = useIsDesktop();
  const title = task ? "Edit task" : "New task";
  const description = task ? "Update the details below." : "Add it now, sort it out later.";
  const close = () => onOpenChange(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <TaskForm task={task} onDone={close} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        // Sits on top of the iOS keyboard (see ViewportSync).
        style={{ bottom: "var(--kb)" }}
        className="max-h-[calc(var(--app-h)-env(safe-area-inset-top))] overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+20px)]"
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="px-5">
          <TaskForm task={task} onDone={close} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function AddTaskButton({
  iconOnly = false,
  className,
  ...buttonProps
}: { iconOnly?: boolean } & Omit<ComponentProps<typeof Button>, "onClick" | "children">) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        aria-label={iconOnly ? "Add task" : undefined}
        className={className}
        {...buttonProps}
        onClick={() => setOpen(true)}
      >
        <Plus strokeWidth={1.5} />
        {!iconOnly && "Add task"}
      </Button>
      <TaskFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
