export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullHeight?: boolean;
}

export function LoadingSpinner({
  size = "md",
  message = "Loading...",
  fullHeight = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const containerClass = fullHeight ? "min-h-screen" : "h-full";

  return (
    <div
      className={`${containerClass} flex flex-col items-center justify-center gap-3 py-8 sm:py-12`}
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
      ></div>
      {message && (
        <p className="text-sm sm:text-base text-gray-600 font-medium text-center">
          {message}
        </p>
      )}
    </div>
  );
}
