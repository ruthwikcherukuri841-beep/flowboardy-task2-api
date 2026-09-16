# FlowBoard — Task 2: Dashboard + REST API

Real full-stack app in one folder: authenticated dashboard plus persistent REST API.

- `frontend/` — FlowBoard dashboard (React + Vite + Tailwind). Sign up / sign in screens, protected routes, every list from the API. Run: `cd frontend && npm install && npm run dev`
- `backend/` — FlowBoard API (Express + Zod + Mongoose + JWT). Auth, users, projects, tasks on MongoDB. Run: `cd backend && npm install && npm run dev` → http://localhost:5000

Demo login (seeded on first boot): `demo@flowboard.app` / `demo1234`

Production uses MongoDB Atlas (`DATABASE_URL`) — data persists across restarts and deploys.

See `backend/README.md` for the full endpoint contract and `backend/postman_collection.json` for a one-click Postman import.

Live demo: https://flowboardy-task2.vercel.app (reads https://flowboardy-api.vercel.app/api — zero mock data)
