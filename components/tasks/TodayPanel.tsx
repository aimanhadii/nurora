"use client";

import { useLocalData } from "@/lib/local-store";
import { groupTasks, todayProgress } from "@/lib/tasks/group";
import type { Task } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProgressSummary } from "./ProgressSummary";
import { TaskItem } from "./TaskItem";
import { AddTaskButton } from "./TaskSheet";

/** Floating glass panel next to the chat on large screens. */
export function TodayPanel() {
  const data = useLocalData();
  const now = useNow();

  return (
    <GlassPanel
      as="aside"
      aria-label="Today's tasks"
      className="hidden w-80 shrink-0 flex-col overflow-y-auto rounded-panel xl:flex"
    >
      <div className="space-y-4 p-4">
        <h2 className="px-1 pt-1 text-base font-semibold">Today</h2>
        {data && now && <PanelContent tasks={data.tasks} now={now} />}
        <AddTaskButton variant="inline" />
      </div>
    </GlassPanel>
  );
}

function PanelContent({ tasks, now }: { tasks: Task[]; now: Date }) {
  const groups = groupTasks(tasks, now);
  const today = [...groups.overdue, ...groups.today];

  return (
    <>
      <ProgressSummary {...todayProgress(tasks, now)} flat />
      {today.length === 0 ? (
        <p className="px-1 py-2 text-sm text-fg-2">Nothing left for today ✨</p>
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
