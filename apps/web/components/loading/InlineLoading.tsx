export interface InlineLoadingProps {
  isLoading: boolean;
  text?: string;
}

export function InlineLoading({
  isLoading,
  text = "Loading...",
}: InlineLoadingProps) {
  if (!isLoading) return null;

  return (
    <div className="inline-flex items-center gap-2">
      <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-current"></div>
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
}
