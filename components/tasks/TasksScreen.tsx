"use client";

import { useLocalData } from "@/lib/local-store";
import { groupTasks } from "@/lib/tasks/group";
import type { Task } from "@/lib/types";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { AddTaskForm } from "./AddTaskForm";
import { TaskItem } from "./TaskItem";

function Section({
  title,
  tasks,
  now,
  overdue,
}: {
  title: string;
  tasks: Task[];
  now: Date;
  overdue?: boolean;
}) {
  if (tasks.length === 0) return null;
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-sm font-semibold text-stone-500">
        {title} <span className="text-rose-300">· {tasks.length}</span>
      </h2>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <TaskItem key={t.id} task={t} now={now} overdue={overdue} />
        ))}
      </ul>
    </section>
  );
}

export function TasksScreen() {
  const data = useLocalData();

  if (!data) {
    return (
      <div className="flex h-full flex-col">
        <ScreenHeader title="Tasks" />
      </div>
    );
  }

  const now = new Date();
  const groups = groupTasks(data.tasks, now);
  const left = groups.overdue.length + groups.today.length;

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="Tasks"
        subtitle={
          left === 0
            ? "All clear for today ✨"
            : `${left} thing${left === 1 ? "" : "s"} left today`
        }
      />

      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <AddTaskForm />
        <Section title="Overdue" tasks={groups.overdue} now={now} overdue />
        <Section title="Today" tasks={groups.today} now={now} />
        <Section title="Upcoming" tasks={groups.upcoming} now={now} />
        <Section title="Someday" tasks={groups.someday} now={now} />
        <Section title="Done" tasks={groups.done.slice(0, 10)} now={now} />
      </div>
    </div>
  );
}
