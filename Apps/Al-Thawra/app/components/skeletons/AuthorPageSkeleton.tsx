import { PostsGridSkeleton } from "./PostsGridSkeleton";

export function AuthorPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Author profile skeleton */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-gray-200"></div>
          
          {/* Author info */}
          <div className="flex-1 space-y-3 text-center md:text-right w-full">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto md:mx-0"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto md:mx-0"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mx-auto md:mx-0"></div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-4 justify-center md:justify-start pt-4">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts skeleton */}
      <PostsGridSkeleton />
    </div>
  );
}
