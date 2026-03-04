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
    <div>
      <div
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
    <div>
      <div>
        <div />
        <p>{text}</p>
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
    <div>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}
