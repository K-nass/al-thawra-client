import { PostCardSkeleton } from "./PostCardSkeleton";

export function PostsGridSkeleton() {
  return (
    <section dir="rtl" lang="ar">
      {/* Header skeleton */}
      <div>
        <div>
          <div></div>
          <div></div>
        </div>
        <div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      {/* Posts grid skeleton */}
      <div>
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    </section>
  );
}
