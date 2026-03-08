import { useState, useEffect, useCallback } from "react";
import { Task, TaskStats } from "@repo/schemas";
import { TaskFilters, CreateTaskData, UpdateTaskData } from "../api";
import { ErrorHandler, AppError } from "../errorHandler";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    setLoading(true);
    setError(null);
    try {
      const { apiClient } = await import("../api");
      const data = await apiClient.getTasks(filters);
      setTasks(data);
    } catch (err) {
      const appError = ErrorHandler.parseError(err);
      setError(appError);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: CreateTaskData) => {
    try {
      const { apiClient } = await import("../api");
      const newTask = await apiClient.createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      const appError = ErrorHandler.parseError(err);
      throw appError;
    }
  }, []);

  const updateTask = useCallback(async (id: string, data: UpdateTaskData) => {
    try {
      const { apiClient } = await import("../api");
      const updatedTask = await apiClient.updateTask(id, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task)),
      );
      return updatedTask;
    } catch (err) {
      const appError = ErrorHandler.parseError(err);
      throw appError;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const { apiClient } = await import("../api");
      await apiClient.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      const appError = ErrorHandler.parseError(err);
      throw appError;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}

export function useTaskStats() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { apiClient } = await import("../api");
      const data = await apiClient.getTaskStats();
      setStats(data);
    } catch (err) {
      const appError = ErrorHandler.parseError(err);
      setError(appError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
