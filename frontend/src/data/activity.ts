import type { Task } from "../types";
import { projectById, userById } from "./directory";

export interface AppNotification {
  id: string;
  kind: "overdue" | "due-soon" | "assigned" | "completed" | "progress";
  title: string;
  body: string;
  taskId?: string;
  time: string;
  read: boolean;
}

// Deterministic demo notifications derived from real task data so the
// panel always feels connected to the board (no lorem ipsum).
export function buildNotifications(tasks: Task[]): AppNotification[] {
  const pick = (ids: string[]) => tasks.filter((t) => ids.includes(t.id));
  const overdue = tasks.filter((t) => t.status !== "done" && t.dueDate < "2026-09-20").slice(0, 2);
  const dueSoon = tasks.filter((t) => t.status !== "done" && t.dueDate >= "2026-09-20").slice(0, 2);
  const done = pick(["t1", "t10"]).filter(Boolean);
  const assigned = pick(["t3", "t12"]).filter(Boolean);

  const list: AppNotification[] = [
    ...overdue.map((t, i) => ({
      id: `n-over-${t.id}`,
      kind: "overdue" as const,
      title: "Task overdue",
      body: `${t.title} · ${projectById(t.projectId).title} was due ${t.dueDate}`,
      taskId: t.id,
      time: i === 0 ? "2h ago" : "Yesterday",
      read: false,
    })),
    ...dueSoon.map((t, i) => ({
      id: `n-due-${t.id}`,
      kind: "due-soon" as const,
      title: "Due soon",
      body: `${t.title} is due ${t.dueDate} · ${userById(t.assignee).name}`,
      taskId: t.id,
      time: i === 0 ? "5h ago" : "1d ago",
      read: i !== 0,
    })),
    ...assigned.map((t) => ({
      id: `n-asg-${t.id}`,
      kind: "assigned" as const,
      title: "Assigned to you",
      body: `${t.title} · ${projectById(t.projectId).title}`,
      taskId: t.id,
      time: "2d ago",
      read: true,
    })),
    ...done.map((t) => ({
      id: `n-done-${t.id}`,
      kind: "completed" as const,
      title: "Marked done",
      body: `${t.title} was completed`,
      taskId: t.id,
      time: "3d ago",
      read: true,
    })),
  ];
  return list;
}

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
  taskId?: string;
}

export function buildActivity(tasks: Task[]): ActivityItem[] {
  const order = ["t12", "t3", "t16", "t7", "t1", "t10", "t4"];
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const verbs: Record<string, string> = {
    todo: "added",
    "in-progress": "started",
    done: "completed",
  };
  return order
    .map((id) => byId.get(id))
    .filter((t): t is Task => Boolean(t))
    .map((t) => ({
      id: `a-${t.id}`,
      text: `${userById(t.assignee).name} ${verbs[t.status] ?? "updated"} “${t.title}”`,
      time: t.dueDate,
      taskId: t.id,
    }));
}
