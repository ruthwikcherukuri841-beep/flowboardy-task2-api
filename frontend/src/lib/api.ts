// Typed client for the FlowBoard REST API.
// Base URL comes from VITE_API_URL (build-time). Local default points at
// a locally running backend — still the real API, never mock data.
import type { Project, ProjectStatus, Task, TaskPriority, TaskStatus, User } from "../types";

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000/api";

interface Envelope<T> {
  success: boolean;
  data: T;
  error?: { message: string; details?: unknown };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok || !body?.success) {
    throw new Error(body?.error?.message ?? `Request failed (${res.status})`);
  }
  return body.data;
}

export const api = {
  getUsers: () => request<User[]>("/users"),
  getProjects: (params: { search?: string; status?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    if (params.status && params.status !== "all") q.set("status", params.status);
    const s = q.toString();
    return request<Project[]>(`/projects${s ? `?${s}` : ""}`);
  },
  getProject: (id: string) => request<Project & { tasks: Task[] }>(`/projects/${id}`),
  createProject: (d: { title: string; description: string; status: ProjectStatus; dueDate: string }) =>
    request<Project>("/projects", { method: "POST", body: JSON.stringify({ ...d, members: ["u1"] }) }),
  updateProject: (id: string, d: Partial<Project>) =>
    request<Project>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteProject: (id: string) => request<Project>(`/projects/${id}`, { method: "DELETE" }),

  getTasks: (params: { projectId?: string; status?: string; priority?: string; search?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.projectId && params.projectId !== "all") q.set("projectId", params.projectId);
    if (params.status && params.status !== "all") q.set("status", params.status);
    if (params.priority && params.priority !== "all") q.set("priority", params.priority);
    if (params.search) q.set("search", params.search);
    const s = q.toString();
    return request<Task[]>(`/tasks${s ? `?${s}` : ""}`);
  },
  createTask: (d: { projectId: string; title: string; description: string; status: TaskStatus; priority: TaskPriority; assignee: string; dueDate: string }) =>
    request<Task>("/tasks", { method: "POST", body: JSON.stringify(d) }),
  updateTask: (id: string, d: Partial<Task>) =>
    request<Task>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  setTaskStatus: (id: string, status: TaskStatus) =>
    request<Task>(`/tasks/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteTask: (id: string) => request<Task>(`/tasks/${id}`, { method: "DELETE" }),
};

export const apiBase = BASE;
