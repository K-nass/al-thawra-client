import { PostsGridSkeleton } from "./PostsGridSkeleton";

export function CategoryPageSkeleton() {
  return (
    <div>
      {/* Category header skeleton */}
      <div>
        <div>
          <div></div>
          <span>|</span>
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div></div>
      </div>

      {/* Posts grid skeleton */}
      <PostsGridSkeleton />
    </div>
  );
}
