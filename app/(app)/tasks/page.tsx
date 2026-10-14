import type { Metadata } from "next";
import { TasksScreen } from "@/components/tasks/TasksScreen";

export const metadata: Metadata = { title: "Tasks · Teman" };

export default function TasksPage() {
  return <TasksScreen />;
}
