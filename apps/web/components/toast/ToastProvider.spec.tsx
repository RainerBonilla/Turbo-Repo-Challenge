import {
  render,
  screen,
  waitFor,
  renderHook,
  act,
} from "@testing-library/react";
import { ToastProvider, useToast, Toast } from "./ToastProvider";
import React from "react";

describe("ToastProvider", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("provides toast context to children", () => {
    render(
      <ToastProvider>
        <div>Test Content</div>
      </ToastProvider>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("useToast hook throws error when used outside provider", () => {
    // Suppress console.error for expected error
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useToast());
    }).toThrow("useToast must be used within a ToastProvider");

    consoleSpy.mockRestore();
  });

  test("useToast hook returns context value", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.toasts).toBeDefined();
    expect(result.current.addToast).toBeDefined();
    expect(result.current.removeToast).toBeDefined();
    expect(result.current.showSuccess).toBeDefined();
    expect(result.current.showError).toBeDefined();
  });

  test("initial toasts array is empty", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(result.current.toasts).toEqual([]);
  });

  test("showSuccess adds success toast", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    result.current.showSuccess("Operation successful");
    await waitFor(() => expect(result.current.toasts).toHaveLength(1));
    expect(result.current.toasts[0]!.type).toBe("success");
    expect(result.current.toasts[0]!.message).toBe("Operation successful");
  });

  test("showError adds error toast", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    result.current.showError("An error occurred");
    await waitFor(() => expect(result.current.toasts).toHaveLength(1));
    expect(result.current.toasts[0]!.type).toBe("error");
    expect(result.current.toasts[0]!.message).toBe("An error occurred");
  });

  test("showWarning adds warning toast", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    result.current.showWarning("Warning message");
    await waitFor(() => expect(result.current.toasts).toHaveLength(1));
    expect(result.current.toasts[0]!.type).toBe("warning");
  });

  test("showInfo adds info toast", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    result.current.showInfo("Information message");
    await waitFor(() => expect(result.current.toasts).toHaveLength(1));
    expect(result.current.toasts[0]!.type).toBe("info");
  });

  test("removeToast removes toast by id", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    result.current.showSuccess("Test");
    await waitFor(() => expect(result.current.toasts).toHaveLength(1));
    const toastId = result.current.toasts[0]!.id;

    result.current.removeToast(toastId);
    await waitFor(() => expect(result.current.toasts).toHaveLength(0));
  });

  test("addToast generates unique ids", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    result.current.showSuccess("Toast 1");
    result.current.showSuccess("Toast 2");
    result.current.showSuccess("Toast 3");

    await waitFor(() => expect(result.current.toasts).toHaveLength(3));

    const ids = result.current.toasts.map((t) => t.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(3);
  });

  test("toast auto-removes after default duration (5000ms)", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showSuccess("Auto-remove test");
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  test("toast respects custom duration", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    result.current.showSuccess("Custom duration", 2000);

    await waitFor(() => expect(result.current.toasts).toHaveLength(1));

    jest.advanceTimersByTime(2000);

    await waitFor(() => expect(result.current.toasts).toHaveLength(0));
  });

  test("toast with duration 0 does not auto-remove", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showSuccess("Persistent", 0);
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  test("multiple toasts can be displayed simultaneously", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showSuccess("Success");
      result.current.showError("Error");
      result.current.showWarning("Warning");
    });

    expect(result.current.toasts).toHaveLength(3);
  });

  test("each toast has a unique id, type, and message", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showSuccess("Success message");
      result.current.showError("Error message");
    });

    expect(result.current.toasts[0]!.type).toBe("success");
    expect(result.current.toasts[0]!.message).toBe("Success message");
    expect(result.current.toasts[1]!.type).toBe("error");
    expect(result.current.toasts[1]!.message).toBe("Error message");
  });

  test("addToast allows custom toast configuration", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({
        type: "info",
        message: "Custom toast",
        duration: 3000,
      });
    });

    expect(result.current.toasts[0]!.type).toBe("info");
    expect(result.current.toasts[0]!.message).toBe("Custom toast");
    expect(result.current.toasts[0]!.duration).toBe(3000);
  });

  test("removes only the specified toast when multiple exist", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showSuccess("Toast 1");
      result.current.showSuccess("Toast 2");
      result.current.showSuccess("Toast 3");
    });

    const toastIdToRemove = result.current.toasts[1]!.id;

    act(() => {
      result.current.removeToast(toastIdToRemove);
    });

    expect(result.current.toasts).toHaveLength(2);
    expect(result.current.toasts[0]!.message).toBe("Toast 1");
    expect(result.current.toasts[1]!.message).toBe("Toast 3");
  });

  test("toast position data in context value", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(Object.keys(result.current).sort()).toEqual(
      [
        "addToast",
        "removeToast",
        "showError",
        "showInfo",
        "showSuccess",
        "showWarning",
        "toasts",
      ].sort(),
    );
  });
});
