import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { ApiError, asyncHandler, ok } from "../utils/http.js";

const assertRefs = async (body) => {
  if (body.projectId && !(await Project.exists({ _id: body.projectId }))) {
    throw ApiError.badRequest(`Unknown projectId: ${body.projectId}`);
  }
  if (body.assignee && !(await User.exists({ _id: body.assignee }))) {
    throw ApiError.badRequest(`Unknown assignee: ${body.assignee}`);
  }
};

const refreshProgress = async (projectId) => {
  const total = await Task.countDocuments({ projectId });
  const done = await Task.countDocuments({ projectId, status: "done" });
  await Project.findByIdAndUpdate(projectId, {
    progress: total ? Math.round((done / total) * 100) : 0,
  });
};

export const listTasks = asyncHandler(async (req, res) => {
  const { projectId, status, priority, search = "" } = req.query;
  const filter = {};
  if (projectId) filter.projectId = projectId;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) {
    const q = String(search);
    filter.$or = [{ title: new RegExp(q, "i") }, { description: new RegExp(q, "i") }];
  }
  return ok(res, await Task.find(filter).sort({ createdAt: -1 }));
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw ApiError.notFound("Task not found");
  return ok(res, task);
});

export const createTask = asyncHandler(async (req, res) => {
  await assertRefs(req.body);
  const task = await Task.create({
    projectId: req.body.projectId,
    title: req.body.title,
    description: req.body.description ?? "",
    status: req.body.status ?? "todo",
    priority: req.body.priority ?? "medium",
    assignee: req.body.assignee,
    dueDate: req.body.dueDate ?? "",
  });
  await refreshProgress(task.projectId);
  return ok(res, task, 201);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw ApiError.notFound("Task not found");
  await assertRefs(req.body);
  const oldProject = task.projectId.toString();
  for (const k of ["projectId", "title", "description", "status", "priority", "assignee", "dueDate"]) {
    if (req.body[k] !== undefined) task[k] = req.body[k];
  }
  await task.save();
  await refreshProgress(oldProject);
  await refreshProgress(task.projectId);
  return ok(res, task);
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw ApiError.notFound("Task not found");
  task.status = req.body.status;
  await task.save();
  await refreshProgress(task.projectId);
  return ok(res, task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw ApiError.notFound("Task not found");
  const projectId = task.projectId;
  await task.deleteOne();
  await refreshProgress(projectId);
  return ok(res, task);
});
