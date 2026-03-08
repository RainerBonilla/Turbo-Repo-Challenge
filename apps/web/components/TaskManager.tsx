"use client";

import { useState } from "react";
import { Task } from "@repo/schemas";
import { useTasks, useTaskStats } from "@/lib/hooks/useTasks";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { TaskFilters as TaskFiltersComponent } from "./TaskFilters";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { SkeletonLoader } from "./SkeletonLoader";
import { SearchLoading } from "./SearchLoading";
import { TaskFilters } from "@/lib/api";
import { TaskStatsComponent } from "./TaskStats";
import { LoadingSpinner } from "./LoadingSpinner";
import { useToast } from "./ToastProvider";
import { ErrorHandler } from "@/lib/errorHandler";
import { ErrorDisplay } from "./ErrorDisplay";

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
  const {
    stats,
    loading: statsLoading,
    refetch: refetchStats,
  } = useTaskStats();

  const { showSuccess, showError } = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
      await refetchStats();
      setViewMode("list");
      showSuccess("Task created successfully!");
    } catch (error) {
      showError(error, {
        label: "Try Again",
        onClick: () => handleCreateTask(data),
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;

    setFormLoading(true);
    try {
      await updateTask(editingTask.id, data);
      await refetchStats();
      setViewMode("list");
      setEditingTask(null);
      showSuccess("Task updated successfully!");
    } catch (error) {
      showError(error, {
        label: "Try Again",
        onClick: () => handleUpdateTask(data),
      });
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

    setFormLoading(true);
    try {
      await deleteTask(deleteDialog.task.id);
      await refetchStats();
      setDeleteDialog({ isOpen: false, task: null });
      showSuccess("Task deleted successfully!");
    } catch (error) {
      showError(error, {
        label: "Try Again",
        onClick: confirmDeleteTask,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleFiltersChange = async (newFilters: TaskFilters) => {
    setFilters(newFilters);

    // Set searching state based on active filters
    const hasFilters = Object.keys(newFilters).length > 0;
    if (hasFilters) {
      setIsSearching(true);
      // Create a readable query string
      const queryParts = [];
      if (newFilters.status) queryParts.push(`status: ${newFilters.status}`);
      if (newFilters.priority)
        queryParts.push(`priority: ${newFilters.priority}`);
      if (newFilters.assignee)
        queryParts.push(`assignee: ${newFilters.assignee}`);
      if (newFilters.sortBy) queryParts.push(`sorted by: ${newFilters.sortBy}`);
      setSearchQuery(queryParts.join(", "));

      // Await the fetch and then turn off loading
      await fetchTasks(newFilters);
      setIsSearching(false);
    } else {
      setIsSearching(false);
      setSearchQuery("");
      await fetchTasks(newFilters);
    }
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

            <SearchLoading isLoading={isSearching} query={searchQuery} />

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
              <ErrorDisplay
                error={tasksError}
                onRetry={() => fetchTasks(filters)}
                className="mb-4 sm:mb-6"
              />
            )}

            {tasksLoading ? (
              <SkeletonLoader
                count={6}
                type="card"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              />
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

        {tasksLoading && statsLoading && viewMode === "list" ? (
          <LoadingSpinner message="Loading your task dashboard..." />
        ) : (
          renderContent()
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        taskTitle={deleteDialog.task?.title || ""}
        onConfirm={confirmDeleteTask}
        onCancel={() => setDeleteDialog({ isOpen: false, task: null })}
        loading={formLoading}
      />
    </div>
  );
}
