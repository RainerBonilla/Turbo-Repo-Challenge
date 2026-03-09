export interface SearchLoadingProps {
  isLoading: boolean;
  query: string;
}

export function SearchLoading({ isLoading, query }: SearchLoadingProps) {
  if (!isLoading) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 sm:p-4 flex items-center gap-3">
      <div className="w-5 h-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 shrink-0"></div>
      <div className="flex-1">
        <p className="text-xs sm:text-sm text-blue-800 font-medium">
          Searching for tasks with "{query}"...
        </p>
      </div>
    </div>
  );
}
