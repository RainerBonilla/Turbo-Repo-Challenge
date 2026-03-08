"use client";

import React from "react";
import { AppError, ErrorHandler } from "../lib/errorHandler";

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  className = "",
}: ErrorDisplayProps) {
  const bgColorClass =
    ErrorHandler.getErrorColor(error.type) === "red"
      ? "bg-red-50 border-red-200"
      : ErrorHandler.getErrorColor(error.type) === "yellow"
        ? "bg-yellow-50 border-yellow-200"
        : "bg-gray-50 border-gray-200";

  const textColorClass =
    ErrorHandler.getErrorColor(error.type) === "red"
      ? "text-red-800"
      : ErrorHandler.getErrorColor(error.type) === "yellow"
        ? "text-yellow-800"
        : "text-gray-800";

  const subTextColorClass =
    ErrorHandler.getErrorColor(error.type) === "red"
      ? "text-red-700"
      : ErrorHandler.getErrorColor(error.type) === "yellow"
        ? "text-yellow-700"
        : "text-gray-700";

  const buttonColorClass =
    ErrorHandler.getErrorColor(error.type) === "red"
      ? "bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500"
      : ErrorHandler.getErrorColor(error.type) === "yellow"
        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500";

  return (
    <div className={`border rounded-md p-4 ${bgColorClass} ${className}`}>
      <div className="flex">
        <div className="shrink-0">{ErrorHandler.getErrorIcon(error.type)}</div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${textColorClass}`}>
            {error.type === "network"
              ? "Connection Error"
              : error.type === "server"
                ? "Server Error"
                : error.type === "validation"
                  ? "Validation Error"
                  : "Error"}
          </h3>
          <div className={`mt-2 text-sm ${subTextColorClass}`}>
            {error.message}
          </div>
          {error.details && (
            <details className="mt-2">
              <summary
                className={`text-xs cursor-pointer hover:underline ${subTextColorClass}`}
              >
                Show details
              </summary>
              <pre
                className={`mt-1 text-xs ${subTextColorClass} bg-white bg-opacity-50 p-2 rounded overflow-auto`}
              >
                {error.details}
              </pre>
            </details>
          )}
          {error.retryable && onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColorClass}`}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
