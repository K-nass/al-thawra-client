import { useState, useCallback } from "react";

/**
 * Custom hook for managing page loading states in PDF viewer
 * Provides smooth loading indicators when pages change
 */
export function usePageLoading() {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [loadingPageNumber, setLoadingPageNumber] = useState<number | null>(null);

  /**
   * Call this when starting to load a new page
   */
  const startPageLoad = useCallback((pageNum: number) => {
    setIsPageLoading(true);
    setLoadingPageNumber(pageNum);
  }, []);

  /**
   * Call this when page has finished rendering
   */
  const endPageLoad = useCallback(() => {
    setIsPageLoading(false);
    setLoadingPageNumber(null);
  }, []);

  /**
   * Reset loading state (useful for error recovery)
   */
  const resetPageLoad = useCallback(() => {
    setIsPageLoading(false);
    setLoadingPageNumber(null);
  }, []);

  return {
    isPageLoading,
    loadingPageNumber,
    startPageLoad,
    endPageLoad,
    resetPageLoad,
  };
}
