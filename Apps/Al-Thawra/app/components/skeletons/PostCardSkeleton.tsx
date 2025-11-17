export function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[16/10] bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Category badge */}
        <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
        
        {/* Title */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Date */}
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}
