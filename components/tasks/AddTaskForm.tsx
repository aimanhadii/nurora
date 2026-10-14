"use client";

import { useState, type FormEvent } from "react";
import { addTask } from "@/lib/local-store";
import { PlusIcon } from "@/components/ui/icons";

const fieldClass =
  "rounded-xl bg-rose-50 px-3 py-2 text-base text-stone-800 outline-none focus:ring-2 focus:ring-rose-200";

export function AddTaskForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function reset() {
    setTitle("");
    setDate("");
    setTime("");
    setOpen(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    addTask({ title, date: date || undefined, time: date ? time : undefined });
    reset();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-rose-200 py-3 font-medium text-rose-400 transition active:scale-[0.98]"
      >
        <PlusIcon className="size-5" />
        Add task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl bg-white p-4 shadow-sm"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you need to do?"
        className={`${fieldClass} w-full`}
      />
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 text-xs text-stone-500">
          Date (optional)
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-stone-500">
          Time (optional)
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={!date}
            className={`${fieldClass} disabled:opacity-40`}
          />
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-full px-4 py-2 text-stone-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-full bg-rose-400 px-5 py-2 font-medium text-white transition active:scale-95 disabled:bg-rose-200"
        >
          Add
        </button>
      </div>
    </form>
  );
}
