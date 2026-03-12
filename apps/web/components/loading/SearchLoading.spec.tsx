import { render, screen } from "@testing-library/react";
import { SearchLoading } from "./SearchLoading";

describe("SearchLoading", () => {
  test("does not render when isLoading is false", () => {
    render(<SearchLoading isLoading={false} query="test query" />);

    expect(screen.queryByText(/Searching for tasks/)).not.toBeInTheDocument();
  });

  test("renders when isLoading is true", () => {
    render(<SearchLoading isLoading={true} query="test query" />);

    expect(screen.getByText(/Searching for tasks/)).toBeInTheDocument();
  });

  test("displays the query in the loading message", () => {
    render(<SearchLoading isLoading={true} query="John Doe" />);

    expect(
      screen.getByText(/Searching for tasks with "John Doe"/),
    ).toBeInTheDocument();
  });

  test("shows spinner animation when loading", () => {
    const { container } = render(
      <SearchLoading isLoading={true} query="test" />,
    );

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  test("renders with blue styling", () => {
    const { container } = render(
      <SearchLoading isLoading={true} query="test" />,
    );

    const wrapper = container.querySelector(".bg-blue-50");
    expect(wrapper).toBeInTheDocument();
  });

  test("handles empty query string", () => {
    render(<SearchLoading isLoading={true} query="" />);

    expect(screen.getByText(/Searching for tasks with ""/)).toBeInTheDocument();
  });

  test("handles long query strings", () => {
    const longQuery = "This is a very long search query with multiple words";
    render(<SearchLoading isLoading={true} query={longQuery} />);

    expect(
      screen.getByText(
        new RegExp(
          `Searching for tasks with "${longQuery.replace(/"/g, '"')}"`,
        ),
      ),
    ).toBeInTheDocument();
  });

  test("updates content when query prop changes", () => {
    const { rerender } = render(
      <SearchLoading isLoading={true} query="first query" />,
    );

    expect(
      screen.getByText(/Searching for tasks with "first query"/),
    ).toBeInTheDocument();

    rerender(<SearchLoading isLoading={true} query="second query" />);

    expect(
      screen.getByText(/Searching for tasks with "second query"/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Searching for tasks with "first query"/),
    ).not.toBeInTheDocument();
  });

  test("hides when isLoading changes from true to false", () => {
    const { rerender } = render(
      <SearchLoading isLoading={true} query="test" />,
    );

    expect(screen.getByText(/Searching for tasks/)).toBeInTheDocument();

    rerender(<SearchLoading isLoading={false} query="test" />);

    expect(screen.queryByText(/Searching for tasks/)).not.toBeInTheDocument();
  });

  test("shows when isLoading changes from false to true", () => {
    const { rerender } = render(
      <SearchLoading isLoading={false} query="test" />,
    );

    expect(screen.queryByText(/Searching for tasks/)).not.toBeInTheDocument();

    rerender(<SearchLoading isLoading={true} query="test" />);

    expect(screen.getByText(/Searching for tasks/)).toBeInTheDocument();
  });

  test("renders spinner with correct border classes", () => {
    const { container } = render(
      <SearchLoading isLoading={true} query="test" />,
    );

    const spinner = container.querySelector(
      ".rounded-full.border-2.border-blue-200",
    );
    expect(spinner).toBeInTheDocument();
  });

  test("has accessible structure", () => {
    const { container } = render(
      <SearchLoading isLoading={true} query="test" />,
    );

    const text = screen.getByText(/Searching for tasks/);
    expect(text).toBeInTheDocument();
    expect(text.tagName).toBe("P");
  });

  test("handles special characters in query", () => {
    render(
      <SearchLoading isLoading={true} query="status:pending & priority:high" />,
    );

    expect(
      screen.getByText(
        /Searching for tasks with "status:pending & priority:high"/,
      ),
    ).toBeInTheDocument();
  });

  test("renders with proper spacing and layout", () => {
    const { container } = render(
      <SearchLoading isLoading={true} query="test" />,
    );

    const wrapper = container.querySelector(".flex.items-center.gap-3");
    expect(wrapper).toBeInTheDocument();
  });
});
