# FlowBoard REST API — Task 2

A complete, unified REST API for FlowBoard: authentication, users, projects, tasks, team collaboration, sharing with access control, temporary teammate chat, and avatar uploads — written with Express, Zod, Mongoose and JWT, persisted on MongoDB (Atlas in production).

**Live API** → `https://flowboardy-api.vercel.app`

| Endpoint | What it gives you |
| --------- | ----------------- |
| `GET /` | Redirects to the unified API index (`/api`) |
| `GET /api` | **Unified API index** — every resource, JSON, no auth |
| `GET /health` | Service status |

Every feature below is served by this one API — there is **zero mock data** and nothing fabricated. What you create with one token is what you read back.

---

## Quick start (local)

```bash
cd backend
npm install
npm run dev          # http://localhost:5000
```

Local dev needs no database — it uses an ephemeral in-memory Mongo. For persistence set `DATABASE_URL` in `backend/.env` (see `.env.example`).

## How to check the API

**1. Browser** — open the live root:
- https://flowboardy-api.vercel.app/api (unified index)
- https://flowboardy-api.vercel.app/health

**2. curl** — register, log in, then call anything:

```bash
BASE=https://flowboardy-api.vercel.app/api

curl -X POST $BASE/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com","password":"secret123"}'

TOKEN=$(curl -s -X POST $BASE/auth/login -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"secret123"}' | jq -r .data.token)

curl -s $BASE/health
curl -s $BASE/projects -H "Authorization: Bearer $TOKEN"
curl -s $BASE/users -H "Authorization: Bearer $TOKEN"
```

**3. Postman** — import `backend/postman_collection.json` (one click; requests + auth documented). The `flowboardy-api` variable already points at production.

## Feature summary (all REST)

- **Auth** — register / login / me, JWT Bearer tokens (7-day expiry), bcrypt-hashed passwords
- **Users** — directory with `?search=`, profile avatar via imgbb CDN, self-managed profiles
- **Projects** — CRUD, filter `?search=&status=`, cascade task deletion, live `progress`
- **Tasks** — CRUD, filters `?projectId=&status=&priority=&search=`, status `todo | in-progress | review | done`, task completion drives project progress
- **Sharing** — share projects with teammates at **`view` | `review` | `edit`**, enforced server-side on every read/write; `review` can move tasks to `review` but not `done`
- **Teams** — CRUD with members: add, remove, leave
- **Chat (temporary)** — direct teammate messaging (inbox, threads, seen, clear); messages auto-delete after 24 hours
- **Uploads** — profile photos (base64 → imgbb CDN URL stored on the user)

## Project layout

```
backend/
  api/index.js          Vercel serverless entry (unified handler)
  src/app.js            Express wiring, unified API index, health
  src/config/           env.js (PORT, DATABASE_URL, JWT_SECRET, IMGBB_KEY), db.js
  src/models/           Mongoose schemas (User, Project, Task, Team, ChatMessage)
  src/validators/       Zod schemas for every write operation
  src/controllers/      Auth, users, projects, tasks, teams, chat, uploads
  src/routes/           Router per resource, mounted under /api
  src/middlewares/      requireAuth (JWT), http (validate, notFound, errorHandler)
  postman_collection.json
  vercel.json           Serverless routing (root → /api + rewrites)
```

See **[`backend/README.md`](backend/README.md)** for the complete endpoint contract, response shapes and error codes.