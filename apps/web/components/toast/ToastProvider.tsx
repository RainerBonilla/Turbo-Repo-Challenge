"use client";

import React, { ReactNode, useCallback, useState } from "react";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined,
);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const duration = toast.duration ?? 5000;

      setToasts((prev) => [...prev, { ...toast, id, duration }]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "success", message, duration });
    },
    [addToast],
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "error", message, duration });
    },
    [addToast],
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "warning", message, duration });
    },
    [addToast],
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "info", message, duration });
    },
    [addToast],
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
