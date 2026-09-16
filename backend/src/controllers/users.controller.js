import { projects, tasks, uid, users } from "../data/store.js";
import { ApiError, asyncHandler, ok } from "../utils/http.js";

const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export const listUsers = asyncHandler(async (_req, res) => ok(res, users));

export const getUser = asyncHandler(async (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) throw ApiError.notFound("User not found");
  return ok(res, user);
});

export const createUser = asyncHandler(async (req, res) => {
  const exists = users.some((u) => u.email.toLowerCase() === req.body.email.toLowerCase());
  if (exists) throw ApiError.conflict("Email is already registered");
  const user = { id: uid("u"), avatar: initials(req.body.name), createdAt: new Date().toISOString().slice(0, 10), ...req.body };
  users.push(user);
  return ok(res, user, 201);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) throw ApiError.notFound("User not found");
  if (req.body.email && users.some((u) => u.id !== user.id && u.email.toLowerCase() === req.body.email.toLowerCase())) {
    throw ApiError.conflict("Email is already registered");
  }
  Object.assign(user, req.body);
  if (req.body.name) user.avatar = initials(req.body.name);
  return ok(res, user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) throw ApiError.notFound("User not found");
  const [removed] = users.splice(idx, 1);
  // Unassign tasks owned by the deleted user instead of orphaning silently
  for (const t of tasks) if (t.assignee === removed.id) delete t.assignee;
  for (const p of projects) p.members = p.members.filter((m) => m !== removed.id);
  return ok(res, removed);
});
