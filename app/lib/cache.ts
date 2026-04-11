// Simple in-memory cache for API requests
// This cache persists during the server runtime

// Set to false to temporarily disable caching (data will always be fetched fresh)
const CACHE_ENABLED = false;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;  // ETag from response for cache validation
  url?: string;   // URL for ETag validation requests
}


class Cache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string, ttl?: number): T | null {
    if (!CACHE_ENABLED) return null;
    const entry = this.store.get(key);
    console.log("entry",entry);
    
    if (!entry) {
      return null;
    }

    const expirationTime = ttl || this.defaultTTL;
    const isExpired = Date.now() - entry.timestamp > expirationTime;

    if (isExpired) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set data in cache with optional ETag and URL
   */
  set<T>(key: string, data: T, etag?: string, url?: string): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      etag,
      url,
    });
  }

  /**
   * Refresh timestamp for cache entry (used after successful ETag validation)
   */
  refreshTimestamp(key: string): void {
    const entry = this.store.get(key);
    if (entry) {
      entry.timestamp = Date.now();
    }
  }

  /**
   * Update ETag for existing cache entry
   */
  updateETag(key: string, etag: string): void {
    const entry = this.store.get(key);
    if (entry) {
      entry.etag = etag;
    }
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Validate cache entry with backend using ETag
   * Returns true if 304 (data unchanged), false if 200 (data changed)
   */
  async validateWithETag(url: string, etag: string): Promise<boolean> {
    try {
      // Dynamic import to avoid circular dependency
      const { default: axios } = await import('./axios');
      
      const response = await axios.get(url, {
        headers: {
          'If-None-Match': etag,
        },
        validateStatus: (status) => status === 304 || status === 200,
      });
      
      if (response.status === 304) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return true; // Fallback to cache on error
    }
  }

  /**
   * Get or fetch data with caching and ETag validation
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
    url?: string,
    validateAlways: boolean = false
  ): Promise<T> {
    if (!CACHE_ENABLED) return fetchFn();
    const entry = this.store.get(key);
    const expirationTime = ttl || this.defaultTTL;
    
    // Check if cache exists
    if (entry) {
      const isExpired = Date.now() - entry.timestamp > expirationTime;
      
      // If validateAlways is true and we have ETag, validate even if not expired
      if (validateAlways && entry.etag && entry.url && !isExpired) {
        const stillValid = await this.validateWithETag(entry.url, entry.etag);
        
        if (stillValid) {
          return entry.data as T;
        } else {
          this.delete(key);
          // Fall through to fetch fresh data
        }
      }
      // Fast path: Cache exists and hasn't expired (and not forcing validation)
      else if (!isExpired) {
        return entry.data as T;
      }
      // Cache expired but has ETag - validate with backend
      else if (entry.etag && entry.url) {
        const stillValid = await this.validateWithETag(entry.url, entry.etag);
        
        if (stillValid) {
          this.refreshTimestamp(key);
          return entry.data as T;
        } else {
          this.delete(key);
          // Fall through to fetch fresh data
        }
      }
    }

    // Cache miss or validation failed - fetch fresh data
    const data = await fetchFn();
    
    // Store with URL for future ETag validation
    this.set(key, data, undefined, url);
    return data;
  }

  /**
   * Wrapper for getOrFetch that extracts ETag from axios response
   * Use this for API calls that return axios responses
   */
  async getOrFetchWithETag<T>(
    key: string,
    fetchFn: () => Promise<any>,
    ttl?: number,
    url?: string
  ): Promise<T> {
    if (!CACHE_ENABLED) {
      const response = await fetchFn();
      return response.data as T;
    }
    // Check cache first
    const entry = this.store.get(key);
    const expirationTime = ttl || this.defaultTTL;
    
    // Fast path: Cache exists and hasn't expired
    if (entry) {
      const isExpired = Date.now() - entry.timestamp > expirationTime;
      
      if (!isExpired) {
        return entry.data as T;
      }
      
      // Cache expired but has ETag - validate with backend
      if (entry.etag && entry.url) {
        const stillValid = await this.validateWithETag(entry.url, entry.etag);
        
        if (stillValid) {
          // Data unchanged - refresh timestamp and return cached data
          this.refreshTimestamp(key);
          return entry.data as T;
        }
      }
    }

    // Cache miss or validation failed - fetch fresh data
    const response = await fetchFn();
    
    // Extract data and ETag from axios response
    const data = response.data as T;
    const etag = response.headers?.['etag'] || (response.config as any)?.etag;
    
    // Store with ETag and URL
    this.set(key, data, etag, url);
    return data;
  }

  /**
   * Generate cache key from URL and params
   */
  generateKey(url: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }
    
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    
    return `${url}?${sortedParams}`;
  }
}

// Export singleton instance
export const cache = new Cache();

// Cache TTL constants (in milliseconds)
export const CacheTTL = {
  SHORT: 5 * 60 * 1000,       // 5 minutes
  MEDIUM: 15 * 60 * 1000,     // 15 minutes
  LONG: 2 * 60 * 60 * 1000,   // 2 hours
  VERY_LONG: 2 * 60 * 60 * 1000, // 2 hours
};
