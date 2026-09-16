import { projects, tasks, uid, users } from "../data/store.js";
import { ApiError, asyncHandler, ok } from "../utils/http.js";

const assertMembers = (members = []) => {
  for (const m of members) {
    if (!users.some((u) => u.id === m)) throw ApiError.badRequest(`Unknown member: ${m}`);
  }
};

export const listProjects = asyncHandler(async (req, res) => {
  const { search = "", status } = req.query;
  const q = String(search).toLowerCase();
  const data = projects.filter((p) => {
    const matchQ = !q || `${p.title} ${p.description}`.toLowerCase().includes(q);
    const matchS = !status || p.status === status;
    return matchQ && matchS;
  });
  return ok(res, data);
});

export const getProject = asyncHandler(async (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) throw ApiError.notFound("Project not found");
  return ok(res, { ...project, tasks: tasks.filter((t) => t.projectId === project.id) });
});

export const createProject = asyncHandler(async (req, res) => {
  assertMembers(req.body.members);
  const project = { id: uid("p"), progress: 0, createdAt: new Date().toISOString().slice(0, 10), ...req.body };
  projects.push(project);
  return ok(res, project, 201);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) throw ApiError.notFound("Project not found");
  if (req.body.members) assertMembers(req.body.members);
  Object.assign(project, req.body);
  return ok(res, project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const idx = projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) throw ApiError.notFound("Project not found");
  const [removed] = projects.splice(idx, 1);
  // Cascade: a project owns its tasks
  for (let i = tasks.length - 1; i >= 0; i--) if (tasks[i].projectId === removed.id) tasks.splice(i, 1);
  return ok(res, removed);
});
