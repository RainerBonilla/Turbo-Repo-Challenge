"use client";

import React from "react";
import { Toast } from "./ToastProvider";
import { useToast } from "./ToastProvider";

function ToastComponent({
  toast,
  onRemove,
  isMobile,
}: {
  toast: Toast;
  onRemove: () => void;
  isMobile: boolean;
}) {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  }[toast.type];

  const icon = {
    success: (
      <svg
        className={`${isMobile ? "w-5 h-5" : "w-5 h-5"} text-white`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg
        className={`${isMobile ? "w-5 h-5" : "w-5 h-5"} text-white`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg
        className={`${isMobile ? "w-5 h-5" : "w-5 h-5"} text-white`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18.101 12.93l-.902-14.85a1.56 1.56 0 00-1.556-1.43H4.357c-.732 0-1.368.579-1.556 1.43L1.899 12.93c-.164 2.723.1 5.501 1.362 7.224.655 1.011 1.632 1.707 2.813 2.129a7.627 7.627 0 003.726.634 7.627 7.627 0 003.726-.634c1.181-.422 2.158-1.118 2.813-2.129 1.263-1.724 1.526-4.501 1.362-7.224z"
          clipRule="evenodd"
        />
      </svg>
    ),
    info: (
      <svg
        className={`${isMobile ? "w-5 h-5" : "w-5 h-5"} text-white`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  }[toast.type];

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-md shadow-lg flex items-center space-x-3 ${isMobile ? "text-base" : "text-sm"} animate-in fade-in slide-in-from-top-5 duration-200`}
    >
      {icon}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={onRemove}
        className="text-white hover:text-gray-100 shrink-0"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={`fixed z-50 pointer-events-none ${
        isMobile
          ? "bottom-4 left-4 right-4 flex flex-col gap-2"
          : "top-4 right-4 w-96 flex flex-col gap-2"
      }`}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastComponent
            toast={toast}
            onRemove={() => removeToast(toast.id)}
            isMobile={isMobile}
          />
        </div>
      ))}
    </div>
  );
}
