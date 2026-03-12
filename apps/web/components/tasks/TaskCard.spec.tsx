import { render, screen, fireEvent } from "@testing-library/react";
import { Task, TaskStatus, TaskPriority } from "@repo/schemas";
import { TaskCard } from "./TaskCard";

describe("TaskCard", () => {
  const mockTask: Task = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Test Task",
    description: "This is a test task description",
    status: TaskStatus.enum.pending,
    priority: TaskPriority.enum.high,
    assignee: "John Doe",
    dueDate: "2025-12-31T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  };

  const mockHandleEdit = jest.fn();
  const mockHandleDelete = jest.fn();

  beforeEach(() => {
    mockHandleEdit.mockClear();
    mockHandleDelete.mockClear();
  });

  test("renders task card with all fields", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test task description"),
    ).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
  });

  test("renders task card without description", () => {
    const taskWithoutDescription: Task = {
      ...mockTask,
      description: undefined,
    };
    render(
      <TaskCard
        task={taskWithoutDescription}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    expect(
      screen.queryByText("This is a test task description"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  test("renders task card without assignee", () => {
    const taskWithoutAssignee: Task = {
      ...mockTask,
      assignee: undefined,
    };
    render(
      <TaskCard
        task={taskWithoutAssignee}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  test("renders task card without due date", () => {
    const taskWithoutDueDate: Task = {
      ...mockTask,
      dueDate: undefined,
    };
    render(
      <TaskCard
        task={taskWithoutDueDate}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  test("calls onEdit when edit button is clicked", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    const editButton = screen.getByTitle("Edit task");
    fireEvent.click(editButton);

    expect(mockHandleEdit).toHaveBeenCalledWith(mockTask);
    expect(mockHandleEdit).toHaveBeenCalledTimes(1);
  });

  test("calls onDelete with task id when delete button is clicked", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    expect(mockHandleDelete).toHaveBeenCalledWith(mockTask.id);
    expect(mockHandleDelete).toHaveBeenCalledTimes(1);
  });

  test("renders pending status with yellow badge", () => {
    const pendingTask: Task = {
      ...mockTask,
      status: TaskStatus.enum.pending,
    };
    render(
      <TaskCard
        task={pendingTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    const statusBadge = screen.getByText("pending");
    expect(statusBadge).toHaveClass("bg-yellow-100", "text-yellow-800");
  });

  test("renders completed status with green badge", () => {
    const completedTask: Task = {
      ...mockTask,
      status: TaskStatus.enum.completed,
    };
    render(
      <TaskCard
        task={completedTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    const statusBadge = screen.getByText("completed");
    expect(statusBadge).toHaveClass("bg-green-100", "text-green-800");
  });

  test("renders inProgress status with blue badge and transformed text", () => {
    const inProgressTask: Task = {
      ...mockTask,
      status: TaskStatus.enum.inProgress,
    };
    render(
      <TaskCard
        task={inProgressTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    const statusBadge = screen.getByText("In Progress");
    expect(statusBadge).toHaveClass("bg-blue-100", "text-blue-800");
  });

  test("renders high priority with red badge", () => {
    const highPriorityTask: Task = {
      ...mockTask,
      priority: TaskPriority.enum.high,
    };
    render(
      <TaskCard
        task={highPriorityTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    const priorityBadge = screen.getByText("High Priority");
    expect(priorityBadge).toHaveClass("bg-red-100", "text-red-800");
  });

  test("renders medium priority with orange badge", () => {
    const mediumPriorityTask: Task = {
      ...mockTask,
      priority: TaskPriority.enum.medium,
    };
    render(
      <TaskCard
        task={mediumPriorityTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    const priorityBadge = screen.getByText("Medium Priority");
    expect(priorityBadge).toHaveClass("bg-orange-100", "text-orange-800");
  });

  test("renders low priority with green badge", () => {
    const lowPriorityTask: Task = {
      ...mockTask,
      priority: TaskPriority.enum.low,
    };
    render(
      <TaskCard
        task={lowPriorityTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    const priorityBadge = screen.getByText("Low Priority");
    expect(priorityBadge).toHaveClass("bg-green-100", "text-green-800");
  });

  test("displays updated date when different from created date", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    expect(screen.getByText(/Updated/)).toBeInTheDocument();
  });

  test("does not display updated date when same as created date", () => {
    const sameCreatedAndUpdatedTask = {
      ...mockTask,
      updatedAt: mockTask.createdAt,
    };
    render(
      <TaskCard
        task={sameCreatedAndUpdatedTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    expect(screen.queryByText(/Updated/)).not.toBeInTheDocument();
  });

  test("formats dates correctly", () => {
    const dueDateTask = {
      ...mockTask,
      dueDate: new Date("2025-06-15").toISOString(),
    };
    render(
      <TaskCard
        task={dueDateTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });

  test("capitalizes priority text correctly", () => {
    const lowPriorityTask = { ...mockTask, priority: TaskPriority.enum.low };
    render(
      <TaskCard
        task={lowPriorityTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    expect(screen.getByText("Low Priority")).toBeInTheDocument();
  });

  test("multiple button clicks trigger callbacks multiple times", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockHandleEdit}
        onDelete={mockHandleDelete}
      />,
    );

    const editButton = screen.getByTitle("Edit task");
    const deleteButton = screen.getByTitle("Delete task");

    fireEvent.click(editButton);
    fireEvent.click(editButton);
    fireEvent.click(deleteButton);

    expect(mockHandleEdit).toHaveBeenCalledTimes(2);
    expect(mockHandleDelete).toHaveBeenCalledTimes(1);
  });
});
