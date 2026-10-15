"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Orb } from "@/components/ui/Orb";

const USER_TEXT = "esok pukul 3 meeting, malam nak gym";
const TASKS = [
  { title: "Meeting", when: "Tomorrow · 3:00 pm" },
  { title: "Gym", when: "Tomorrow · 8:30 pm" },
];

// typing → thinking → reply → (hold, fade) → again
type Phase = "idle" | "typing" | "thinking" | "reply" | "fading";
const TYPE_MS = 45;

/**
 * Looping example conversation, styled like the real chat. With reduced
 * motion it simply shows the finished conversation.
 */
export function DemoChat({ className }: { className?: string }) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const next: Record<Phase, [number, () => void]> = {
      idle: [700, () => setPhase("typing")],
      typing: [
        TYPE_MS,
        () => (typed < USER_TEXT.length ? setTyped(typed + 1) : setPhase("thinking")),
      ],
      thinking: [1100, () => setPhase("reply")],
      reply: [4200, () => setPhase("fading")],
      fading: [
        450,
        () => {
          setTyped(0);
          setPhase("idle");
        },
      ],
    };
    const [delay, run] = next[phase];
    const timer = setTimeout(run, phase === "typing" && typed === USER_TEXT.length ? 500 : delay);
    return () => clearTimeout(timer);
  }, [phase, typed, reducedMotion]);

  const view: Phase = reducedMotion ? "reply" : phase;
  const text = reducedMotion ? USER_TEXT : USER_TEXT.slice(0, typed);
  const showUser = view !== "idle";
  const showReply = view === "reply" || view === "fading";

  return (
    <figure className={cn("rounded-xl border bg-card/70 p-4 shadow-sm", className)}>
      <figcaption className="sr-only">
        Example: you type “{USER_TEXT}”, and Nurora adds a meeting tomorrow at 3:00 pm and the gym
        tomorrow at 8:30 pm.
      </figcaption>
      <div
        aria-hidden="true"
        className={cn(
          "flex h-64 flex-col justify-end gap-4 transition-opacity duration-400",
          view === "fading" && "opacity-0",
        )}
      >
        {showUser && (
          <div className="max-w-4/5 self-end rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">
            {text}
            {view === "typing" && <span className="ml-px inline-block w-px animate-pulse">|</span>}
          </div>
        )}

        {view === "thinking" && (
          <div className="flex animate-message-in items-center gap-3">
            <Orb size={28} thinking />
            <span className="text-meta text-muted-foreground">Thinking…</span>
          </div>
        )}

        {showReply && (
          <div className="flex animate-message-in gap-3">
            <Orb size={28} className="mt-1" />
            <div className="min-w-0 flex-1 space-y-2">
              <p className="w-fit rounded-xl border bg-card px-4 py-2 text-sm shadow-sm">
                Got it. Both are on your list for tomorrow:
              </p>
              {TASKS.map((task, i) => (
                <div
                  key={task.title}
                  className="flex animate-message-in items-center gap-3 rounded-lg border bg-card px-3 py-2"
                  style={{ animationDelay: `${150 + i * 150}ms` }}
                >
                  <span className="size-4 shrink-0 rounded-full border-[1.5px] border-foreground/25" />
                  <span className="min-w-0 flex-1 truncate text-sm">{task.title}</span>
                  <Badge variant="brand" className="font-mono tabular-nums">
                    {task.when}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </figure>
  );
}
