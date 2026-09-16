# FlowBoard API — Auth, Users, Projects & Tasks

Express + Zod + Mongoose REST API backing the FlowBoard dashboard. Persistent MongoDB storage (Atlas in production, ephemeral in-memory Mongo for zero-setup local dev).

## Quick start

```bash
cd backend
cp .env.example .env   # optional — defaults work locally
npm install
npm run dev            # http://localhost:5000
```

First boot seeds a demo workspace. Sign in with `demo@flowboard.app` / `demo1234`.

Health check: `GET /health` → `{ success: true, data: { status: "ok" } }`

## Auth

JWT Bearer tokens (7-day expiry, `JWT_SECRET`). Every `/api/users|projects|tasks` route requires `Authorization: Bearer <token>` → 401 otherwise.

| Method | URL | Body |
| ------ | --- | ---- |
| POST | `/api/auth/register` | `{ name, email, password, role? }` → 201 `{ token, user }` / 409 duplicate |
| POST | `/api/auth/login` | `{ email, password }` → 200 `{ token, user }` / 401 wrong credentials |
| GET | `/api/auth/me` | current user (protected) |
| POST | `/api/auth/logout` | `{ message }` (client clears token) |

Passwords are bcrypt-hashed; hashes never leave the server.

## Response format

- Success: `{ success: true, data: ... }` (201 on creates)
- Error: `{ success: false, error: { message, details? } }`
- Codes: `200` ok · `201` created · `400` validation · `404` not found · `409` conflict (duplicate email) · `500` fallback

## Endpoints

### Users
| Method | URL | Body |
| ------ | --- | ---- |
| POST | `/api/users` | `{ name, email, role? }` → 201 / 409 |
| GET | `/api/users` | list |
| GET | `/api/users/:id` | — → 404 if missing |
| PUT | `/api/users/:id` | partial `{ name?, email?, role? }` |
| DELETE | `/api/users/:id` | also unassigns tasks + removes memberships |

### Projects
| Method | URL | Body |
| ------ | --- | ---- |
| POST | `/api/projects` | `{ title, description?, status?, dueDate?, members? }` → 201 / 400 unknown member |
| GET | `/api/projects?search=&status=` | filter by text / active\|completed\|on-hold |
| GET | `/api/projects/:id` | project + its `tasks` |
| PUT | `/api/projects/:id` | partial update |
| DELETE | `/api/projects/:id` | cascade-deletes its tasks |

### Tasks
| Method | URL | Body |
| ------ | --- | ---- |
| POST | `/api/tasks` | `{ projectId, title, description?, status?, priority?, assignee?, dueDate? }` → 201 / 400 unknown ref |
| GET | `/api/tasks?projectId=&status=&priority=&search=` | combined filters |
| GET | `/api/tasks/:id` | — |
| PUT | `/api/tasks/:id` | partial update (recomputes project progress) |
| PATCH | `/api/tasks/:id/status` | `{ status: todo\|in-progress\|done }` |
| DELETE | `/api/tasks/:id` | recomputes project progress |

Enums: `status todo|in-progress|done` · `priority low|medium|high` · project `status active|completed|on-hold`. Dates are `YYYY-MM-DD`.

## Try it

```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/projects?status=active
curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d "{\"projectId\":\"p1\",\"title\":\"Write release notes\",\"priority\":\"high\"}"
curl -X PATCH http://localhost:5000/api/tasks/t3/status -H "Content-Type: application/json" -d "{\"status\":\"done\"}"
curl "http://localhost:5000/api/tasks?status=in-progress&priority=high"
```

A ready-made Postman collection lives in `postman_collection.json` (import → run).

## Structure

```
src/
  app.js / index.js        express wiring + listen
  config/env.js            PORT, NODE_ENV, DATABASE_URL (reserved)
  data/store.js            in-memory users/projects/tasks seed
  validators/*.schema.js   zod schemas (all write ops)
  middlewares/http.js      validate, notFound, centralized errorHandler
  controllers/             thin logic over the store
  routes/                  /api/users, /api/projects, /api/tasks
```

## Notes

- No secrets in the repo — config comes from `.env` (see `.env.example`).
- `DELETE /api/projects/:id` deletes its tasks; `DELETE /api/users/:id` unassigns theirs.
- Task writes recompute the parent project's `progress` so the dashboard stays truthful.
