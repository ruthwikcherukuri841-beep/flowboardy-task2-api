import cors from "cors";
import express from "express";
import morgan from "morgan";
import { requireAuth } from "./middlewares/auth.js";
import { errorHandler, notFound } from "./middlewares/http.js";
import { authRouter } from "./routes/auth.routes.js";
import { projectsRouter } from "./routes/projects.routes.js";
import { tasksRouter } from "./routes/tasks.routes.js";
import { usersRouter } from "./routes/users.routes.js";

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "256kb" }));
  app.use(morgan("tiny"));

  app.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok", service: "flowboard-api" } }));

  // Public: sign up / sign in. Everything else needs a Bearer token.
  app.use("/api/auth", authRouter);
  app.use("/api/users", requireAuth, usersRouter);
  app.use("/api/projects", requireAuth, projectsRouter);
  app.use("/api/tasks", requireAuth, tasksRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
};
