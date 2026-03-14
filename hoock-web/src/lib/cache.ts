
export function isNocacheRequest(): boolean { return false; }
export function getCache<T>(_url: string): T | null { return null; }
export function setCache<T>(_url: string, _data: T): void {}
export function clearCache(_url: string): void {}

export async function cachedFetch<T = unknown>(
  apiUrl: string,
  fetchFn: (url: string) => Promise<T>
): Promise<T> {
  return fetchFn(apiUrl);
}
