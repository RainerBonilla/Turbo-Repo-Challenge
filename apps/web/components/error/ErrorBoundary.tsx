"use client";

import React, { Component, ReactNode } from "react";
import { ErrorHandler } from "./";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const appError = ErrorHandler.parseError(this.state.error);

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              {ErrorHandler.getErrorIcon(appError.type)}
              <h2 className="ml-3 text-lg font-semibold text-gray-900">
                Something went wrong
              </h2>
            </div>
            <p className="text-gray-600 mb-6">{appError.message}</p>
            {appError.details && (
              <details className="mb-6">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  Technical details
                </summary>
                <pre className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded overflow-auto">
                  {appError.details}
                </pre>
              </details>
            )}
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              >
                Reload Page
              </button>
              <button
                onClick={() =>
                  this.setState({ hasError: false, error: undefined })
                }
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
