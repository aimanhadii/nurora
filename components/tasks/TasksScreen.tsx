"use client";

import { CircleCheckBig } from "lucide-react";
import { useLocalData } from "@/lib/local-store";
import { groupTasks, todayProgress } from "@/lib/tasks/group";
import { formatLongDate } from "@/lib/time";
import type { Task } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { PageHeader } from "@/components/layout/PageHeader";
import { AddTaskButton } from "./AddTaskSheet";
import { ProgressSummary } from "./ProgressSummary";
import { TaskItem } from "./TaskItem";
import { TaskSection } from "./TaskSection";

function EmptyState() {
  return (
    <div className="flex animate-fade-in flex-col items-center px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-2 text-muted">
        <CircleCheckBig className="size-7" strokeWidth={1.5} />
      </div>
      <h2 className="mt-5 text-lg font-semibold tracking-tight">
        Your list is clear
      </h2>
      <p className="mt-1.5 max-w-xs text-[15px] text-muted">
        Add something you want to get done, or just tell Teman in chat.
      </p>
      <div className="mt-6 w-48">
        <AddTaskButton variant="inline" />
      </div>
    </div>
  );
}

function TaskList({ tasks, now }: { tasks: Task[]; now: Date }) {
  return (
    <ul className="space-y-2">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} now={now} />
      ))}
    </ul>
  );
}

function TaskSections({ tasks, now }: { tasks: Task[]; now: Date }) {
  if (tasks.length === 0) return <EmptyState />;

  const groups = groupTasks(tasks, now);
  const today = [...groups.overdue, ...groups.today];

  return (
    <>
      <ProgressSummary {...todayProgress(tasks, now)} />

      <TaskSection title="Today" count={today.length}>
        {today.length === 0 ? (
          <p className="px-1 py-3 text-sm text-muted">
            Nothing left for today. Enjoy it ✨
          </p>
        ) : (
          <TaskList tasks={today} now={now} />
        )}
      </TaskSection>

      {groups.upcoming.length > 0 && (
        <TaskSection title="Upcoming" count={groups.upcoming.length}>
          <TaskList tasks={groups.upcoming} now={now} />
        </TaskSection>
      )}

      {groups.someday.length > 0 && (
        <TaskSection title="Someday" count={groups.someday.length}>
          <TaskList tasks={groups.someday} now={now} />
        </TaskSection>
      )}

      {groups.done.length > 0 && (
        <TaskSection title="Done" count={groups.done.length} defaultOpen={false}>
          <TaskList tasks={groups.done.slice(0, 20)} now={now} />
        </TaskSection>
      )}
    </>
  );
}

export function TasksScreen() {
  const data = useLocalData();
  const now = useNow();

  return (
    <div className="h-full overflow-y-auto overscroll-contain">
      <PageHeader
        title="Tasks"
        subtitle={
          <span className={now ? "" : "invisible"}>
            {now ? formatLongDate(now) : "Today"}
          </span>
        }
        actions={<AddTaskButton variant="header" />}
      />

      <div className="mx-auto max-w-2xl space-y-4 px-4 pt-5 pb-[calc(var(--nav-h)+6rem)] md:px-8 md:pb-10">
        {data && now && <TaskSections tasks={data.tasks} now={now} />}
      </div>

      <AddTaskButton variant="fab" />
    </div>
  );
}
