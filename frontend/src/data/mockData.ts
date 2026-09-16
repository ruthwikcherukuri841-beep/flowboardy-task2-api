import type { Project, Task, User } from "../types";

export const currentUser: User = {
  id: "u1",
  name: "Aarav Mehta",
  email: "aarav@flowboard.app",
  avatar: "AM",
  role: "Full Stack Developer",
};

export const users: User[] = [
  currentUser,
  { id: "u2", name: "Sofia Rao", email: "sofia@flowboard.app", avatar: "SR", role: "UI Designer" },
  { id: "u3", name: "Kabir Shah", email: "kabir@flowboard.app", avatar: "KS", role: "Backend Developer" },
  { id: "u4", name: "Ira Patel", email: "ira@flowboard.app", avatar: "IP", role: "QA Engineer" },
];

export const projects: Project[] = [
  {
    id: "p1",
    title: "FlowBoard Web App",
    description: "Core dashboard, project boards and real-time task tracking for teams.",
    status: "active",
    progress: 72,
    dueDate: "2026-10-15",
    members: ["u1", "u2", "u3"],
    createdAt: "2026-08-01",
  },
  {
    id: "p2",
    title: "Mobile Companion",
    description: "React Native companion with offline sync and push notifications.",
    status: "active",
    progress: 45,
    dueDate: "2026-11-02",
    members: ["u1", "u4"],
    createdAt: "2026-08-10",
  },
  {
    id: "p3",
    title: "Analytics Engine",
    description: "Productivity insights, burndown charts and weekly reports.",
    status: "active",
    progress: 30,
    dueDate: "2026-11-20",
    members: ["u3", "u1"],
    createdAt: "2026-08-18",
  },
  {
    id: "p4",
    title: "Design System",
    description: "Reusable components, tokens and accessibility guidelines.",
    status: "completed",
    progress: 100,
    dueDate: "2026-09-01",
    members: ["u2", "u1"],
    createdAt: "2026-07-05",
  },
  {
    id: "p5",
    title: "API Gateway v2",
    description: "Rate limiting, validation hardening and OpenAPI docs.",
    status: "on-hold",
    progress: 15,
    dueDate: "2026-12-01",
    members: ["u3"],
    createdAt: "2026-09-01",
  },
  {
    id: "p6",
    title: "AI Assist Beta",
    description: "Task generation, summarization and smart prioritization prototype.",
    status: "active",
    progress: 58,
    dueDate: "2026-10-30",
    members: ["u1", "u2", "u3", "u4"],
    createdAt: "2026-09-05",
  },
];

export const tasks: Task[] = [
  { id: "t1", projectId: "p1", title: "Build sidebar + navbar layout", description: "Responsive app shell with accessible navigation.", status: "done", priority: "high", assignee: "u1", dueDate: "2026-09-10", createdAt: "2026-09-01" },
  { id: "t2", projectId: "p1", title: "Project cards grid", description: "Consistent cards with progress and members.", status: "done", priority: "medium", assignee: "u2", dueDate: "2026-09-12", createdAt: "2026-09-02" },
  { id: "t3", projectId: "p1", title: "Search + filter hooks", description: "Live search across projects and tasks.", status: "in-progress", priority: "high", assignee: "u1", dueDate: "2026-09-20", createdAt: "2026-09-05" },
  { id: "t4", projectId: "p1", title: "Loading and empty states", description: "Skeletons, empty illustrations, error retry.", status: "in-progress", priority: "medium", assignee: "u2", dueDate: "2026-09-22", createdAt: "2026-09-06" },
  { id: "t5", projectId: "p2", title: "Offline task cache", description: "Persist tasks in AsyncStorage with sync queue.", status: "todo", priority: "high", assignee: "u1", dueDate: "2026-10-05", createdAt: "2026-09-07" },
  { id: "t6", projectId: "p2", title: "Push notifications setup", description: "Due-date reminders via Expo notifications.", status: "todo", priority: "low", assignee: "u4", dueDate: "2026-10-12", createdAt: "2026-09-08" },
  { id: "t7", projectId: "p3", title: "Burndown chart component", description: "Weekly completed vs pending visualization.", status: "in-progress", priority: "medium", assignee: "u3", dueDate: "2026-10-01", createdAt: "2026-09-09" },
  { id: "t8", projectId: "p3", title: "Weekly report email template", description: "HTML summary of team velocity.", status: "todo", priority: "low", assignee: "u3", dueDate: "2026-10-10", createdAt: "2026-09-10" },
  { id: "t9", projectId: "p4", title: "Color tokens + typography", description: "Shipped in v1 of design system.", status: "done", priority: "medium", assignee: "u2", dueDate: "2026-08-20", createdAt: "2026-08-01" },
  { id: "t10", projectId: "p4", title: "Accessibility audit", description: "Keyboard nav, contrast, aria labels passed.", status: "done", priority: "high", assignee: "u2", dueDate: "2026-08-28", createdAt: "2026-08-10" },
  { id: "t11", projectId: "p5", title: "Rate limiter middleware", description: "Redis-backed sliding window limiter.", status: "todo", priority: "high", assignee: "u3", dueDate: "2026-11-10", createdAt: "2026-09-11" },
  { id: "t12", projectId: "p6", title: "AI task generation prompt", description: "Project title to subtasks prototype.", status: "in-progress", priority: "high", assignee: "u1", dueDate: "2026-09-28", createdAt: "2026-09-12" },
  { id: "t13", projectId: "p6", title: "Summarization UI flow", description: "Accept / edit / discard AI output.", status: "todo", priority: "medium", assignee: "u2", dueDate: "2026-10-02", createdAt: "2026-09-13" },
  { id: "t14", projectId: "p1", title: "Profile + stats widgets", description: "User card with productivity ring.", status: "done", priority: "low", assignee: "u1", dueDate: "2026-09-14", createdAt: "2026-09-03" },
  { id: "t15", projectId: "p6", title: "Productivity suggestions", description: "Overdue + workload heuristics.", status: "todo", priority: "medium", assignee: "u4", dueDate: "2026-10-08", createdAt: "2026-09-14" },
  { id: "t16", projectId: "p2", title: "Deep-link project screen", description: "Open shared project links in app.", status: "in-progress", priority: "medium", assignee: "u1", dueDate: "2026-10-04", createdAt: "2026-09-15" },
];

export const userById = (id: string): User =>
  users.find((u) => u.id === id) ?? users[0];

export const projectById = (id: string): Project =>
  projects.find((p) => p.id === id) ?? projects[0];
