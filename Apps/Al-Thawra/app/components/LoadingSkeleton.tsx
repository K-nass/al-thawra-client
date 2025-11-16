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

export function PostsGridSkeleton() {
  return (
    <section className="w-full" dir="rtl" lang="ar">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      {/* Posts grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    </section>
  );
}

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

export function HomePageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Slider skeleton */}
      <SliderSkeleton />
      
      {/* Category sections skeleton */}
      <PostsGridSkeleton />
      <PostsGridSkeleton />
      <PostsGridSkeleton />
    </div>
  );
}
