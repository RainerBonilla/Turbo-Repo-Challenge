import { z } from "zod";
import {
  Task,
  TaskStats,
  TaskStatus,
  TaskPriority,
  TaskSortBy,
} from "@repo/schemas";

export type TaskStatusType = z.infer<typeof TaskStatus>;
export type TaskPriorityType = z.infer<typeof TaskPriority>;
export type TaskSortByType = z.infer<typeof TaskSortBy>;

export interface CreateTaskData {
  title: string;
  description?: string;
  status: TaskStatusType;
  priority: TaskPriorityType;
  dueDate?: string;
  assignee?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  status?: TaskStatusType;
  priority?: TaskPriorityType;
  dueDate?: string | null;
  assignee?: string | null;
}

export interface TaskFilters {
  status?: TaskStatusType;
  priority?: TaskPriorityType;
  assignee?: string;
  sortBy?: TaskSortByType;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api`;

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Task CRUD operations
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.assignee) params.append("assignee", filters.assignee);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);

    const queryString = params.toString();
    const endpoint = `/tasks${queryString ? `?${queryString}` : ""}`;

    return this.request<Task[]>(endpoint);
  }

  async getTask(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: "DELETE",
    });
  }

  // Statistics
  async getTaskStats(): Promise<TaskStats> {
    return this.request<TaskStats>("/tasks/stats");
  }
}

export const apiClient = new ApiClient();
