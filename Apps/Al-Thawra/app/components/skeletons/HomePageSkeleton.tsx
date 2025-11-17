import { SliderSkeleton } from "./SliderSkeleton";
import { PostsGridSkeleton } from "./PostsGridSkeleton";

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
