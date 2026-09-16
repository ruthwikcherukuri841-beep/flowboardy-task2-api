import bcrypt from "bcryptjs";
import { env } from "./config/env.js";
import { Project } from "./models/Project.js";
import { Task } from "./models/Task.js";
import { User } from "./models/User.js";

// First-boot seed so the app opens with a real workspace.
// Runs only when the users collection is empty — never touches existing data.
export async function seedIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) return null;

  const demo = await User.create({
    name: "Aarav Mehta",
    email: env.demoEmail.toLowerCase(),
    passwordHash: await bcrypt.hash(env.demoPassword, 10),
    role: "Full Stack Developer",
    avatar: "AM",
  });
  const others = await User.create([
    { name: "Sofia Rao", email: "sofia@flowboard.app", passwordHash: await bcrypt.hash("password123", 10), role: "UI Designer", avatar: "SR" },
    { name: "Kabir Shah", email: "kabir@flowboard.app", passwordHash: await bcrypt.hash("password123", 10), role: "Backend Developer", avatar: "KS" },
  ]);
  const [sofia, kabir] = others;

  const projectSeeds = [
    { title: "FlowBoard Web App", description: "Core dashboard, project boards and real-time task tracking for teams.", status: "active", dueDate: "2026-10-15", members: [demo.id, sofia.id, kabir.id] },
    { title: "Mobile Companion", description: "Companion app with offline sync and push notifications.", status: "active", dueDate: "2026-11-02", members: [demo.id] },
    { title: "Analytics Engine", description: "Productivity insights, burndown charts and weekly reports.", status: "active", dueDate: "2026-11-20", members: [kabir.id, demo.id] },
    { title: "Design System", description: "Reusable components, tokens and accessibility guidelines.", status: "completed", dueDate: "2026-09-01", members: [sofia.id, demo.id] },
  ];
  const created = [];
  for (const p of projectSeeds) {
    created.push(await Project.create({ ...p, progress: 0, createdBy: demo.id }));
  }
  const [web, mobile, analytics, design] = created;

  const taskSeeds = [
    { projectId: web.id, title: "Build sidebar + navbar layout", description: "Responsive app shell with accessible navigation.", status: "done", priority: "high", assignee: demo.id, dueDate: "2026-09-10" },
    { projectId: web.id, title: "Project cards grid", description: "Consistent cards with progress and members.", status: "done", priority: "medium", assignee: sofia.id, dueDate: "2026-09-12" },
    { projectId: web.id, title: "Search + filter hooks", description: "Live search across projects and tasks.", status: "in-progress", priority: "high", assignee: demo.id, dueDate: "2026-09-20" },
    { projectId: web.id, title: "Loading and empty states", description: "Skeletons, empty illustrations, error retry.", status: "in-progress", priority: "medium", assignee: sofia.id, dueDate: "2026-09-22" },
    { projectId: mobile.id, title: "Offline task cache", description: "Persist tasks locally with a sync queue.", status: "todo", priority: "high", assignee: demo.id, dueDate: "2026-10-05" },
    { projectId: analytics.id, title: "Burndown chart component", description: "Weekly completed vs pending visualization.", status: "in-progress", priority: "medium", assignee: kabir.id, dueDate: "2026-10-01" },
    { projectId: design.id, title: "Accessibility audit", description: "Keyboard nav, contrast, aria labels passed.", status: "done", priority: "high", assignee: sofia.id, dueDate: "2026-08-28" },
  ];
  for (const t of taskSeeds) await Task.create(t);
  for (const p of created) {
    const total = await Task.countDocuments({ projectId: p.id });
    const done = await Task.countDocuments({ projectId: p.id, status: "done" });
    p.progress = total ? Math.round((done / total) * 100) : 0;
    await p.save();
  }

  console.log(`[seed] workspace ready — sign in with ${env.demoEmail} / ${env.demoPassword}`);
  return demo;
}
