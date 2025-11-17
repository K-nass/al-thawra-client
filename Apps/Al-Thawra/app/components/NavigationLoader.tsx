import { useNavigation } from "react-router";
import { useEffect, useState } from "react";

/**
 * Global navigation loading indicator
 * Shows a progress bar at the top of the page during navigation
 */
export function NavigationLoader() {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (navigation.state === "loading") {
      // Small delay before showing to avoid flash for fast navigations
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [navigation.state]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1">
      <div className="h-full bg-[var(--color-primary)] animate-[loading-bar_1s_ease-in-out_infinite]" 
           style={{
             width: navigation.state === "loading" ? "70%" : "100%",
             transition: "width 0.3s ease-in-out"
           }}
      />
    </div>
  );
}

/**
 * Inline loading spinner for specific sections
 * Use this when you want to show loading state within a component
 */
export function InlineLoader({ text = "جاري التحميل..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for content
 * Use this for better perceived performance
 */
export function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-4/6" />
    </div>
  );
}
