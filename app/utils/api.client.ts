/**
 * API Client for Remix - Server-side API calls
 */

export interface PaginatedResponse<T> {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
  items: T[];
}

export interface GetPostsParams {
  categorySlug?: string;
  authorName?: string;
  hasAuthor?: boolean;
  status?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isSlider?: boolean;
  isRecommended?: boolean;
  language?: string;
  type?: string;
  from?: string;
  to?: string;
  includeLikedByUsers?: boolean;
  pageNumber?: number;
  pageSize?: number;
  searchPhrase?: string;
}

/**
 * Build query string from params
 */
function buildQueryString(params: GetPostsParams): string {
  const queryParams: Record<string, string | number | boolean> = {};

  if (params.categorySlug) queryParams.CategorySlug = params.categorySlug;
  if (params.authorName) queryParams.AuthorName = params.authorName;
  if (params.hasAuthor !== undefined) queryParams.HasAuthor = params.hasAuthor;
  if (params.status) queryParams.Status = params.status;
  if (params.language) queryParams.Language = params.language;
  if (params.type) queryParams.Type = params.type;
  if (params.from) queryParams.From = params.from;
  if (params.to) queryParams.To = params.to;
  if (params.searchPhrase) queryParams.SearchPhrase = params.searchPhrase;

  queryParams.IsFeatured = params.isFeatured ?? false;
  queryParams.IsBreaking = params.isBreaking ?? false;
  queryParams.IsSlider = params.isSlider ?? false;
  queryParams.IsRecommended = params.isRecommended ?? false;
  queryParams.IncludeLikedByUsers = params.includeLikedByUsers ?? false;
  queryParams.PageNumber = params.pageNumber ?? 1;
  queryParams.PageSize = params.pageSize ?? 15;

  const searchParams = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });

  return searchParams.toString();
}

/**
 * Make API request
 */
async function apiRequest<T>(endpoint: string, baseUrl: string): Promise<T> {
  const url = `${baseUrl}${endpoint}`;
  console.log('API Request:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get posts with optional filters
 */
export async function getPosts(params: GetPostsParams = {}) {
  const queryString = buildQueryString(params);
  const baseUrl = process.env.API_URL || 'http://cms-dev.runasp.net/api/v1';
  
  return await apiRequest<PaginatedResponse<any>>(
    `/posts${queryString ? `?${queryString}` : ''}`,
    baseUrl
  );
}

/**
 * Get featured posts
 */
export async function getFeatured(pageSize: number = 5) {
  const queryString = buildQueryString({
    isFeatured: true,
    pageNumber: 1,
    pageSize,
  });
  const baseUrl = process.env.API_URL || 'http://cms-dev.runasp.net/api/v1';
  
  return await apiRequest<PaginatedResponse<any>>(
    `/posts${queryString ? `?${queryString}` : ''}`,
    baseUrl
  );
}

/**
 * Get breaking news
 */
export async function getBreakingNews(pageSize: number = 5) {
  const queryString = buildQueryString({
    isBreaking: true,
    pageNumber: 1,
    pageSize,
  });
  const baseUrl = process.env.API_URL || 'http://cms-dev.runasp.net/api/v1';
  
  return await apiRequest<PaginatedResponse<any>>(
    `/posts${queryString ? `?${queryString}` : ''}`,
    baseUrl
  );
}

/**
 * Get posts by category
 */
export async function getByCategory(category: string, pageNumber: number = 1, pageSize: number = 15) {
  const queryString = buildQueryString({
    categorySlug: category,
    pageNumber,
    pageSize,
  });
  const baseUrl = process.env.API_URL || 'http://cms-dev.runasp.net/api/v1';
  
  return await apiRequest<PaginatedResponse<any>>(
    `/posts${queryString ? `?${queryString}` : ''}`,
    baseUrl
  );
}

/**
 * Search posts
 */
export async function search(searchPhrase: string, pageNumber: number = 1, pageSize: number = 15) {
  const queryString = buildQueryString({
    searchPhrase,
    pageNumber,
    pageSize,
  });
  const baseUrl = process.env.API_URL || 'http://cms-dev.runasp.net/api/v1';
  
  return await apiRequest<PaginatedResponse<any>>(
    `/posts${queryString ? `?${queryString}` : ''}`,
    baseUrl
  );
}

/**
 * Posts API object for backward compatibility
 */
export const postsApi = {
  getPosts,
  getFeatured,
  getBreakingNews,
  getByCategory,
  search,
};
