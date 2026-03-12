import { render, screen, fireEvent } from "@testing-library/react";
import { TaskFilters } from "./TaskFilters";
import { TaskFilters as TaskFiltersType } from "@/lib/api";

describe("TaskFilters", () => {
  const mockOnFiltersChange = jest.fn();

  beforeEach(() => {
    mockOnFiltersChange.mockClear();
  });

  test("renders all filter fields", () => {
    const filters: TaskFiltersType = {};
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Priority")).toBeInTheDocument();
    expect(screen.getByLabelText("Assignee")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort By")).toBeInTheDocument();
  });

  test("does not show clear filters button when no filters active", () => {
    const filters: TaskFiltersType = {};
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    expect(
      screen.queryByRole("button", { name: /clear all filters/i }),
    ).not.toBeInTheDocument();
  });

  test("shows clear filters button when filters are active", () => {
    const filters: TaskFiltersType = { status: "pending" };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    expect(
      screen.getByRole("button", { name: /clear all filters/i }),
    ).toBeInTheDocument();
  });

  test("calls onFiltersChange when status filter changes", () => {
    const filters: TaskFiltersType = {};
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const statusSelect = screen.getByLabelText("Status");
    fireEvent.change(statusSelect, { target: { value: "pending" } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      status: "pending",
    });
  });

  test("calls onFiltersChange when priority filter changes", () => {
    const filters: TaskFiltersType = {};
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const prioritySelect = screen.getByLabelText("Priority");
    fireEvent.change(prioritySelect, { target: { value: "high" } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      priority: "high",
    });
  });

  test("calls onFiltersChange when assignee filter changes", () => {
    const filters: TaskFiltersType = {};
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const assigneeInput = screen.getByPlaceholderText("Filter by assignee");
    fireEvent.change(assigneeInput, { target: { value: "John Doe" } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      assignee: "John Doe",
    });
  });

  test("calls onFiltersChange when sortBy filter changes", () => {
    const filters: TaskFiltersType = {};
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const sortSelect = screen.getByLabelText("Sort By");
    fireEvent.change(sortSelect, { target: { value: "dueDate" } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      sortBy: "dueDate",
    });
  });

  test("removes filter when set to empty string", () => {
    const filters: TaskFiltersType = { status: "pending", priority: "high" };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const statusSelect = screen.getByLabelText("Status");
    fireEvent.change(statusSelect, { target: { value: "" } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      priority: "high",
    });
  });

  test("clears all filters when clear button is clicked", () => {
    const filters: TaskFiltersType = {
      status: "pending",
      priority: "high",
      assignee: "John",
      sortBy: "dueDate",
    };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const clearButton = screen.getByRole("button", {
      name: /clear all filters/i,
    });
    fireEvent.click(clearButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({});
  });

  test("displays active status filter badge", () => {
    const filters: TaskFiltersType = { status: "pending" };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    expect(screen.getByText(/Status: pending/)).toBeInTheDocument();
  });

  test("displays active priority filter badge", () => {
    const filters: TaskFiltersType = { priority: "high" };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    expect(screen.getByText(/Priority: high/)).toBeInTheDocument();
  });

  test("displays active assignee filter badge", () => {
    const filters: TaskFiltersType = { assignee: "John Doe" };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    expect(screen.getByText(/Assignee: John Doe/)).toBeInTheDocument();
  });

  test("displays active sortBy filter badge", () => {
    const filters: TaskFiltersType = { sortBy: "dueDate" };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    expect(screen.getByText(/Sort: dueDate/)).toBeInTheDocument();
  });

  test("removes filter when badge remove button is clicked", () => {
    const filters: TaskFiltersType = { status: "pending", priority: "high" };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const removeButtons = screen.getAllByText("×");
    fireEvent.click(removeButtons[0]!); // Remove status filter

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      priority: "high",
    });
  });

  test("maintains other filters when adding new one", () => {
    const filters: TaskFiltersType = { status: "pending" };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const prioritySelect = screen.getByLabelText("Priority");
    fireEvent.change(prioritySelect, { target: { value: "high" } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      status: "pending",
      priority: "high",
    });
  });

  test("displays all active filters together", () => {
    const filters: TaskFiltersType = {
      status: "inProgress",
      priority: "medium",
      assignee: "Jane",
      sortBy: "priority",
    };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    expect(screen.getByText(/Status: inProgress/)).toBeInTheDocument();
    expect(screen.getByText(/Priority: medium/)).toBeInTheDocument();
    expect(screen.getByText(/Assignee: Jane/)).toBeInTheDocument();
    expect(screen.getByText(/Sort: priority/)).toBeInTheDocument();
  });

  test("status select shows correct active value", () => {
    const filters: TaskFiltersType = { status: "completed" };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const statusSelect = screen.getByLabelText("Status") as HTMLSelectElement;
    expect(statusSelect.value).toBe("completed");
  });

  test("priority select shows correct active value", () => {
    const filters: TaskFiltersType = { priority: "low" };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const prioritySelect = screen.getByLabelText(
      "Priority",
    ) as HTMLSelectElement;
    expect(prioritySelect.value).toBe("low");
  });

  test("assignee input shows correct active value", () => {
    const filters: TaskFiltersType = { assignee: "Alice" };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const assigneeInput = screen.getByPlaceholderText(
      "Filter by assignee",
    ) as HTMLInputElement;
    expect(assigneeInput.value).toBe("Alice");
  });

  test("sortBy select shows correct active value", () => {
    const filters: TaskFiltersType = { sortBy: "createdAt" };
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const sortSelect = screen.getByLabelText("Sort By") as HTMLSelectElement;
    expect(sortSelect.value).toBe("createdAt");
  });

  test("handles multiple filter changes sequentially", () => {
    const filters: TaskFiltersType = {};
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    const statusSelect = screen.getByLabelText("Status");
    const prioritySelect = screen.getByLabelText("Priority");

    fireEvent.change(statusSelect, { target: { value: "pending" } });
    fireEvent.change(prioritySelect, { target: { value: "high" } });

    expect(mockOnFiltersChange).toHaveBeenCalledTimes(2);
  });

  test("filters title is displayed", () => {
    const filters: TaskFiltersType = {};
    render(
      <TaskFilters filters={filters} onFiltersChange={mockOnFiltersChange} />,
    );

    expect(screen.getByText("Filters & Sorting")).toBeInTheDocument();
  });
});
