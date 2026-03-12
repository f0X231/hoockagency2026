/**
 * localStorage cache utility
 *
 * - TTL: 1 hour (default)
 * - Append ?cache=nocache to any URL to bust the cache:
 *     forces a fresh fetch from Strapi, then stores the new result.
 */

const TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry<T> {
  data: T;
  expiresAt: number; // epoch ms
}

function storageKey(url: string): string {
  // Strip the nocache flag before building the storage key so both
  // the nocache request and normal requests share the same slot.
  return `strapi_cache:${url.replace(/[?&]cache=nocache/g, '')}`;
}

/** Return true if the current page URL contains ?cache=nocache */
export function isNocacheRequest(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('cache') === 'nocache';
}

/** Read a valid (non-expired) cache entry, or null if missing / expired. */
export function getCache<T>(url: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey(url));
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(storageKey(url));
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

/** Write data to cache with a 1-hour TTL. */
export function setCache<T>(url: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry<T> = {
      data,
      expiresAt: Date.now() + TTL_MS,
    };
    localStorage.setItem(storageKey(url), JSON.stringify(entry));
  } catch {
    // localStorage might be full or disabled — fail silently.
  }
}

/** Delete a specific cache entry. */
export function clearCache(url: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(storageKey(url));
  } catch {
    // fail silently
  }
}

/**
 * Cached fetch wrapper.
 *
 * Usage:
 *   const json = await cachedFetch('/api/articles?start=0&limit=3');
 *
 * Rules:
 *   - If the page URL contains ?cache=nocache → skip cache, fetch fresh, store result.
 *   - Otherwise → return cached data if available and not expired.
 *   - On a fresh fetch, always store the result.
 */
export async function cachedFetch<T = unknown>(
  apiUrl: string,
  fetchFn: (url: string) => Promise<T>
): Promise<T> {
  const nocache = isNocacheRequest();

  if (!nocache) {
    const cached = getCache<T>(apiUrl);
    if (cached !== null) return cached;
  } else {
    clearCache(apiUrl);
  }

  const data = await fetchFn(apiUrl);
  setCache<T>(apiUrl, data);
  return data;
}
