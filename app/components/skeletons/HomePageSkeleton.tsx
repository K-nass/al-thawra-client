import { SliderSkeleton } from "./SliderSkeleton";
import { PostsGridSkeleton } from "./PostsGridSkeleton";

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
