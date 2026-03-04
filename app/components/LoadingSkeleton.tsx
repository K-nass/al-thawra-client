export function PostCardSkeleton() {
  return (
    <div>
      {/* Image skeleton */}
      <div></div>
      
      {/* Content skeleton */}
      <div>
        {/* Category badge */}
        <div></div>
        
        {/* Title */}
        <div>
          <div></div>
          <div></div>
        </div>
        
        {/* Date */}
        <div></div>
      </div>
    </div>
  );
}

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

export function SliderSkeleton() {
  return (
    <div>
      <div>
        <div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div>
      {/* Slider skeleton */}
      <SliderSkeleton />
      
      {/* Category sections skeleton */}
      <PostsGridSkeleton />
      <PostsGridSkeleton />
      <PostsGridSkeleton />
    </div>
  );
}
