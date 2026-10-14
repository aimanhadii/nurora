import type { Metadata } from "next";
import { ViewTransition } from "react";
import { TasksScreen } from "@/components/tasks/TasksScreen";

export const metadata: Metadata = { title: "Tasks · Teman" };

export default function TasksPage() {
  return (
    // Crossfades when switching tabs.
    <ViewTransition enter="auto" exit="auto" default="none">
      <TasksScreen />
    </ViewTransition>
  );
}
