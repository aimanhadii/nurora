"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

/** A titled list that folds open and shut with a smooth height animation. */
export function TaskSection({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <section>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(!open)}
        className="flex h-11 w-full items-center gap-1.5 rounded-lg text-left text-sm font-semibold"
      >
        <ChevronRight
          className={`size-4 text-muted transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          strokeWidth={2}
        />
        {title}
        <span className="font-normal text-muted tabular-nums">{count}</span>
      </button>

      {/* Animating grid rows 0fr → 1fr is a CSS trick for "height: auto". */}
      <div
        id={contentId}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-1 pb-2">{children}</div>
        </div>
      </div>
    </section>
  );
}
