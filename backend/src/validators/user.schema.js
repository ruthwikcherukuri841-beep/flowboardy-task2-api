import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters"),
  email: z.string().email("email must be a valid email"),
  role: z.string().min(2).optional().default("Member"),
}).strict();

export const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.string().min(2).optional(),
}).strict().refine((o) => Object.keys(o).length > 0, { message: "at least one field is required" });
