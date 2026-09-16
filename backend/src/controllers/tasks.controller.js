import { projects, tasks, uid, users } from "../data/store.js";
import { ApiError, asyncHandler, ok } from "../utils/http.js";

const assertRefs = (body) => {
  if (body.projectId && !projects.some((p) => p.id === body.projectId)) {
    throw ApiError.badRequest(`Unknown projectId: ${body.projectId}`);
  }
  if (body.assignee && !users.some((u) => u.id === body.assignee)) {
    throw ApiError.badRequest(`Unknown assignee: ${body.assignee}`);
  }
};

const refreshProgress = (projectId) => {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;
  const list = tasks.filter((t) => t.projectId === projectId);
  const done = list.filter((t) => t.status === "done").length;
  project.progress = list.length ? Math.round((done / list.length) * 100) : project.progress;
};

export const listTasks = asyncHandler(async (req, res) => {
  const { projectId, status, priority, search = "" } = req.query;
  const q = String(search).toLowerCase();
  const data = tasks.filter((t) => {
    const matchQ = !q || `${t.title} ${t.description}`.toLowerCase().includes(q);
    return matchQ && (!projectId || t.projectId === projectId) && (!status || t.status === status) && (!priority || t.priority === priority);
  });
  return ok(res, data);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) throw ApiError.notFound("Task not found");
  return ok(res, task);
});

export const createTask = asyncHandler(async (req, res) => {
  assertRefs(req.body);
  const task = { id: uid("t"), createdAt: new Date().toISOString().slice(0, 10), ...req.body };
  tasks.push(task);
  refreshProgress(task.projectId);
  return ok(res, task, 201);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) throw ApiError.notFound("Task not found");
  assertRefs(req.body);
  const oldProject = task.projectId;
  Object.assign(task, req.body);
  refreshProgress(oldProject);
  refreshProgress(task.projectId);
  return ok(res, task);
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) throw ApiError.notFound("Task not found");
  task.status = req.body.status;
  refreshProgress(task.projectId);
  return ok(res, task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) throw ApiError.notFound("Task not found");
  const [removed] = tasks.splice(idx, 1);
  refreshProgress(removed.projectId);
  return ok(res, removed);
});
