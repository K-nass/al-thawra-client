// Simple in-memory cache for API requests
// This cache persists during the server runtime

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
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }

    const expirationTime = ttl || this.defaultTTL;
    const isExpired = Date.now() - entry.timestamp > expirationTime;

    if (isExpired) {
      this.store.delete(key);
      return null;
    }

    console.log(`✅ Cache HIT: ${key}`);
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
    console.log(`💾 Cache SET: ${key}${etag ? ` (ETag: ${etag.substring(0, 20)}...)` : ''}`);
  }

  /**
   * Refresh timestamp for cache entry (used after successful ETag validation)
   */
  refreshTimestamp(key: string): void {
    const entry = this.store.get(key);
    if (entry) {
      entry.timestamp = Date.now();
      console.log(`🔄 Cache REFRESHED: ${key}`);
    }
  }

  /**
   * Update ETag for existing cache entry
   */
  updateETag(key: string, etag: string): void {
    const entry = this.store.get(key);
    if (entry) {
      entry.etag = etag;
      console.log(`🏷️ ETag UPDATED: ${key} -> ${etag.substring(0, 20)}...`);
    }
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.store.delete(key);
    console.log(`🗑️ Cache DELETE: ${key}`);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.store.clear();
    console.log(`🗑️ Cache CLEARED`);
  }

  /**
   * Validate cache entry with backend using ETag
   */
  async validateWithETag(url: string, etag: string): Promise<boolean> {
    try {
      // Dynamic import to avoid circular dependency
      const { default: axios } = await import('./axios');
      
      console.log(`🔍 Validating ETag for: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          'If-None-Match': etag,
        },
        validateStatus: (status) => status === 304 || status === 200,
      });
      
      if (response.status === 304) {
        console.log(`✅ ETag VALID (304): Data unchanged`);
        return true;
      } else {
        console.log(`🔄 ETag INVALID (200): Data changed, new ETag: ${response.headers['etag']}`);
        return false;
      }
    } catch (error) {
      console.warn(`⚠️ ETag validation failed, using cached data:`, error);
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
    url?: string
  ): Promise<T> {
    const entry = this.store.get(key);
    const expirationTime = ttl || this.defaultTTL;
    
    // Fast path: Cache exists and hasn't expired
    if (entry) {
      const isExpired = Date.now() - entry.timestamp > expirationTime;
      
      if (!isExpired) {
        console.log(`✅ Cache HIT: ${key}`);
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
    console.log(`❌ Cache MISS: ${key} - Fetching...`);
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
    fetchFn: () => Promise<any>, // axios response
    ttl?: number,
    url?: string
  ): Promise<T> {
    // Check cache first
    const entry = this.store.get(key);
    const expirationTime = ttl || this.defaultTTL;
    
    // Fast path: Cache exists and hasn't expired
    if (entry) {
      const isExpired = Date.now() - entry.timestamp > expirationTime;
      
      if (!isExpired) {
        console.log(`✅ Cache HIT: ${key}`);
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
    console.log(`❌ Cache MISS: ${key} - Fetching...`);
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
