import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  TaskSchema,
  TaskStatus,
  TaskPriority,
  TaskSortBy,
  TaskStatsSchema,
} from '@repo/schemas';
import { z } from 'zod';
import { Prisma } from 'generated/prisma/client';

const CreateTaskDto = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
const UpdateTaskDto = TaskSchema.partial().omit({ id: true, createdAt: true });

@Injectable()
export class TasksService {
  constructor(private readonly database: DatabaseService) {}

  async create(data: Prisma.TaskCreateInput) {
    const validatedData = CreateTaskDto.parse(data);
    return this.database.task.create({
      data: {
        ...validatedData,
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findAll(query: {
    status?: z.infer<typeof TaskStatus>;
    priority?: z.infer<typeof TaskPriority>;
    assignee?: string;
    sortBy?: z.infer<typeof TaskSortBy>;
  }) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.assignee) where.assignee = query.assignee;

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = 'asc';
    }

    return this.database.task.findMany({ where, orderBy });
  }

  async findOne(id: string) {
    return this.database.task.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.TaskUpdateInput) {
    const validatedData = UpdateTaskDto.parse(data);
    return this.database.task.update({
      where: { id },
      data: {
        ...validatedData,
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : validatedData.dueDate,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    return this.database.task.delete({ where: { id } });
  }

  async getStats() {
    // perform a single database call grouping by both status and priority
    const combined = await this.database.task.groupBy({
      by: ['status', 'priority'],
      _count: { _all: true },
    });

    const result: {
      status: Record<string, number>;
      priority: Record<string, number>;
    } = {
      status: {},
      priority: {},
    };

    for (const row of combined) {
      const cnt = row._count._all;
      if (row.status) {
        result.status[row.status] = (result.status[row.status] || 0) + cnt;
      }
      if (row.priority) {
        result.priority[row.priority] =
          (result.priority[row.priority] || 0) + cnt;
      }
    }

    return TaskStatsSchema.parse(result);
  }
}
