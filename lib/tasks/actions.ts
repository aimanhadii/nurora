import { toast } from "sonner";
import {
  addTask,
  deleteTask,
  moveTaskToTomorrow,
  replaceTask,
  restoreTask,
  setTaskDone,
  snoozeTask,
} from "@/lib/local-store";
import type { NewTaskInput, Task } from "@/lib/types";

// Every user action on a task goes through here, so each one gets the
// same confirmation toast (with Undo where it makes sense) on every screen.

export function addTaskWithToast(input: NewTaskInput) {
  const task = addTask(input);
  if (!task) return;
  toast.success("Task added", {
    action: { label: "Undo", onClick: () => deleteTask(task.id) },
  });
}

export function completeTaskWithToast(task: Task) {
  setTaskDone(task.id, true);
  toast.success("Task completed", {
    action: { label: "Undo", onClick: () => setTaskDone(task.id, false) },
  });
}

export function snoozeTaskWithToast(task: Task, minutes = 30) {
  snoozeTask(task.id, minutes);
  toast(`Snoozed for ${minutes} min`, {
    action: { label: "Undo", onClick: () => replaceTask(task) },
  });
}

export function moveToTomorrowWithToast(task: Task) {
  moveTaskToTomorrow(task.id);
  toast("Moved to tomorrow", {
    action: { label: "Undo", onClick: () => replaceTask(task) },
  });
}

export function deleteTaskWithToast(task: Task) {
  deleteTask(task.id);
  toast("Task deleted", {
    action: { label: "Undo", onClick: () => restoreTask(task) },
  });
}
