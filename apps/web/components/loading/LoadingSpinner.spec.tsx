import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default message", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders with custom message", () => {
    render(<LoadingSpinner message="Please wait..." />);
    expect(screen.getByText("Please wait...")).toBeInTheDocument();
  });

  it("renders without message when explicitly set to empty", () => {
    render(<LoadingSpinner message="" />);
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("applies correct size classes", () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toHaveClass("w-16", "h-16");
  });

  it("applies small size classes", () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toHaveClass("w-6", "h-6");
  });

  it("applies min-h-screen when fullHeight is true", () => {
    const { container } = render(<LoadingSpinner fullHeight={true} />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass("min-h-screen");
  });

  it("does not apply min-h-screen when fullHeight is false", () => {
    const { container } = render(<LoadingSpinner fullHeight={false} />);
    const div = container.firstChild as HTMLElement;
    expect(div).not.toHaveClass("min-h-screen");
  });
});
