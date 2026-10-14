"use client";

import { useLocalData } from "@/lib/local-store";
import { groupTasks, todayProgress } from "@/lib/tasks/group";
import type { Task } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { AddTaskButton } from "./AddTaskSheet";
import { ProgressSummary } from "./ProgressSummary";
import { TaskItem } from "./TaskItem";

/** Right-hand panel next to the chat on large screens. */
export function TodayPanel() {
  const data = useLocalData();
  const now = useNow();

  return (
    <aside
      aria-label="Today's tasks"
      className="hidden w-80 shrink-0 flex-col overflow-y-auto border-l border-line bg-bg xl:flex"
    >
      <div className="space-y-4 px-5 py-6">
        <h2 className="text-sm font-semibold">Today</h2>
        {data && now && <PanelContent tasks={data.tasks} now={now} />}
        <AddTaskButton variant="inline" />
      </div>
    </aside>
  );
}

function PanelContent({
  tasks,
  now,
}: {
  tasks: Task[];
  now: Date;
}) {
  const groups = groupTasks(tasks, now);
  const today = [...groups.overdue, ...groups.today];

  return (
    <>
      <ProgressSummary {...todayProgress(tasks, now)} />
      {today.length === 0 ? (
        <p className="py-2 text-sm text-muted">Nothing left for today ✨</p>
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
