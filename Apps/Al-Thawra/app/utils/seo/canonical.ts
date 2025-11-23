/**
 * Canonical URL Helpers
 * Generate canonical URLs for pages
 */

import { SEO_CONFIG } from "./constants";

/**
 * Generate canonical URL for a given path
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash unless it's the root
  const cleanPath = path === "/" ? "/" : path.replace(/\/$/, "");
  
  // Remove query parameters for canonical (unless needed for pagination)
  const pathWithoutQuery = cleanPath.split("?")[0];
  
  return `${SEO_CONFIG.baseUrl}${pathWithoutQuery}`;
}

/**
 * Generate canonical URL with pagination support
 */
export function getCanonicalUrlWithPagination(
  path: string,
  page?: number
): string {
  const cleanPath = path.replace(/\/$/, "");
  
  if (!page || page === 1) {
    return `${SEO_CONFIG.baseUrl}${cleanPath}`;
  }
  
  return `${SEO_CONFIG.baseUrl}${cleanPath}?page=${page}`;
}

/**
 * Generate prev/next pagination links
 */
export function getPaginationLinks(
  path: string,
  currentPage: number,
  hasNextPage: boolean
) {
  const cleanPath = path.replace(/\/$/, "");
  
  return {
    prev: currentPage > 1 
      ? `${SEO_CONFIG.baseUrl}${cleanPath}${currentPage > 2 ? `?page=${currentPage - 1}` : ""}`
      : null,
    next: hasNextPage
      ? `${SEO_CONFIG.baseUrl}${cleanPath}?page=${currentPage + 1}`
      : null,
  };
}
