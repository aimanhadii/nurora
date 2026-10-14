"use client";

import { AlarmClock, CalendarClock, Check } from "lucide-react";
import { completeTaskWithToast, snoozeTaskWithToast } from "@/lib/tasks/actions";
import { taskTimeLabel } from "@/lib/tasks/format";
import { countdown, nextUpTask } from "@/lib/tasks/stats";
import type { Task } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { AddTaskButton } from "@/components/tasks/TaskFormDialog";

/** The next timed task, a live countdown, and one-tap Done / Snooze. */
export function NextUpCard({ tasks, className }: { tasks: Task[]; className?: string }) {
  // Ticks every second for the countdown; only this card re-renders.
  const now = useNow(1000);
  if (!now) return null;
  const next = nextUpTask(tasks, now);
  const left = next ? countdown(next.dueAt!, now) : "";

  return (
    <Card interactive className={className}>
      <CardHeader>
        <CardTitle>
          <CalendarClock className="size-4" strokeWidth={1.5} />
          Next up
        </CardTitle>
      </CardHeader>

      {next ? (
        <>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 space-y-1">
              <p className="truncate text-xl font-semibold tracking-tight">{next.title}</p>
              {next.notes && (
                <p className="truncate text-meta text-muted-foreground">{next.notes}</p>
              )}
              <p className="font-mono text-sm tabular-nums text-muted-foreground">
                {taskTimeLabel(next, now)}
              </p>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className="text-xs font-medium text-muted-foreground">
                {left === "now" ? "Starting" : "Starts in"}
              </p>
              <p
                className="font-mono text-2xl font-medium tabular-nums tracking-tight text-brand"
                aria-live="off"
              >
                {left}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="h-11 md:h-9" onClick={() => completeTaskWithToast(next)}>
              <Check strokeWidth={1.5} />
              Mark done
            </Button>
            <Button
              variant="outline"
              className="h-11 md:h-9"
              onClick={() => snoozeTaskWithToast(next, 30)}
            >
              <AlarmClock strokeWidth={1.5} />
              Snooze 30 min
            </Button>
          </CardFooter>
        </>
      ) : (
        <EmptyState
          icon={CalendarClock}
          title="Nothing scheduled"
          description="Enjoy the free time, or plan something."
          action={<AddTaskButton size="sm" variant="outline" />}
          className="py-4"
        />
      )}
    </Card>
  );
}
