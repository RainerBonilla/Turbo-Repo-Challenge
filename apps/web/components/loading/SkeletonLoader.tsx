export interface SkeletonLoaderProps {
  count?: number;
  type?: "card" | "task" | "row";
  className?: string;
}

export function SkeletonLoader({
  count = 3,
  type = "card",
  className = "",
}: SkeletonLoaderProps) {
  const cardSkeleton = (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-3 sm:mb-4"></div>
      <div className="flex gap-2 mb-3 sm:mb-4">
        <div className="h-5 sm:h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-5 sm:h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  const taskSkeleton = (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 animate-pulse">
      <div className="flex justify-between gap-4 mb-3">
        <div className="h-4 bg-gray-200 rounded w-2/3 flex-1"></div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
  );

  const rowSkeleton = (
    <div className="bg-white rounded p-3 sm:p-4 mb-2 animate-pulse flex justify-between items-center">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="w-16 h-4 bg-gray-200 rounded"></div>
    </div>
  );

  const skeletons = {
    card: cardSkeleton,
    task: taskSkeleton,
    row: rowSkeleton,
  };

  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div key={i}>{skeletons[type]}</div>
      ))}
    </div>
  );
}
