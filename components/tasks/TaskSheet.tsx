"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Plus, Sun, Sunrise, X } from "lucide-react";
import { addTask, updateTask } from "@/lib/local-store";
import { dateKey, dateKeyInDays, timeKey } from "@/lib/time";
import type { Task } from "@/lib/types";
import { useNow } from "@/lib/use-now";

const fieldClass =
  "glass-flat h-12 w-full min-w-0 rounded-item px-4 text-base outline-none transition focus:border-white/30";

// Drag the handle down this far to dismiss the sheet.
const DISMISS_DRAG_PX = 110;

function TaskForm({ task, onDone }: { task?: Task; onDone: () => void }) {
  const now = useNow();
  const dateId = useId();
  const [title, setTitle] = useState(task?.title ?? "");
  const [date, setDate] = useState(
    task?.dueAt ? dateKey(new Date(task.dueAt)) : "",
  );
  const [time, setTime] = useState(
    task?.dueAt && !task.allDay ? timeKey(task.dueAt) : "",
  );

  const today = now ? dateKeyInDays(now, 0) : "";
  const tomorrow = now ? dateKeyInDays(now, 1) : "";
  const picked = date !== "" && date !== today && date !== tomorrow;

  const tiles = [
    { label: "Today", Icon: Sun, active: date === today, onClick: () => setDate(date === today ? "" : today) },
    { label: "Tomorrow", Icon: Sunrise, active: date === tomorrow, onClick: () => setDate(date === tomorrow ? "" : tomorrow) },
    { label: "Pick date", Icon: CalendarDays, active: picked, onClick: openDatePicker },
  ];

  function openDatePicker() {
    const input = document.getElementById(dateId) as HTMLInputElement | null;
    if (!input) return;
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const input = { title, date: date || undefined, time: date ? time : undefined };
    if (!title.trim()) return;
    if (task) updateTask(task.id, input);
    else addTask(input);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-2.5">
        {tiles.map(({ label, Icon, active, onClick }) => (
          <button
            key={label}
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={`flex h-20 flex-col items-center justify-center gap-1.5 rounded-item border text-sm font-medium transition active:scale-95 ${
              active
                ? "border-accent/60 bg-accent/15 text-fg"
                : "glass-flat text-fg-2 hover:text-fg"
            }`}
          >
            <Icon
              className={`size-5 ${active ? "text-accent" : ""}`}
              strokeWidth={1.75}
            />
            {label}
          </button>
        ))}
      </div>

      <label className="block space-y-1.5">
        <span className="px-1 text-xs font-medium text-fg-2">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need to do?"
          autoComplete="off"
          required
          className={`${fieldClass} placeholder:text-fg-3`}
        />
      </label>

      <div className="grid grid-cols-2 gap-2.5">
        <label className="block min-w-0 space-y-1.5">
          <span className="px-1 text-xs font-medium text-fg-2">Date</span>
          <input
            id={dateId}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block min-w-0 space-y-1.5">
          <span className="px-1 text-xs font-medium text-fg-2">Time</span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={!date}
            className={`${fieldClass} disabled:opacity-40`}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={!title.trim()}
        className="accent-fill mt-2 h-12 w-full rounded-full font-semibold transition active:scale-[0.98] disabled:opacity-40"
      >
        {task ? "Save changes" : "Add task"}
      </button>
    </form>
  );
}

/**
 * Glass bottom sheet on phones (drag the handle down to close), centred
 * modal on bigger screens. Mount it to open it; it calls onClose when done.
 */
export function TaskSheet({ task, onClose }: { task?: Task; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const dragStart = useRef<number | null>(null);

  // <dialog> is opened through a DOM method; showModal() traps focus and
  // makes Escape close it.
  useEffect(() => {
    ref.current?.showModal();
  }, []);

  function onDragStart(e: PointerEvent<HTMLDivElement>) {
    dragStart.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (ref.current) ref.current.style.transition = "none";
  }
  function onDragMove(e: PointerEvent<HTMLDivElement>) {
    if (dragStart.current === null || !ref.current) return;
    const dy = Math.max(0, e.clientY - dragStart.current);
    ref.current.style.transform = `translateY(${dy}px)`;
  }
  function onDragEnd(e: PointerEvent<HTMLDivElement>) {
    if (dragStart.current === null || !ref.current) return;
    const dy = e.clientY - dragStart.current;
    dragStart.current = null;
    ref.current.style.transition = "transform 250ms ease-out";
    ref.current.style.transform = "";
    if (dy > DISMISS_DRAG_PX) onClose();
  }

  return createPortal(
    <dialog
      ref={ref}
      onClose={onClose}
      // A click on the dialog element itself is a click on the backdrop.
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="task-sheet-heading"
      className="glass-strong m-0 mt-auto mb-[var(--kb)] max-h-[calc(var(--app-h)-1rem)] w-full max-w-none overflow-y-auto rounded-t-sheet p-0 text-fg backdrop:bg-black/55 open:animate-sheet-up md:m-auto md:max-w-md md:rounded-sheet md:open:animate-dialog-in"
    >
      {/* Drag handle area (phones). */}
      <div
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
        className="flex touch-none justify-center pt-3 pb-1 md:hidden"
      >
        <span className="h-1.5 w-11 rounded-full bg-white/25" />
      </div>

      <div className="px-5 pt-2 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="task-sheet-heading" className="text-lg font-semibold tracking-tight">
            {task ? "Edit task" : "New task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 flex size-11 items-center justify-center rounded-full text-fg-2 transition hover:bg-glass-hover hover:text-fg"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>
        <TaskForm task={task} onDone={onClose} />
      </div>
    </dialog>,
    document.body,
  );
}

const TRIGGER_STYLES = {
  // Floating crimson button for phones, above the tab bar.
  fab: "accent-fill flex fixed right-5 bottom-[calc(var(--nav-h)+1rem)] z-20 size-14 justify-center rounded-full shadow-[0_8px_32px_-8px_var(--accent)] active:scale-90 md:hidden",
  // Pill for headers on tablet/desktop.
  header:
    "accent-fill hidden h-11 gap-1.5 rounded-full px-5 text-sm font-semibold active:scale-95 md:flex",
  // Quiet dashed button for panels and empty states.
  inline:
    "flex h-11 w-full justify-center gap-1.5 rounded-full border border-dashed border-white/20 text-sm font-medium text-fg-2 hover:bg-glass-hover hover:text-fg active:scale-[0.98]",
};

export function AddTaskButton({
  variant,
}: {
  variant: keyof typeof TRIGGER_STYLES;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={variant === "fab" ? "Add task" : undefined}
        className={`items-center transition ${TRIGGER_STYLES[variant]}`}
      >
        <Plus className={variant === "fab" ? "size-6" : "size-4"} strokeWidth={2} />
        {variant !== "fab" && "Add task"}
      </button>
      {open && <TaskSheet onClose={() => setOpen(false)} />}
    </>
  );
}
