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

export const TaskStatsSchema = z.object({
  status: z.record(z.string(), z.number().int().min(0)),
  priority: z.record(z.string(), z.number().int().min(0)),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskStats = z.infer<typeof TaskStatsSchema>;
