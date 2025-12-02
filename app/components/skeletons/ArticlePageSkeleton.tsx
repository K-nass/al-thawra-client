import { PostCardSkeleton } from "./PostCardSkeleton";

export function ArticlePageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Article header skeleton */}
      <div className="bg-white rounded-lg p-6 animate-pulse">
        {/* Category badge */}
        <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
        
        {/* Title */}
        <div className="space-y-3 mb-4">
          <div className="h-8 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Meta info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        
        {/* Featured image */}
        <div className="aspect-video bg-gray-200 rounded mb-6"></div>
        
        {/* Content lines */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      
      {/* Related posts skeleton */}
      <div className="bg-white rounded-lg p-6">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      </div>
    </div>
  );
}
