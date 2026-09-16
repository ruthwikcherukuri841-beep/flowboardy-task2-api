import { Router } from "express";
import { createProject, deleteProject, getProject, listProjects, updateProject } from "../controllers/projects.controller.js";
import { validate } from "../middlewares/http.js";
import { projectCreateSchema, projectUpdateSchema } from "../validators/project.schema.js";

export const projectsRouter = Router();

projectsRouter.get("/", listProjects);
projectsRouter.post("/", validate(projectCreateSchema), createProject);
projectsRouter.get("/:id", getProject);
projectsRouter.put("/:id", validate(projectUpdateSchema), updateProject);
projectsRouter.delete("/:id", deleteProject);
