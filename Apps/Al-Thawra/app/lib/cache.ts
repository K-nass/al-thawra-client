// Simple in-memory cache for API requests
// This cache persists during the server runtime

interface CacheEntry<T> {
  data: T;
  timestamp: number;
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
   * Set data in cache
   */
  set<T>(key: string, data: T): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
    });
    console.log(`💾 Cache SET: ${key}`);
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
   * Get or fetch data with caching
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key, ttl);
    
    if (cached !== null) {
      return cached;
    }

    console.log(`❌ Cache MISS: ${key} - Fetching...`);
    const data = await fetchFn();
    this.set(key, data);
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
