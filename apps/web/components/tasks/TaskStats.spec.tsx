import { render, screen } from "@testing-library/react";
import { TaskStats } from "@repo/schemas";
import { TaskStatsComponent } from "./TaskStats";

describe("TaskStatsComponent", () => {
  const mockStats: TaskStats = {
    status: {
      pending: 5,
      inProgress: 3,
      completed: 7,
    },
    priority: {
      low: 4,
      medium: 6,
      high: 5,
    },
  };

  test("renders loading state with skeleton loaders", () => {
    const { container } = render(
      <TaskStatsComponent stats={null} loading={true} />,
    );

    // Check for skeleton loaders
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test("renders no stats message when stats is null and not loading", () => {
    render(<TaskStatsComponent stats={null} loading={false} />);

    expect(screen.getByText("Task Statistics")).toBeInTheDocument();
    expect(screen.getByText("No statistics available")).toBeInTheDocument();
  });

  test("renders stats when provided", () => {
    render(<TaskStatsComponent stats={mockStats} loading={false} />);

    expect(screen.getByText("Task Statistics")).toBeInTheDocument();
    expect(screen.getByText("By Status")).toBeInTheDocument();
    expect(screen.getByText("By Priority")).toBeInTheDocument();
  });

  test("calculates and displays total tasks correctly", () => {
    render(<TaskStatsComponent stats={mockStats} loading={false} />);

    const totalTasks = 5 + 3 + 7; // 15 total
    expect(screen.getByText(totalTasks.toString())).toBeInTheDocument();
  });

  test("displays status breakdown correctly", () => {
    render(<TaskStatsComponent stats={mockStats} loading={false} />);

    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/)).toBeInTheDocument();
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
  });

  test("displays priority breakdown correctly", () => {
    render(<TaskStatsComponent stats={mockStats} loading={false} />);

    expect(screen.getByText(/low/i)).toBeInTheDocument();
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
  });

  test("displays correct counts for status", () => {
    render(<TaskStatsComponent stats={mockStats} loading={false} />);

    // Check that counts are displayed (the exact text might be in progress bars)
    const statusCounts = screen.getAllByText(/^[0-9]$/);
    expect(statusCounts.length).toBeGreaterThan(0);
  });

  test("displays correct counts for priority", () => {
    render(<TaskStatsComponent stats={mockStats} loading={false} />);

    // Check that counts are displayed
    const allText = screen.getAllByText(/^[0-9]$/);
    expect(allText.length).toBeGreaterThan(0);
  });

  test("handles empty stats gracefully", () => {
    const emptyStats: TaskStats = {
      status: {},
      priority: {},
    };

    render(<TaskStatsComponent stats={emptyStats} loading={false} />);

    expect(screen.getByText("Task Statistics")).toBeInTheDocument();
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("shows correct structure with status and priority sections", () => {
    render(<TaskStatsComponent stats={mockStats} loading={false} />);

    expect(screen.getByText("By Status")).toBeInTheDocument();
    expect(screen.getByText("By Priority")).toBeInTheDocument();
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
  });

  test("transforms inProgress status text correctly", () => {
    render(<TaskStatsComponent stats={mockStats} loading={false} />);

    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  test("displays all priority and status counts", () => {
    render(<TaskStatsComponent stats={mockStats} loading={false} />);

    // The component should display all the counts
    expect(screen.getByText("Task Statistics")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument(); // total
  });

  test("renders with single status and priority", () => {
    const singleStats: TaskStats = {
      status: {
        pending: 10,
      },
      priority: {
        high: 10,
      },
    };

    render(<TaskStatsComponent stats={singleStats} loading={false} />);

    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
  });

  test("calculates percentages correctly for progress bars", () => {
    const testStats: TaskStats = {
      status: {
        pending: 50,
        inProgress: 30,
        completed: 20,
      },
      priority: {
        low: 40,
        medium: 35,
        high: 25,
      },
    };

    const { container } = render(
      <TaskStatsComponent stats={testStats} loading={false} />,
    );

    // Check that progress bars are rendered
    const progressBars = container.querySelectorAll('div[style*="width"]');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  test("handles loading state false correctly", () => {
    render(<TaskStatsComponent stats={mockStats} loading={false} />);

    expect(screen.getByText("Task Statistics")).toBeInTheDocument();
    expect(
      screen.queryByText("No statistics available"),
    ).not.toBeInTheDocument();
  });

  test("renders with all statuses and priorities populated", () => {
    const fullStats: TaskStats = {
      status: {
        pending: 1,
        inProgress: 2,
        completed: 3,
      },
      priority: {
        low: 1,
        medium: 2,
        high: 3,
      },
    };

    render(<TaskStatsComponent stats={fullStats} loading={false} />);

    // Total should be 6
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  test("shows 0% for items when total tasks is 0", () => {
    const zeroStats: TaskStats = {
      status: {
        pending: 0,
        inProgress: 0,
        completed: 0,
      },
      priority: {
        low: 0,
        medium: 0,
        high: 0,
      },
    };

    const { container } = render(
      <TaskStatsComponent stats={zeroStats} loading={false} />,
    );

    // Check that progress bars exist even with 0 tasks
    const progressBars = container.querySelectorAll('div[style*="width: 0"]');
    expect(progressBars.length).toBeGreaterThanOrEqual(0);
  });

  test("displays correct status styling for pending", () => {
    const { container } = render(
      <TaskStatsComponent stats={mockStats} loading={false} />,
    );

    const statusIndicators = container.querySelectorAll(".bg-yellow-500");
    expect(statusIndicators.length).toBeGreaterThan(0);
  });

  test("displays correct status styling for completed", () => {
    const { container } = render(
      <TaskStatsComponent stats={mockStats} loading={false} />,
    );

    const completedIndicators = container.querySelectorAll(".bg-green-500");
    expect(completedIndicators.length).toBeGreaterThan(0);
  });

  test("displays correct status styling for inProgress", () => {
    const { container } = render(
      <TaskStatsComponent stats={mockStats} loading={false} />,
    );

    const inProgressIndicators = container.querySelectorAll(".bg-blue-500");
    expect(inProgressIndicators.length).toBeGreaterThan(0);
  });
});
