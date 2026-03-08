import React from "react";

export interface AppError {
  type: "network" | "validation" | "server" | "unknown";
  message: string;
  details?: string;
  retryable?: boolean;
}

export class ErrorHandler {
  static parseError(error: unknown): AppError {
    if (error instanceof Error) {
      // Network errors
      if (
        error.message.includes("fetch") ||
        error.message.includes("network")
      ) {
        return {
          type: "network",
          message: "Connection failed. Please check your internet connection.",
          details: error.message,
          retryable: true,
        };
      }

      // API errors with status codes
      if (error.message.includes("API Error")) {
        const statusMatch = error.message.match(/API Error: (\d+)/);
        const status =
          statusMatch && statusMatch[1] ? parseInt(statusMatch[1]) : 0;

        if (status === 400) {
          return {
            type: "validation",
            message: "Invalid data provided. Please check your input.",
            details: error.message,
            retryable: false,
          };
        } else if (status === 404) {
          return {
            type: "server",
            message: "The requested resource was not found.",
            details: error.message,
            retryable: false,
          };
        } else if (status === 409) {
          return {
            type: "validation",
            message: "This action conflicts with existing data.",
            details: error.message,
            retryable: false,
          };
        } else if (status >= 500) {
          return {
            type: "server",
            message: "Server error occurred. Please try again later.",
            details: error.message,
            retryable: true,
          };
        }
      }

      // Validation errors
      if (
        error.message.includes("validation") ||
        error.message.includes("invalid")
      ) {
        return {
          type: "validation",
          message: error.message,
          retryable: false,
        };
      }

      // Default error
      return {
        type: "unknown",
        message: error.message || "An unexpected error occurred.",
        details: error.message,
        retryable: true,
      };
    }

    return {
      type: "unknown",
      message: "An unexpected error occurred.",
      details: String(error),
      retryable: true,
    };
  }

  static getErrorIcon(type: AppError["type"]) {
    switch (type) {
      case "network":
        return (
          <svg
            className="w-5 h-5 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "validation":
        return (
          <svg
            className="w-5 h-5 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "server":
        return (
          <svg
            className="w-5 h-5 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  }

  static getErrorColor(type: AppError["type"]) {
    switch (type) {
      case "network":
      case "server":
        return "red";
      case "validation":
        return "yellow";
      default:
        return "gray";
    }
  }
}
