"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import { addTask } from "@/lib/local-store";
import { dateKeyInDays } from "@/lib/time";
import { useNow } from "@/lib/use-now";

const fieldClass =
  "h-11 w-full min-w-0 rounded-xl border border-line bg-surface-2 px-3 text-base outline-none transition focus:border-line-strong focus:bg-surface";

function AddTaskForm({ onDone }: { onDone: () => void }) {
  const now = useNow();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const shortcuts = now
    ? [
        { label: "Today", value: dateKeyInDays(now, 0) },
        { label: "Tomorrow", value: dateKeyInDays(now, 1) },
      ]
    : [];

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    addTask({ title, date: date || undefined, time: date ? time : undefined });
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="task-title" className="sr-only">
          Task
        </label>
        <input
          id="task-title"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need to do?"
          autoComplete="off"
          className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-subtle focus-visible:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {shortcuts.map((s) => (
          <button
            key={s.label}
            type="button"
            aria-pressed={date === s.value}
            onClick={() => setDate(date === s.value ? "" : s.value)}
            className={`h-9 rounded-full border px-4 text-sm font-medium transition active:scale-95 ${
              date === s.value
                ? "border-fg bg-fg text-bg"
                : "border-line text-muted hover:text-fg"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1.5 text-xs font-medium text-muted">
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-muted">
          <span>Time</span>
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
        className="h-12 w-full rounded-2xl bg-accent font-semibold text-accent-fg transition active:scale-[0.98] disabled:bg-surface-2 disabled:text-subtle"
      >
        Add task
      </button>
    </form>
  );
}

/** Bottom sheet on phones, centred card on bigger screens. */
export function AddTaskSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  // <dialog> is opened/closed through DOM methods, so sync it with `open`.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // A click on the dialog element itself is a click on the backdrop.
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="add-task-heading"
      className="m-0 mt-auto w-full max-w-none rounded-t-[28px] border border-line bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:animate-sheet-up md:m-auto md:max-w-md md:rounded-[24px] md:open:animate-dialog-in"
    >
      <div className="px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] md:p-6">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line-strong md:hidden" />
        <div className="mb-4 flex items-center justify-between">
          <h2 id="add-task-heading" className="text-sm font-semibold text-muted">
            New task
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 flex size-11 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>
        {/* Only mounted while open, so the form starts empty every time. */}
        {open && <AddTaskForm onDone={onClose} />}
      </div>
    </dialog>
  );
}

const TRIGGER_STYLES = {
  // Floating button for phones, sits above the tab bar.
  fab: "flex fixed right-5 bottom-[calc(var(--nav-h)+1.25rem)] z-20 size-14 justify-center rounded-2xl bg-accent text-accent-fg shadow-lg shadow-black/10 active:scale-90 md:hidden",
  // Compact pill for headers on tablet/desktop.
  header:
    "hidden h-10 gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-accent-fg active:scale-95 md:flex",
  // Quiet full-width button for panels and empty states.
  inline:
    "flex h-11 w-full justify-center gap-1.5 rounded-xl border border-dashed border-line-strong text-sm font-medium text-muted hover:bg-surface-2 hover:text-fg active:scale-[0.98]",
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
        <Plus
          className={variant === "fab" ? "size-6" : "size-4"}
          strokeWidth={2}
        />
        {variant !== "fab" && "Add task"}
      </button>
      <AddTaskSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
