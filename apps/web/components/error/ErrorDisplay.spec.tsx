import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorDisplay } from "./ErrorDisplay";
import { AppError } from "./errorHandler";

describe("ErrorDisplay", () => {
  const mockError: AppError = {
    type: "server",
    message: "Something went wrong",
  };

  it("renders error message", () => {
    render(<ErrorDisplay error={mockError} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("displays error title based on type", () => {
    render(<ErrorDisplay error={mockError} />);
    expect(screen.getByText("Server Error")).toBeInTheDocument();
  });

  it('shows "Connection Error" for network type', () => {
    const networkError: AppError = { ...mockError, type: "network" };
    render(<ErrorDisplay error={networkError} />);
    expect(screen.getByText("Connection Error")).toBeInTheDocument();
  });

  it('shows "Validation Error" for validation type', () => {
    const validationError: AppError = { ...mockError, type: "validation" };
    render(<ErrorDisplay error={validationError} />);
    expect(screen.getByText("Validation Error")).toBeInTheDocument();
  });

  it("renders details when provided", () => {
    const errorWithDetails: AppError = {
      ...mockError,
      details: "Database connection failed",
    };
    render(<ErrorDisplay error={errorWithDetails} />);
    expect(screen.getByText("Show details")).toBeInTheDocument();
  });

  it("does not render retry button when not retryable", () => {
    const nonRetryableError: AppError = {
      ...mockError,
      retryable: false,
    };
    render(<ErrorDisplay error={nonRetryableError} />);
    expect(screen.queryByText("Try again")).not.toBeInTheDocument();
  });

  it("renders retry button when retryable and onRetry provided", () => {
    const retryableError: AppError = {
      ...mockError,
      retryable: true,
    };
    render(<ErrorDisplay error={retryableError} onRetry={() => {}} />);
    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("calls onRetry when retry button clicked", () => {
    const mockRetry = jest.fn();
    const retryableError: AppError = {
      ...mockError,
      retryable: true,
    };
    render(<ErrorDisplay error={retryableError} onRetry={mockRetry} />);
    fireEvent.click(screen.getByText("Try again"));
    expect(mockRetry).toHaveBeenCalled();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ErrorDisplay error={mockError} className="custom-class" />,
    );
    const div = container.firstChild;
    expect(div).toHaveClass("custom-class");
  });
});
