export type TaskStatus = "pending" | "done";

export type Task = {
  id: string;
  title: string;
  /** UTC ISO string, or null for "someday" tasks with no date. */
  dueAt: string | null;
  /** True when the task has a date but no specific time. */
  allDay: boolean;
  status: TaskStatus;
  completedAt: string | null;
  createdAt: string;
};

export type MessageRole = "user" | "assistant";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type NewTaskInput = {
  title: string;
  /** "YYYY-MM-DD" in the user's timezone. */
  date?: string;
  /** "HH:mm" in the user's timezone. */
  time?: string;
};
