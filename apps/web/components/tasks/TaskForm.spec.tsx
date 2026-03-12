import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Task } from "@repo/schemas";
import { TaskForm } from "./TaskForm";
import React from "react";
import { ToastProvider } from "../toast";

describe("TaskForm", () => {
  const mockTask: Task = {
    id: "1",
    title: "Existing Task",
    description: "Existing description",
    status: "inProgress",
    priority: "high",
    assignee: "John Doe",
    dueDate: new Date("2025-12-31").toISOString(),
    createdAt: new Date("2025-01-01").toISOString(),
    updatedAt: new Date("2025-01-15").toISOString(),
  };

  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
    jest.clearAllMocks();
  });

  const renderWithToast = (element: React.ReactElement) => {
    return render(<ToastProvider>{element}</ToastProvider>);
  };

  test("renders create form when no task provided", () => {
    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    expect(screen.getByText("Create New Task")).toBeInTheDocument();
    const titleInput = screen.getByPlaceholderText("Enter task title");
    expect(titleInput).toBeInTheDocument();
  });

  test("renders edit form when task provided", () => {
    renderWithToast(
      <TaskForm
        task={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText("Edit Task")).toBeInTheDocument();
  });

  test("pre-fills form fields with task data", () => {
    renderWithToast(
      <TaskForm
        task={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByDisplayValue("Existing Task")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Existing description"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
  });

  test("updates form state on input change", () => {
    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const titleInput = screen.getByPlaceholderText("Enter task title");
    fireEvent.change(titleInput, { target: { value: "New Task" } });

    expect(titleInput).toHaveValue("New Task");
  });

  test("calls onCancel when cancel button is clicked", () => {
    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test("shows validation error for title too short", async () => {
    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const titleInput = screen.getByPlaceholderText("Enter task title");
    fireEvent.change(titleInput, { target: { value: "ab" } });

    const submitButton = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Title must be at least 3 characters/),
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("shows validation error for title too long", async () => {
    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const titleInput = screen.getByPlaceholderText("Enter task title");
    const longTitle = "a".repeat(101);
    fireEvent.change(titleInput, { target: { value: longTitle } });

    const submitButton = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Title must be less than 100 characters/),
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("shows validation error for description too long", async () => {
    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const descriptionInput = screen.getByPlaceholderText(
      "Enter task description (optional)",
    );
    const longDescription = "a".repeat(501);
    fireEvent.change(descriptionInput, { target: { value: longDescription } });

    const submitButton = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Description must be less than 500 characters/),
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("shows validation error for past due date", async () => {
    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const dueDateInput = screen.getByLabelText("Due Date");
    const pastDate = "2020-01-01";
    fireEvent.change(dueDateInput, { target: { value: pastDate } });

    const submitButton = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Due date must be a valid date in the future"),
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("submits form with valid data for new task", async () => {
    mockOnSubmit.mockResolvedValueOnce(void 0);

    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const titleInput = screen.getByPlaceholderText("Enter task title");
    const statusSelect = screen.getByLabelText("Status *");
    const prioritySelect = screen.getByLabelText("Priority *");

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(statusSelect, { target: { value: "pending" } });
    fireEvent.change(prioritySelect, { target: { value: "high" } });

    const submitButton = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    const submitData = mockOnSubmit.mock.calls[0][0];
    expect(submitData.title).toBe("New Task");
    expect(submitData.status).toBe("pending");
    expect(submitData.priority).toBe("high");
  });

  test("clears error message when field is changed", async () => {
    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const titleInput = screen.getByPlaceholderText("Enter task title");
    fireEvent.change(titleInput, { target: { value: "ab" } });

    const submitButton = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Title must be at least 3 characters/),
      ).toBeInTheDocument();
    });

    fireEvent.change(titleInput, { target: { value: "Valid Title" } });

    expect(
      screen.queryByText(/Title must be at least 3 characters/),
    ).not.toBeInTheDocument();
  });

  test("disables buttons while loading", () => {
    renderWithToast(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={true}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /saving/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  test("shows loading state in submit button", () => {
    renderWithToast(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={true}
      />,
    );

    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  test("removes empty fields before submission", async () => {
    mockOnSubmit.mockResolvedValueOnce(void 0);

    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const titleInput = screen.getByPlaceholderText("Enter task title");
    fireEvent.change(titleInput, {
      target: { value: "Task with empty fields" },
    });

    const submitButton = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    const submitData = mockOnSubmit.mock.calls[0][0];
    expect(submitData.description).toBeUndefined();
    expect(submitData.dueDate).toBeUndefined();
    expect(submitData.assignee).toBeUndefined();
  });

  test("submits form with all fields when populated for new task", async () => {
    mockOnSubmit.mockResolvedValueOnce(void 0);

    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const titleInput = screen.getByPlaceholderText("Enter task title");
    const descriptionInput = screen.getByPlaceholderText(
      "Enter task description (optional)",
    );
    const assigneeInput = screen.getByPlaceholderText("Enter assignee name");
    const statusSelect = screen.getByLabelText("Status *");
    const prioritySelect = screen.getByLabelText("Priority *");
    const dueDateInput = screen.getByLabelText("Due Date");

    fireEvent.change(titleInput, { target: { value: "Complete Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Task description" },
    });
    fireEvent.change(assigneeInput, { target: { value: "Assignee Name" } });
    fireEvent.change(statusSelect, { target: { value: "inProgress" } });
    fireEvent.change(prioritySelect, { target: { value: "medium" } });
    // choose a date well into the future so validation always passes
    fireEvent.change(dueDateInput, { target: { value: "2030-01-01" } });

    const submitButton = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    const submitData = mockOnSubmit.mock.calls[0][0];
    expect(submitData.title).toBe("Complete Task");
    expect(submitData.description).toBe("Task description");
    expect(submitData.assignee).toBe("Assignee Name");
    expect(submitData.status).toBe("inProgress");
    expect(submitData.priority).toBe("medium");
  });

  test("handles submission error gracefully", async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error("Submission failed"));

    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const titleInput = screen.getByPlaceholderText("Enter task title");
    fireEvent.change(titleInput, { target: { value: "New Task" } });

    const submitButton = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  test("validates field on blur", async () => {
    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const titleInput = screen.getByPlaceholderText("Enter task title");
    fireEvent.change(titleInput, { target: { value: "ab" } });
    fireEvent.blur(titleInput);

    await waitFor(() => {
      expect(
        screen.getByText(/Title must be at least 3 characters/),
      ).toBeInTheDocument();
    });
  });

  test("shows correct button text for edit form", () => {
    renderWithToast(
      <TaskForm
        task={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    expect(
      screen.getByRole("button", { name: /update task/i }),
    ).toBeInTheDocument();
  });

  test("clears form when task prop changes from task to no task", () => {
    const { unmount } = renderWithToast(
      <TaskForm
        task={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByDisplayValue("Existing Task")).toBeInTheDocument();

    // Unmount and remount with no task
    unmount();

    renderWithToast(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const titleInput = screen.getByPlaceholderText(
      "Enter task title",
    ) as HTMLInputElement;
    expect(titleInput.value).toBe("");
  });
});
