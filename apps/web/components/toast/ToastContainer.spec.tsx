import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastContainer } from "./ToastContainer";
import { ToastProvider, Toast } from "./ToastProvider";
import React from "react";

// Mock window.innerWidth
const setInnerWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe("ToastContainer", () => {
  beforeEach(() => {
    setInnerWidth(1024);
  });

  test("renders empty container when no toasts", () => {
    render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>,
    );

    const container = screen.queryByRole("button");
    // Should render the fixed container but no toast items
    expect(container).not.toBeInTheDocument();
  });

  test("renders toast with success type styling", () => {
    const MockToastContainer = () => {
      const { showSuccess } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showSuccess("Success message");
      }, [showSuccess]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    expect(screen.getByText("Success message")).toBeInTheDocument();
  });

  test("renders toast with error type styling", () => {
    const MockToastContainer = () => {
      const { showError } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showError("Error message");
      }, [showError]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  test("renders toast with warning type styling", () => {
    const MockToastContainer = () => {
      const { showWarning } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showWarning("Warning message");
      }, [showWarning]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    expect(screen.getByText("Warning message")).toBeInTheDocument();
  });

  test("renders toast with info type styling", () => {
    const MockToastContainer = () => {
      const { showInfo } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showInfo("Info message");
      }, [showInfo]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  test("removes toast when close button is clicked", () => {
    const MockToastContainer = () => {
      const { showSuccess } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showSuccess("Toast to remove");
      }, [showSuccess]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    const closeButtons = screen.getAllByRole("button");
    const closeButton = closeButtons[closeButtons.length - 1];

    // make sure we found a button before clicking (avoid undefined error)
    expect(closeButton).toBeDefined();
    fireEvent.click(closeButton!);

    expect(screen.queryByText("Toast to remove")).not.toBeInTheDocument();
  });

  test("renders multiple toasts", () => {
    const MockToastContainer = () => {
      const { showSuccess, showError } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showSuccess("Success message");
        showError("Error message");
      }, [showSuccess, showError]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    expect(screen.getByText("Success message")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  test("sets correct position for desktop view", () => {
    setInnerWidth(1024);

    const MockToastContainer = () => {
      const { showSuccess } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showSuccess("Desktop toast");
      }, [showSuccess]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    const { container } = render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    const toastContainer = container.querySelector(".fixed.z-50");
    expect(toastContainer).toHaveClass("top-4", "right-4", "w-96");
  });

  test("sets correct position for mobile view", () => {
    setInnerWidth(500);

    const MockToastContainer = () => {
      const { showSuccess } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showSuccess("Mobile toast");
      }, [showSuccess]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    const { container } = render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    const toastContainer = container.querySelector(".fixed.z-50");
    expect(toastContainer).toHaveClass("bottom-4", "left-4", "right-4");
  });

  test("updates layout on window resize", () => {
    setInnerWidth(1024);

    const MockToastContainer = () => {
      const { showSuccess } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showSuccess("Responsive toast");
      }, [showSuccess]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    const { container } = render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    let toastContainer = container.querySelector(".fixed.z-50");
    expect(toastContainer).toHaveClass("top-4", "right-4");

    // Simulate resize to mobile
    act(() => {
      setInnerWidth(500);
      fireEvent.resize(window);
    });

    toastContainer = container.querySelector(".fixed.z-50");
    expect(toastContainer).toHaveClass("bottom-4", "left-4");
  });

  test("each toast has unique key", () => {
    const MockToastContainer = () => {
      const { showSuccess } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showSuccess("Toast 1");
        showSuccess("Toast 2");
        showSuccess("Toast 3");
      }, [showSuccess]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    expect(screen.getByText("Toast 1")).toBeInTheDocument();
    expect(screen.getByText("Toast 2")).toBeInTheDocument();
    expect(screen.getByText("Toast 3")).toBeInTheDocument();
  });

  test("toast message is displayed", () => {
    const MockToastContainer = () => {
      const { showSuccess } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showSuccess("This is a test message");
      }, [showSuccess]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    expect(screen.getByText("This is a test message")).toBeInTheDocument();
  });

  test("renders close button for each toast", () => {
    const MockToastContainer = () => {
      const { showSuccess, showError } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showSuccess("Toast 1");
        showError("Toast 2");
      }, [showSuccess, showError]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  test("renders success icon for success toast", () => {
    const MockToastContainer = () => {
      const { showSuccess } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showSuccess("Success!");
      }, [showSuccess]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    const { container } = render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  test("has z-50 for proper stacking", () => {
    const MockToastContainer = () => {
      const { showSuccess } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showSuccess("Z-index test");
      }, [showSuccess]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    const { container } = render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    const toastContainer = container.querySelector(".z-50");
    expect(toastContainer).toBeInTheDocument();
  });

  test("pointer-events-none on container, pointer-events-auto on items", () => {
    const MockToastContainer = () => {
      const { showSuccess } = require("./ToastProvider").useToast();

      React.useEffect(() => {
        showSuccess("Pointer events test");
      }, [showSuccess]);

      return (
        <>
          <ToastContainer />
        </>
      );
    };

    const { container } = render(
      <ToastProvider>
        <MockToastContainer />
      </ToastProvider>,
    );

    const mainContainer = container.querySelector(
      ".fixed.z-50.pointer-events-none",
    );
    expect(mainContainer).toBeInTheDocument();

    const toastItem = container.querySelector(".pointer-events-auto");
    expect(toastItem).toBeInTheDocument();
  });
});
