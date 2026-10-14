"use client";

import { useLocalData } from "@/lib/local-store";
import { groupTasks, todayProgress } from "@/lib/tasks/group";
import type { Task } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { Surface } from "@/components/ui/Surface";
import { ProgressSummary } from "./ProgressSummary";
import { TaskItem } from "./TaskItem";
import { AddTaskButton } from "./TaskSheet";

/** Right-hand column of the desktop grid, next to the chat. */
export function TodayPanel() {
  const data = useLocalData();
  const now = useNow();

  return (
    <Surface
      as="aside"
      variant="glass"
      aria-label="Today's tasks"
      className="hidden h-full min-h-0 flex-col overflow-y-auto rounded-card xl:flex"
    >
      <div className="space-y-4 p-4">
        <h2 className="px-1 pt-1 text-lg font-bold tracking-tight">Today</h2>
        {data && now && <PanelContent tasks={data.tasks} now={now} />}
        <AddTaskButton variant="inline" />
      </div>
    </Surface>
  );
}

function PanelContent({ tasks, now }: { tasks: Task[]; now: Date }) {
  const groups = groupTasks(tasks, now);
  const today = [...groups.overdue, ...groups.today];

  return (
    <>
      <ProgressSummary {...todayProgress(tasks, now)} />
      {today.length === 0 ? (
        <p className="px-1 py-2 text-sm text-text-2">Nothing left for today ✨</p>
      ) : (
        <ul className="space-y-2">
          {today.map((t) => (
            <TaskItem key={t.id} task={t} now={now} />
          ))}
        </ul>
      )}
    </>
  );
}
