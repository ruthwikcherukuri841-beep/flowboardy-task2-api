import cors from "cors";
import express from "express";
import morgan from "morgan";
import { errorHandler, notFound } from "./middlewares/http.js";
import { projectsRouter } from "./routes/projects.routes.js";
import { tasksRouter } from "./routes/tasks.routes.js";
import { usersRouter } from "./routes/users.routes.js";

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "256kb" }));
  app.use(morgan("tiny"));

  app.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok", service: "flowboard-api" } }));

  app.use("/api/users", usersRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/tasks", tasksRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
};
