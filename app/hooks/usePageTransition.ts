import { useRef, useCallback, useState } from "react";

interface UsePageTransitionOptions {
  debounceMs?: number;
}

interface UsePageTransitionReturn {
  isLoading: boolean;
  currentPage: number;
  requestPageChange: (newPage: number) => void;
  onPageRenderComplete: () => void;
  cancelPendingChange: () => void;
}

/**
 * Manages page transitions with debouncing and stable loading states
 * Prevents rapid page changes and UI corruption
 */
export function usePageTransition(
  initialPage: number = 1,
  options: UsePageTransitionOptions = {}
): UsePageTransitionReturn {
  const { debounceMs = 150 } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Refs for debouncing
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingPage = useRef<number | null>(null);
  const isTransitioning = useRef(false);

  /**
   * Request a page change (debounced)
   */
  const requestPageChange = useCallback((newPage: number) => {
    // Don't change if it's the same page
    if (newPage === currentPage) return;

    // Set loading immediately for instant feedback
    setIsLoading(true);

    // Clear any pending debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Store pending page
    pendingPage.current = newPage;

    // Debounce the actual change
    debounceTimer.current = setTimeout(() => {
      if (pendingPage.current !== null && pendingPage.current !== currentPage) {
        isTransitioning.current = true;
        setCurrentPage(pendingPage.current);
        pendingPage.current = null;
      }
    }, debounceMs);
  }, [currentPage, debounceMs]);

  /**
   * Called when page finishes rendering
   */
  const onPageRenderComplete = useCallback(() => {
    setIsLoading(false);
    isTransitioning.current = false;
  }, []);

  /**
   * Cancel any pending page change
   */
  const cancelPendingChange = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    pendingPage.current = null;
    setIsLoading(false);
    isTransitioning.current = false;
  }, []);

  return {
    isLoading,
    currentPage,
    requestPageChange,
    onPageRenderComplete,
    cancelPendingChange,
  };
}
