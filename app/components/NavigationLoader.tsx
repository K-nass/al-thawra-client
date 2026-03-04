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
    <div className="fixed top-0 left-0 right-0 h-1 bg-[#d0e8f2] z-50">
      <div
        className="h-full bg-[#5a8ca8] transition-all duration-300 ease-out animate-pulse"
        style={{ width: '70%' }}
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
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#a8c5d4] border-t-[#5a8ca8] rounded-full animate-spin" />
        <p className="mt-3 text-sm text-gray-600">{text}</p>
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
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-[#a8c5d4] rounded w-3/4" />
      <div className="h-4 bg-[#a8c5d4] rounded w-full" />
      <div className="h-4 bg-[#a8c5d4] rounded w-5/6" />
      <div className="h-4 bg-[#a8c5d4] rounded w-4/5" />
    </div>
  );
}
