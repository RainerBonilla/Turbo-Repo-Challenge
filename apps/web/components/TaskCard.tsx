import { Task } from "@repo/schemas";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "inProgress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 flex-1 pr-2">
          {task.title}
        </h3>
        <div className="flex gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 p-1.5 sm:p-1 rounded-md hover:bg-blue-50 transition-colors"
            title="Edit task"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 p-1.5 sm:p-1 rounded-md hover:bg-red-50 transition-colors"
            title="Delete task"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
        >
          {task.status.replace("inProgress", "In Progress")}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{" "}
          Priority
        </span>
      </div>

      <div className="flex justify-between items-end text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {task.assignee && (
            <span className="font-medium text-gray-700 truncate">
              {task.assignee}
            </span>
          )}
          {task.dueDate && (
            <span className="text-black font-medium">
              Due: {formatDate(task.dueDate)}
            </span>
          )}
        </div>
        <div className="text-right shrink-0 ml-2">
          <div className="text-gray-400">Created</div>
          <div className="font-medium">{formatDate(task.createdAt)}</div>
          {task.updatedAt !== task.createdAt && (
            <div className="text-gray-400 text-xs mt-0.5">
              Updated {formatDate(task.updatedAt)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
