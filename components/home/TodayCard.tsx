import Link from "next/link";
import { ArrowRight, ListChecks } from "lucide-react";
import type { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { AddTaskButton } from "@/components/tasks/TaskFormDialog";
import { TaskList, TaskRow } from "@/components/tasks/TaskRow";

const MAX_ROWS = 6;

/** Overdue + today's open tasks, then what's already done today. */
export function TodayCard({
  open,
  doneToday,
  now,
  className,
}: {
  open: Task[];
  doneToday: Task[];
  now: Date;
  className?: string;
}) {
  const rows = [...open, ...doneToday].slice(0, MAX_ROWS);
  const hidden = open.length + doneToday.length - rows.length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <ListChecks className="size-4" strokeWidth={1.5} />
          Today
          <Badge variant="secondary" className="tabular-nums">
            {open.length}
          </Badge>
        </CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tasks">
              See all
              <ArrowRight strokeWidth={1.5} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {rows.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Nothing on today"
            description="A clear day. Add something if you like."
            action={<AddTaskButton size="sm" variant="outline" />}
          />
        ) : (
          <>
            <TaskList>
              {rows.map((t) => (
                <TaskRow key={t.id} task={t} now={now} compact />
              ))}
            </TaskList>
            {hidden > 0 && (
              <p className="mt-2 px-1 text-meta text-muted-foreground">+{hidden} more in Tasks</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
