"use client";

import { CalendarRange, CircleCheckBig, Sun } from "lucide-react";
import { useLocalData } from "@/lib/local-store";
import { groupTasks, todayProgress } from "@/lib/tasks/group";
import { dateKey, formatDay } from "@/lib/time";
import type { Task } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Page, PageHeader } from "@/components/layout/Page";
import { ProgressCard } from "@/components/home/ProgressCard";
import { WeekCard } from "@/components/home/WeekCard";
import { lastSevenDays, streakDays } from "@/lib/tasks/stats";
import { EmptyState } from "@/components/shared/EmptyState";
import { AddTaskButton } from "./TaskFormDialog";
import { TaskList, TaskRow } from "./TaskRow";

type DayGroup = { key: string; label: string; tasks: Task[] };

/** Groups tasks by the local day of `pick(task)`, in the given order. */
function byDay(
  tasks: Task[],
  pick: (t: Task) => string | null,
  now: Date,
): DayGroup[] {
  const groups = new Map<string, DayGroup>();
  for (const task of tasks) {
    const iso = pick(task);
    const key = iso ? dateKey(new Date(iso)) : "someday";
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: iso ? formatDay(iso, now) : "No date",
        tasks: [],
      });
    }
    groups.get(key)!.tasks.push(task);
  }
  return [...groups.values()];
}

/** Day heading that sticks to the top while its tasks scroll past. */
function DaySection({
  group,
  now,
  timeOnly,
}: {
  group: DayGroup;
  now: Date;
  timeOnly: boolean;
}) {
  return (
    <section aria-labelledby={`day-${group.key}`}>
      <h2
        id={`day-${group.key}`}
        // Blur only, no tint: invisible over the page, readable over a card scrolling under it.
        className="sticky top-[env(safe-area-inset-top)] z-10 flex items-center gap-2 py-2 text-meta tracking-normal text-muted-foreground backdrop-blur-xl md:top-0"
      >
        {group.label}
        <span className="tabular-nums text-muted-foreground">
          {group.tasks.length}
        </span>
      </h2>
      <Card className="mt-2 p-2 xl:p-3">
        <TaskList>
          {group.tasks.map((t) => (
            <TaskRow key={t.id} task={t} now={now} timeOnly={timeOnly} />
          ))}
        </TaskList>
      </Card>
    </section>
  );
}

function TabCount({ count }: { count: number }) {
  return (
    <Badge
      variant="secondary"
      className="h-5 bg-transparent px-1 tabular-nums"
    >
      {count}
    </Badge>
  );
}

export function TasksScreen() {
  const data = useLocalData();
  const now = useNow();

  if (!data || !now) return <TasksSkeleton />;

  const groups = groupTasks(data.tasks, now);
  const todayOpen = [...groups.overdue, ...groups.today];
  const progress = todayProgress(data.tasks, now);
  const week = lastSevenDays(data.tasks, now);
  const upcoming = byDay(
    [...groups.upcoming, ...groups.someday],
    (t) => t.dueAt,
    now,
  );
  const done = byDay(groups.done, (t) => t.completedAt, now);

  const overdueNote = groups.overdue.length
    ? ` · ${groups.overdue.length} overdue`
    : "";

  return (
    <Page>
      <PageHeader
        title="Tasks"
        description={`${todayOpen.length} to do today${overdueNote}`}
        actions={<AddTaskButton className="h-11 md:h-9" />}
      />

      {/* Desktop: list + a side column of insights, so the page has no dead areas. */}
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Tabs defaultValue="today" className="min-w-0 gap-6">
          <TabsList className="w-full md:w-fit">
            <TabsTrigger value="today" className="md:px-4">
              Today <TabCount count={todayOpen.length} />
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="md:px-4">
              Upcoming{" "}
              <TabCount
                count={groups.upcoming.length + groups.someday.length}
              />
            </TabsTrigger>
            <TabsTrigger value="done" className="md:px-4">
              Done <TabCount count={groups.done.length} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {progress.total > 0 && (
              <div className="space-y-2 xl:hidden">
                <div className="flex items-center justify-between text-meta">
                  <span>
                    {progress.done} of {progress.total} done today
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {Math.round((progress.done / progress.total) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(progress.done / progress.total) * 100}
                  aria-label="Today's progress"
                />
              </div>
            )}
            <Card className="p-2 xl:p-3">
              {todayOpen.length === 0 ? (
                <EmptyState
                  icon={Sun}
                  title="All clear for today"
                  description="Nothing left to do. Enjoy it, or plan ahead."
                  action={<AddTaskButton size="sm" variant="outline" />}
                />
              ) : (
                <TaskList>
                  {todayOpen.map((t) => (
                    <TaskRow key={t.id} task={t} now={now} timeOnly />
                  ))}
                </TaskList>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcoming.length === 0 ? (
              <Card>
                <EmptyState
                  icon={CalendarRange}
                  title="Nothing coming up"
                  description="Future tasks will show here, grouped by day."
                  action={<AddTaskButton size="sm" variant="outline" />}
                />
              </Card>
            ) : (
              upcoming.map((g) => (
                <DaySection key={g.key} group={g} now={now} timeOnly />
              ))
            )}
          </TabsContent>

          <TabsContent value="done" className="space-y-4">
            {done.length === 0 ? (
              <Card>
                <EmptyState
                  icon={CircleCheckBig}
                  title="Nothing done yet"
                  description="Ticked-off tasks land here."
                />
              </Card>
            ) : (
              done.map((g) => (
                <DaySection key={g.key} group={g} now={now} timeOnly={false} />
              ))
            )}
          </TabsContent>
        </Tabs>

        <aside
          aria-label="Insights"
          className="hidden space-y-5 self-start xl:sticky xl:top-0 xl:block"
        >
          <ProgressCard
            {...progress}
            streak={streakDays(data.tasks, now)}
            week={week}
          />
          <WeekCard days={week} />
        </aside>
      </div>
    </Page>
  );
}

function TasksSkeleton() {
  return (
    <Page>
      <div className="mb-6 space-y-2 md:mb-8">
        <Skeleton className="h-8 w-32 md:h-10" />
        <Skeleton className="h-5 w-40" />
      </div>
      <Skeleton className="mb-6 h-10 w-full rounded-lg md:w-80" />
      <div
        className="space-y-2 rounded-xl border bg-card p-3"
        aria-busy="true"
        aria-label="Loading"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </Page>
  );
}
