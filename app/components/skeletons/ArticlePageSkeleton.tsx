import { PostCardSkeleton } from "./PostCardSkeleton";

export function ArticlePageSkeleton() {
  return (
    <div>
      {/* Article header skeleton */}
      <div>
        {/* Category badge */}
        <div></div>
        
        {/* Title */}
        <div>
          <div></div>
          <div></div>
        </div>
        
        {/* Meta info */}
        <div>
          <div></div>
          <div></div>
        </div>
        
        {/* Featured image */}
        <div></div>
        
        {/* Content lines */}
        <div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      
      {/* Related posts skeleton */}
      <div>
        <div></div>
        <div>
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      </div>
    </div>
  );
}
