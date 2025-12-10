export function SliderSkeleton() {
  return (
    <div className="relative w-full aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="absolute inset-0 flex items-end p-8">
        <div className="space-y-4 w-full max-w-2xl">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-10 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
