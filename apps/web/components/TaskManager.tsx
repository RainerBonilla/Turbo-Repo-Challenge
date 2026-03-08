"use client";

import { useState } from "react";
import { Task } from "@repo/schemas";
import { useTasks, useTaskStats } from "@/lib/hooks/useTasks";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { TaskFilters as TaskFiltersComponent } from "./TaskFilters";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { TaskFilters } from "@/lib/api";
import { TaskStatsComponent } from "./TaskStats";

type ViewMode = "list" | "create" | "edit";

export function TaskManager() {
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
  } = useTasks();
  const { stats, loading: statsLoading } = useTaskStats();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    task: Task | null;
  }>({
    isOpen: false,
    task: null,
  });
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateTask = async (data: any) => {
    setFormLoading(true);
    try {
      await createTask(data);
      setViewMode("list");
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Failed to create task. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;

    setFormLoading(true);
    try {
      await updateTask(editingTask.id, data);
      setViewMode("list");
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setViewMode("edit");
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setDeleteDialog({ isOpen: true, task });
    }
  };

  const confirmDeleteTask = async () => {
    if (!deleteDialog.task) return;

    try {
      await deleteTask(deleteDialog.task.id);
      setDeleteDialog({ isOpen: false, task: null });
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    fetchTasks(newFilters);
  };

  const renderContent = () => {
    switch (viewMode) {
      case "create":
        return (
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setViewMode("list")}
            loading={formLoading}
          />
        );

      case "edit":
        return (
          <TaskForm
            task={editingTask || undefined}
            onSubmit={handleUpdateTask}
            onCancel={() => {
              setViewMode("list");
              setEditingTask(null);
            }}
            loading={formLoading}
          />
        );

      default:
        return (
          <div>
            <TaskStatsComponent stats={stats} loading={statsLoading} />

            <TaskFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Tasks ({tasks.length})
              </h2>
              <button
                onClick={() => setViewMode("create")}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Task
              </button>
            </div>

            {tasksError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 sm:mb-6">
                <div className="flex">
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                      Error loading tasks
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {tasksError}
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => fetchTasks(filters)}
                        className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tasksLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-3 sm:mb-4"></div>
                    <div className="flex gap-2 mb-3 sm:mb-4">
                      <div className="h-5 sm:h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-5 sm:h-6 bg-gray-200 rounded-full w-20"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <svg
                  className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-base sm:text-sm font-medium text-gray-900">
                  No tasks found
                </h3>
                <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                  {Object.keys(filters).length > 0
                    ? "Try adjusting your filters or create a new task."
                    : "Get started by creating your first task."}
                </p>
                <div className="mt-4 sm:mt-6">
                  <button
                    onClick={() => setViewMode("create")}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Task
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Task Management System
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            Manage your tasks with filtering, sorting, and statistics
          </p>
        </div>

        {renderContent()}
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        taskTitle={deleteDialog.task?.title || ""}
        onConfirm={confirmDeleteTask}
        onCancel={() => setDeleteDialog({ isOpen: false, task: null })}
      />
    </div>
  );
}
