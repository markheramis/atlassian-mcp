/**
 * Simple in-memory cache with TTL support.
 * Used for caching relatively static data like priorities and issue types.
 */

/**
 * Cache entry structure with expiry timestamp.
 */
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

/**
 * Internal cache storage.
 */
const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Default TTL: 5 minutes.
 */
const DEFAULT_TTL_MS = 5 * 60 * 1000;

/**
 * Get cached data or fetch and cache it.
 * If cached data exists and hasn't expired, returns cached data.
 * Otherwise, fetches new data using the provided fetcher function.
 *
 * @param key - Unique cache key
 * @param fetcher - Async function to fetch fresh data
 * @param ttlMs - Time-to-live in milliseconds (default: 5 minutes)
 * @returns Cached or freshly fetched data
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<T> {
  const cached = cache.get(key);

  // Return cached data if not expired
  if (cached && Date.now() < cached.expiry) {
    return cached.data as T;
  }

  // Fetch new data and cache it
  const data = await fetcher();
  cache.set(key, { data, expiry: Date.now() + ttlMs });

  return data;
}

/**
 * Clear the entire cache.
 * Useful for testing or when configuration changes.
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Clear a specific cache entry.
 *
 * @param key - Cache key to clear
 */
export function clearCacheEntry(key: string): void {
  cache.delete(key);
}

/**
 * Check if a cache entry exists and is still valid.
 *
 * @param key - Cache key to check
 * @returns true if entry exists and hasn't expired
 */
export function hasCachedEntry(key: string): boolean {
  const cached = cache.get(key);
  return cached !== undefined && Date.now() < cached.expiry;
}

/**
 * Get cache statistics for debugging.
 *
 * @returns Object with cache size and entry keys
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}
