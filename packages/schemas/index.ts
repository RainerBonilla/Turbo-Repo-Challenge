import { z } from "zod";

export const TaskStatus = z.enum(["pending", "inProgress", "completed"]);
export const TaskPriority = z.enum(["low", "medium", "high"]);
export const TaskSortBy = z.enum(["dueDate", "priority", "createdAt"]);

export const TaskSchema = z.object({
  id: z.uuid({ version: "v4" }),
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  status: TaskStatus,
  priority: TaskPriority,
  dueDate: z.iso.date().optional(),
  assignee: z.string().optional(),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
});

export type User = z.infer<typeof TaskSchema>;
