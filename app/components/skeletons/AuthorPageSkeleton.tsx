import { PostsGridSkeleton } from "./PostsGridSkeleton";

export function AuthorPageSkeleton() {
  return (
    <div>
      {/* Author profile skeleton */}
      <div>
        <div>
          {/* Avatar */}
          <div></div>
          
          {/* Author info */}
          <div>
            <div></div>
            <div></div>
            <div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            
            {/* Stats */}
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts skeleton */}
      <PostsGridSkeleton />
    </div>
  );
}
