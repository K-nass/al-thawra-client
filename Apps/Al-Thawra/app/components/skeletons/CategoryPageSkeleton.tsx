import { PostsGridSkeleton } from "./PostsGridSkeleton";

export function CategoryPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Category header skeleton */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <span className="text-gray-300">|</span>
          <div className="flex gap-2">
            <div className="h-7 w-20 bg-gray-200 rounded"></div>
            <div className="h-7 w-24 bg-gray-200 rounded"></div>
            <div className="h-7 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="mt-2 h-4 bg-gray-200 rounded w-2/3"></div>
      </div>

      {/* Posts grid skeleton */}
      <PostsGridSkeleton />
    </div>
  );
}
