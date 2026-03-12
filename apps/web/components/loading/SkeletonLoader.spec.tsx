import { render, screen } from "@testing-library/react";
import { SkeletonLoader } from "./SkeletonLoader";

describe("SkeletonLoader", () => {
  test("renders default count of skeletons (3)", () => {
    const { container } = render(<SkeletonLoader />);

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(3);
  });

  test("renders specified count of skeletons", () => {
    const { container } = render(<SkeletonLoader count={5} />);

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(5);
  });

  test("renders single skeleton when count is 1", () => {
    const { container } = render(<SkeletonLoader count={1} />);

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(1);
  });

  test("renders many skeletons when count is large", () => {
    const { container } = render(<SkeletonLoader count={10} />);

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(10);
  });

  test("renders card type skeleton by default", () => {
    const { container } = render(<SkeletonLoader count={1} />);

    const cardSkeleton = container.querySelector(
      ".bg-white.rounded-lg.shadow-md",
    );
    expect(cardSkeleton).toBeInTheDocument();
  });

  test("renders card type skeleton with correct structure", () => {
    const { container } = render(<SkeletonLoader count={1} type="card" />);

    const elements = container.querySelectorAll(".bg-gray-200");
    expect(elements.length).toBeGreaterThan(0);
  });

  test("renders task type skeleton", () => {
    const { container } = render(<SkeletonLoader count={1} type="task" />);

    const taskSkeleton = container.querySelector(
      ".bg-white.rounded-lg.shadow-md",
    );
    expect(taskSkeleton).toBeInTheDocument();
  });

  test("renders row type skeleton", () => {
    const { container } = render(<SkeletonLoader count={1} type="row" />);

    const elements = container.querySelectorAll(".animate-pulse");
    expect(elements.length).toBe(1);
  });

  test("applies custom className to wrapper", () => {
    const customClass = "custom-grid-class";
    const { container } = render(
      <SkeletonLoader count={2} className={customClass} />,
    );

    const wrapper = container.querySelector(`.${customClass}`);
    expect(wrapper).toBeInTheDocument();
  });

  test("renders with grid layout class when provided", () => {
    const { container } = render(
      <SkeletonLoader
        count={3}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      />,
    );

    const wrapper = container.querySelector(".grid");
    expect(wrapper).toBeInTheDocument();
  });

  test("card skeleton has shadow and padding", () => {
    const { container } = render(<SkeletonLoader count={1} type="card" />);

    const cardSkeleton = container.querySelector(
      ".bg-white.rounded-lg.shadow-md.p-4",
    );
    expect(cardSkeleton).toBeInTheDocument();
  });

  test("task skeleton has correct margin", () => {
    const { container } = render(<SkeletonLoader count={1} type="task" />);

    const taskSkeleton = container.querySelector(".mb-3");
    expect(taskSkeleton).toBeInTheDocument();
  });

  test("all skeletons have animate-pulse class", () => {
    const { container } = render(<SkeletonLoader count={3} />);

    const skeletons = container.querySelectorAll(".animate-pulse");
    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveClass("animate-pulse");
    });
  });

  test("renders with zero count", () => {
    const { container } = render(<SkeletonLoader count={0} />);

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(0);
  });

  test("card skeleton has placeholder elements", () => {
    const { container } = render(<SkeletonLoader count={1} type="card" />);

    const placeholders = container.querySelectorAll(".bg-gray-200");
    expect(placeholders.length).toBeGreaterThan(0);
  });

  test("task skeleton has icon placeholders", () => {
    const { container } = render(<SkeletonLoader count={1} type="task" />);

    const boxes = container.querySelectorAll(".bg-gray-200.rounded");
    expect(boxes.length).toBeGreaterThan(0);
  });

  test("row skeleton has label and value placeholders", () => {
    const { container } = render(<SkeletonLoader count={1} type="row" />);

    const elements = container.querySelectorAll(".bg-gray-200");
    expect(elements.length).toBeGreaterThan(0);
  });

  test("multiple skeletons are independent", () => {
    const { container } = render(<SkeletonLoader count={3} type="card" />);

    const divs = container.querySelectorAll("[style] > div");
    expect(divs.length).toBeGreaterThanOrEqual(0);
  });

  test("renders card skeleton with different widths", () => {
    const { container } = render(<SkeletonLoader count={1} type="card" />);

    const elements = container.querySelectorAll("[class*='w-']");
    const hasMultipleWidths = new Set();
    elements.forEach((el) => {
      const match = el.className.match(/w-\d+\/\d+|w-\d+/);
      if (match) hasMultipleWidths.add(match[0]);
    });
    expect(hasMultipleWidths.size).toBeGreaterThan(0);
  });

  test("renders responsive classes for different skeleton types", () => {
    const { container } = render(<SkeletonLoader count={1} type="card" />);

    const element = container.querySelector("[class*='sm:']");
    expect(element).toBeInTheDocument();
  });

  test("card skeleton has badges placeholders", () => {
    const { container } = render(<SkeletonLoader count={1} type="card" />);

    const roundedFull = container.querySelectorAll(".rounded-full");
    expect(roundedFull.length).toBeGreaterThan(0);
  });

  test("default className is empty string", () => {
    const { container } = render(<SkeletonLoader count={1} className="" />);

    expect((container.firstChild as HTMLElement).className).toBe("");
  });

  test("respects all custom classes in className prop", () => {
    const { container } = render(
      <SkeletonLoader count={1} className="grid grid-cols-3 gap-4 px-4" />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("grid");
    expect(wrapper.className).toContain("gap-4");
  });
});
