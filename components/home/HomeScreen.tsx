"use client";

import { useLocalData } from "@/lib/local-store";
import { PLACEHOLDER_PROFILE } from "@/lib/profile";
import { groupTasks, todayProgress } from "@/lib/tasks/group";
import { lastSevenDays, nextUpTask, streakDays } from "@/lib/tasks/stats";
import { dateKey, formatLongDate, formatTime, greeting } from "@/lib/time";
import type { Task } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { Skeleton } from "@/components/ui/skeleton";
import { Page, PageHeader } from "@/components/layout/Page";
import { AffirmationCard } from "./AffirmationCard";
import { AskNuroraCard } from "./AskNuroraCard";
import { NextUpCard } from "./NextUpCard";
import { ProgressCard } from "./ProgressCard";
import { TodayCard } from "./TodayCard";
import { WeekCard } from "./WeekCard";

// Bento placement (docs/design.md §6). DOM order = phone priority order.
const GRID = "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5";
const SPAN = {
  nextUp: "md:col-span-2",
  progress: "",
  affirmation: "",
  today: "md:col-span-2 xl:row-span-2",
  ask: "md:col-span-2 xl:order-last xl:col-span-3",
  week: "md:col-span-2 xl:col-span-1",
};

function summary(open: Task[], next: Task | null, now: Date): string {
  const count = `${open.length} ${open.length === 1 ? "task" : "tasks"} today`;
  if (!next) return count;
  const sameDay = dateKey(new Date(next.dueAt!)) === dateKey(now);
  return `${count} · next at ${formatTime(next.dueAt!)}${sameDay ? "" : " tomorrow"}`;
}

export function HomeScreen() {
  const data = useLocalData();
  const now = useNow();

  if (!data || !now) return <HomeSkeleton />;

  const groups = groupTasks(data.tasks, now);
  const open = [...groups.overdue, ...groups.today];
  const todayKey = dateKey(now);
  const doneToday = data.tasks.filter(
    (t) => t.status === "done" && t.dueAt && dateKey(new Date(t.dueAt)) === todayKey,
  );
  const next = nextUpTask(data.tasks, now);
  const progress = todayProgress(data.tasks, now);
  const week = lastSevenDays(data.tasks, now);

  return (
    <Page>
      <PageHeader
        title={`${greeting(now)}, ${PLACEHOLDER_PROFILE.name}`}
        description={
          // Phones: date and summary on their own lines; wider: one line.
          <>
            <span className="block md:inline">{formatLongDate(now)}</span>
            <span className="mx-2 hidden text-subtle-foreground md:inline" aria-hidden="true">
              ·
            </span>
            <span className="block md:inline">{summary(open, next, now)}</span>
          </>
        }
      />
      <div className={GRID}>
        <NextUpCard tasks={data.tasks} className={SPAN.nextUp} />
        <ProgressCard
          {...progress}
          streak={streakDays(data.tasks, now)}
          week={week}
          className={SPAN.progress}
        />
        <AffirmationCard todayKey={todayKey} saved={data.savedAffirmations} className={SPAN.affirmation} />
        <TodayCard open={open} doneToday={doneToday} now={now} className={SPAN.today} />
        <AskNuroraCard className={SPAN.ask} />
        <WeekCard days={week} className={SPAN.week} />
      </div>
    </Page>
  );
}

/** Same grid and card shapes as the real page, so nothing jumps on load. */
function HomeSkeleton() {
  const card = "rounded-xl border bg-card p-5 xl:p-6";
  return (
    <Page>
      <div className="mb-6 space-y-2 md:mb-8">
        <Skeleton className="h-8 w-72 max-w-full md:h-10" />
        <Skeleton className="h-5 w-56 max-w-full" />
      </div>
      <div className={GRID} aria-busy="true" aria-label="Loading">
        {[
          [SPAN.nextUp, "h-48"],
          [SPAN.progress, "h-48"],
          [SPAN.affirmation, "h-48"],
          [SPAN.today, "h-96"],
          [SPAN.ask, "h-36"],
          [SPAN.week, "h-48"],
        ].map(([span, height], i) => (
          <div key={i} className={`${card} ${span} ${height} space-y-4`}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </Page>
  );
}
