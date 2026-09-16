export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type ProjectStatus = "active" | "completed" | "on-hold";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  dueDate: string;
  members: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  createdAt: string;
}

export type View = "dashboard" | "projects" | "tasks" | "profile";
