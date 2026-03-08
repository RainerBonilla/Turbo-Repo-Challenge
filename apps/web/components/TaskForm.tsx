import { useState, useEffect } from "react";
import { z } from "zod";
import { Task, TaskPriority, TaskStatus } from "@repo/schemas";
import {
  CreateTaskData,
  UpdateTaskData,
  TaskStatusType,
  TaskPriorityType,
} from "@/lib/api";
import { InlineLoading } from "./InlineLoading";
import { useToast } from "./ToastProvider";

// Validation schemas
const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  status: TaskStatus,
  priority: TaskPriority,
  dueDate: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      const date = new Date(val);
      return !isNaN(date.getTime()) && date >= new Date();
    }, "Due date must be a valid date in the future"),
  assignee: z.string().optional().or(z.literal("")),
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .or(z.literal(null)),
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
  dueDate: z
    .string()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val || val === "") return true;
      const date = new Date(val);
      return !isNaN(date.getTime()) && date >= new Date();
    }, "Due date must be a valid date in the future"),
  assignee: z
    .string()
    .optional()
    .nullable()
    .or(z.literal(""))
    .or(z.literal(null)),
});

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  title: string;
  description: string;
  status: TaskStatusType;
  priority: TaskPriorityType;
  dueDate?: string; // Use empty string instead of undefined for controlled inputs
  assignee: string; // Use empty string instead of undefined for controlled inputs
}

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  loading = false,
}: TaskFormProps) {
  const { showError } = useToast();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    status: "pending" as TaskStatusType,
    priority: "medium" as TaskPriorityType,
    dueDate: "", // Use empty string for controlled input
    assignee: "", // Use empty string for controlled input
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        assignee: task.assignee || "",
      });
    } else {
      // Reset form for new task creation
      setFormData({
        title: "",
        description: "",
        status: "pending" as TaskStatusType,
        priority: "medium" as TaskPriorityType,
        dueDate: "",
        assignee: "",
      });
    }
  }, [task]);

  const validateForm = () => {
    try {
      const schema = task ? updateTaskSchema : createTaskSchema;
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Helper function to clean submit data by removing empty/null/undefined values
      const cleanSubmitData = (data: Record<string, any>) => {
        const cleaned: Record<string, any> = {};
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            cleaned[key] = value;
          }
        });
        return cleaned;
      };

      const rawSubmitData = task
        ? {
            title: formData.title,
            description: formData.description,
            status: formData.status,
            priority: formData.priority,
            dueDate: formData.dueDate,
            assignee: formData.assignee,
          }
        : {
            title: formData.title,
            description: formData.description,
            status: formData.status,
            priority: formData.priority,
            dueDate: formData.dueDate,
            assignee: formData.assignee,
          };

      const submitData = cleanSubmitData(rawSubmitData);

      await onSubmit(submitData as CreateTaskData | UpdateTaskData);
    } catch (error) {
      console.error("Form submission error:", error);
      showError(error);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    // Validate individual field on blur
    try {
      const schema = task ? updateTaskSchema : createTaskSchema;
      const fieldSchema = schema.shape[field as keyof typeof schema.shape];
      if (fieldSchema) {
        fieldSchema.parse(formData[field]);
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    } catch (error) {
      if (error instanceof z.ZodError && error.issues) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.issues[0]?.message || "Invalid value",
        }));
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
        {task ? "Edit Task" : "Create New Task"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            onBlur={() => handleBlur("title")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter task description (optional)"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              onBlur={() => handleBlur("status")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="pending">Pending</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority *
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              onBlur={() => handleBlur("priority")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.priority ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              onBlur={() => handleBlur("dueDate")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dueDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="assignee"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Assignee
            </label>
            <input
              type="text"
              id="assignee"
              value={formData.assignee}
              onChange={(e) => handleChange("assignee", e.target.value)}
              onBlur={() => handleBlur("assignee")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter assignee name"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 sm:pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-sm sm:text-base disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              <span>{task ? "Update Task" : "Create Task"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
