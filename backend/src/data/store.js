// In-memory store for the API milestone.
// Shapes mirror frontend/src/data/mockData.ts so the database
// milestone can swap this file for real models without touching routes.

export const users = [
  { id: "u1", name: "Aarav Mehta", email: "aarav@flowboard.app", role: "Full Stack Developer", avatar: "AM", createdAt: "2026-08-01" },
  { id: "u2", name: "Sofia Rao", email: "sofia@flowboard.app", role: "UI Designer", avatar: "SR", createdAt: "2026-08-02" },
  { id: "u3", name: "Kabir Shah", email: "kabir@flowboard.app", role: "Backend Developer", avatar: "KS", createdAt: "2026-08-03" },
  { id: "u4", name: "Ira Patel", email: "ira@flowboard.app", role: "QA Engineer", avatar: "IP", createdAt: "2026-08-04" },
];

export const projects = [
  { id: "p1", title: "FlowBoard Web App", description: "Core dashboard, project boards and real-time task tracking for teams.", status: "active", progress: 72, dueDate: "2026-10-15", members: ["u1", "u2", "u3"], createdAt: "2026-08-01" },
  { id: "p2", title: "Mobile Companion", description: "React Native companion with offline sync and push notifications.", status: "active", progress: 45, dueDate: "2026-11-02", members: ["u1", "u4"], createdAt: "2026-08-10" },
  { id: "p3", title: "Analytics Engine", description: "Productivity insights, burndown charts and weekly reports.", status: "active", progress: 30, dueDate: "2026-11-20", members: ["u3", "u1"], createdAt: "2026-08-18" },
  { id: "p4", title: "Design System", description: "Reusable components, tokens and accessibility guidelines.", status: "completed", progress: 100, dueDate: "2026-09-01", members: ["u2", "u1"], createdAt: "2026-07-05" },
  { id: "p5", title: "API Gateway v2", description: "Rate limiting, validation hardening and OpenAPI docs.", status: "on-hold", progress: 15, dueDate: "2026-12-01", members: ["u3"], createdAt: "2026-09-01" },
  { id: "p6", title: "AI Assist Beta", description: "Task generation, summarization and smart prioritization prototype.", status: "active", progress: 58, dueDate: "2026-10-30", members: ["u1", "u2", "u3", "u4"], createdAt: "2026-09-05" },
];

export const tasks = [
  { id: "t1", projectId: "p1", title: "Build sidebar + navbar layout", description: "Responsive app shell with accessible navigation.", status: "done", priority: "high", assignee: "u1", dueDate: "2026-09-10", createdAt: "2026-09-01" },
  { id: "t2", projectId: "p1", title: "Project cards grid", description: "Consistent cards with progress and members.", status: "done", priority: "medium", assignee: "u2", dueDate: "2026-09-12", createdAt: "2026-09-02" },
  { id: "t3", projectId: "p1", title: "Search + filter hooks", description: "Live search across projects and tasks.", status: "in-progress", priority: "high", assignee: "u1", dueDate: "2026-09-20", createdAt: "2026-09-05" },
  { id: "t4", projectId: "p1", title: "Loading and empty states", description: "Skeletons, empty illustrations, error retry.", status: "in-progress", priority: "medium", assignee: "u2", dueDate: "2026-09-22", createdAt: "2026-09-06" },
  { id: "t5", projectId: "p2", title: "Offline task cache", description: "Persist tasks in AsyncStorage with sync queue.", status: "todo", priority: "high", assignee: "u1", dueDate: "2026-10-05", createdAt: "2026-09-07" },
  { id: "t7", projectId: "p3", title: "Burndown chart component", description: "Weekly completed vs pending visualization.", status: "in-progress", priority: "medium", assignee: "u3", dueDate: "2026-10-01", createdAt: "2026-09-09" },
  { id: "t10", projectId: "p4", title: "Accessibility audit", description: "Keyboard nav, contrast, aria labels passed.", status: "done", priority: "high", assignee: "u2", dueDate: "2026-08-28", createdAt: "2026-08-10" },
  { id: "t12", projectId: "p6", title: "AI task generation prompt", description: "Project title to subtasks prototype.", status: "in-progress", priority: "high", assignee: "u1", dueDate: "2026-09-28", createdAt: "2026-09-12" },
];

export const uid = (p) => `${p}${Date.now().toString(36)}`;
