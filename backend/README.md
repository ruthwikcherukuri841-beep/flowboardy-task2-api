# FlowBoard API — complete endpoint contract

Express + Zod + Mongoose REST API. Persistent MongoDB (Atlas in production; ephemeral in-memory Mongo for zero-setup local dev). Deployed at `https://flowboardy-api.vercel.app`.

## Quick start

```bash
cd backend
cp .env.example .env   # optional — defaults work locally
npm install
npm run dev            # http://localhost:5000
```

## Base URLs

- Production: `https://flowboardy-api.vercel.app/api`
- Local: `http://localhost:5000/api`

Every request (except `GET /api`, `GET /health`, auth) requires:

```
Authorization: Bearer <token>
```

## Response format

- Success: `{ "success": true, "data": ... }` (201 on creates)
- Error: `{ "success": false, "error": { "message": "...", "details?": [...] } }`
- Codes: `200` ok · `201` created · `400` validation · `401` unauthorized · `403` forbidden · `404` not found · `409` conflict · `422` unprocessable · `429` rate limited · `500` fallback

## Unified API index

- `GET /` — on production redirects to `/api` (Vercel normalizes the root path; the redirect keeps the entry point clean).
- `GET /api` — JSON index naming the service, version and every resource.
- `GET /health` — `{ success: true, data: { status: "ok" } }`

## Auth

| Method | URL | Body → result |
| ------ | --- | ------------- |
| POST | `/api/auth/register` | `{ name, email, password, role? }` → 201 `{ token, user }` / 409 duplicate email |
| POST | `/api/auth/login` | `{ email, password }` → 200 `{ token, user }` / 401 wrong credentials |
| GET | `/api/auth/me` | current user (protected) |

Passwords are bcrypt-hashed; hashes never leave the server. Tokens are JWT (7-day expiry, `JWT_SECRET`).

## Users

| Method | URL | Body → result |
| ------ | --- | ------------- |
| GET | `/api/users?search=` | member directory (search by name / email / role / location). **Public-facing list for the workspace** — returns `id, name, email, role, location, bio, avatar` |
| GET | `/api/users/:id` | one profile |
| PUT | `/api/users/:id` | partial `{ name?, email?, role?, location?, bio? }` (only your own profile) |
| DELETE | `/api/users/:id` | delete your own account |

## Projects

| Method | URL | Body → result |
| ------ | --- | ------------- |
| GET | `/api/projects?search=&status=` | projects you own **or are shared with**; `status = active \| completed \| on-hold` |
| POST | `/api/projects` | `{ title, description?, status?, dueDate?, members? }` → 201 |
| GET | `/api/projects/:id` | project + its `tasks` + `sharedWith` |
| PUT | `/api/projects/:id` | partial update (owner or `edit` access) |
| DELETE | `/api/projects/:id` | cascade-deletes its tasks (owner or `edit` access) |
| POST | `/api/projects/:id/share` | `{ userId, access: "view" \| "review" \| "edit" }` → share/update access (owner) |
| DELETE | `/api/projects/:id/share/:userId` | stop sharing (owner) |

Sharing access is enforced server-side on every read and write:

| Access | Read | Set status | Set `done` | Edit/delete/share |
| ------ | ---- | ---------- | ---------- | ----------------- |
| `view` | yes | no | no | no |
| `review` | yes | up to `review` | no | no |
| `edit` | yes | any | yes | edit/delete (not share) |
| owner | yes | any | yes | everything |

## Tasks

| Method | URL | Body → result |
| ------ | --- | ------------- |
| GET | `/api/tasks?projectId=&status=&priority=&search=` | combined filters |
| POST | `/api/tasks` | `{ projectId, title, description?, status?, priority?, assignee?, dueDate? }` → 201 (owner) |
| GET | `/api/tasks/:id` | one task |
| PUT | `/api/tasks/:id` | partial update (owner) — recomputes project progress |
| PATCH | `/api/tasks/:id/status` | `{ status }` (access-gated, see table above) |
| DELETE | `/api/tasks/:id` | (owner) — recomputes project progress |

Enums: task `status = todo \| in-progress \| review \| done` · `priority = low \| medium \| high` · project `status = active \| completed \| on-hold`. Dates are `YYYY-MM-DD`.

## Teams

| Method | URL | Body → result |
| ------ | --- | ------------- |
| GET/POST | `/api/teams` | list / create `{ name, description?, memberIds? }` |
| GET/PUT/DELETE | `/api/teams/:id` | detail (with members) / update / delete |
| POST | `/api/teams/:id/members` | `{ userId }` → add a member |
| DELETE | `/api/teams/:id/members/:userId` | remove a member |
| POST | `/api/teams/:id/leave` | leave a team |

## Chat (temporary)

| Method | URL | Body → result |
| ------ | --- | ------------- |
| GET | `/api/chat/inbox` | conversations with `unread` counts + last message |
| POST | `/api/chat/send` | `{ to, text }` (≤ 2000 chars) |
| GET | `/api/chat/:userId/messages` | full thread with one teammate (marks inbound as seen) |
| DELETE | `/api/chat/:userId/messages` | clear the conversation |

Messages are temporary by design: each document expires after **24 hours** (MongoDB TTL index), so nothing is ever stored long-term.

## Uploads

| Method | URL | Body → result |
| ------ | --- | ------------- |
| POST | `/api/uploads/avatar` | `{ image: "data:image/png;base64,..." }` → 201 `{ url }` (imgbb CDN). Requires `IMGBB_KEY`. |

## Environment variables

| Var | Required | Notes |
| --- | -------- | ----- |
| `PORT` | no | default `5000` |
| `NODE_ENV` | no | `development` / `production` |
| `DATABASE_URL` | prod only | MongoDB connection string; local dev falls back to ephemeral in-memory Mongo |
| `JWT_SECRET` | yes (prod) | long random string for signing tokens |
| `JWT_EXPIRES_IN` | no | default `7d` |
| `IMGBB_KEY` | for avatars | imgbb API key; uploads return 503 without it |

## Structure

```
api/index.js            Vercel serverless entry — same express app
src/app.js              wiring, unified API index, /health
src/config/             env.js, db.js (Mongo connect)
src/controllers/        auth, users, projects, tasks, teams, chat, uploads
src/models/             User, Project, Task, Team, ChatMessage (Mongoose)
src/middlewares/        auth.js (JWT), http.js (validate / notFound / errorHandler)
src/routes/             one router per resource, mounted under /api
src/utils/http.js       ApiError, asyncHandler, access helpers
src/validators/         Zod schemas for every write op
```

## Try it

```bash
BASE=https://flowboardy-api.vercel.app/api
curl $BASE/health
curl $BASE/api            # unified index
curl -X POST $BASE/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com","password":"secret123"}'
```

A ready-made Postman collection lives in `postman_collection.json` (import → run; `flowboardy-api` variable pre-pointed at production).