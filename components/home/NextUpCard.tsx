"use client";

import { AlarmClock, CalendarClock, Check } from "lucide-react";
import {
  completeTaskWithToast,
  snoozeTaskWithToast,
} from "@/lib/tasks/actions";
import { taskTimeLabel } from "@/lib/tasks/format";
import { nextUpTask } from "@/lib/tasks/stats";
import type { Task } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Countdown } from "@/components/shared/Countdown";
import { EmptyState } from "@/components/shared/EmptyState";
import { AddTaskButton } from "@/components/tasks/TaskFormDialog";

/** The next timed task, a live countdown, and one-tap Done / Snooze. */
export function NextUpCard({
  tasks,
  className,
}: {
  tasks: Task[];
  className?: string;
}) {
  // Minute-level countdown, refreshed every 15s; only this card re-renders.
  const now = useNow(15_000);
  if (!now) return null;
  const next = nextUpTask(tasks, now);

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
          <CardContent className="min-w-0 space-y-3">
            <div className="space-y-1">
              <p className="truncate font-display text-xl">{next.title}</p>
              {next.notes && (
                <p className="truncate text-meta text-muted-foreground">
                  {next.notes}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="brand" className="font-mono tabular-nums">
                {taskTimeLabel(next, now)}
              </Badge>
              <Countdown dueAt={next.dueAt!} now={now} />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="h-11 md:h-9"
              onClick={() => completeTaskWithToast(next)}
            >
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
