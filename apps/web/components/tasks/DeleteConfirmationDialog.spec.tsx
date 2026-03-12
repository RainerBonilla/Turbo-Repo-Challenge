import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

describe("DeleteConfirmationDialog", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnConfirm.mockClear();
    mockOnCancel.mockClear();
  });

  test("does not render when isOpen is false", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={false}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.queryByText("Delete Task")).not.toBeInTheDocument();
  });

  test("renders dialog when isOpen is true", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByRole("heading")).toHaveTextContent("Delete Task");
  });

  test("displays task title in confirmation message", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="My Urgent Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText(/My Urgent Task/)).toBeInTheDocument();
  });

  test("shows confirmation message", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    expect(
      screen.getByText(/Are you sure you want to delete the task/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This action cannot be undone/),
    ).toBeInTheDocument();
  });

  test("calls onConfirm when delete button is clicked", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /delete task/i });
    fireEvent.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test("calls onCancel when cancel button is clicked", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test("disables buttons when loading is true", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={true}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /deleting/i });
    const cancelButton = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent === "Cancel");

    expect(deleteButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  test("shows loading text when loading is true", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={true}
      />,
    );

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });

  test("shows delete task text when loading is false", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /delete task/i });
    expect(deleteButton).toBeInTheDocument();
  });

  test("renders warning icon", () => {
    const { container } = render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    const warningIcon = container.querySelector("svg");
    expect(warningIcon).toBeInTheDocument();
  });

  test("renders overlay with correct styling", () => {
    const { container } = render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    const overlay = container.querySelector(".bg-black.bg-opacity-50");
    expect(overlay).toBeInTheDocument();
  });

  test("renders modal with correct structure", () => {
    const { container } = render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    const modal = container.querySelector(".bg-white.rounded-lg");
    expect(modal).toBeInTheDocument();
  });

  test("task title is displayed with proper formatting", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Complete Project Report"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    const titleElement = screen.getByText(/"Complete Project Report"/);
    expect(titleElement).toBeInTheDocument();
  });

  test("multiple button clicks trigger callbacks multiple times", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /delete task/i });
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(2);
  });

  test("renders with default loading prop as false", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle="Test Task"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /delete task/i });
    expect(deleteButton).not.toBeDisabled();
  });

  test("handles empty task title gracefully", () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        taskTitle=""
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText('""')).toBeInTheDocument();
  });
});
