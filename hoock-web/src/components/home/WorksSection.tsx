"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface StrapiImage {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string | null;
}

interface WorkItem {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  tags?: string;
  thumbnail?: StrapiImage[] | StrapiImage | { url: string } | null;
}

const STRAPI_URL =
  process.env.NEXT_PUBLIC_URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

const getImageUrl = (imageProp: any): string => {
  if (!imageProp) return 'https://picsum.photos/400/300';
  if (Array.isArray(imageProp)) {
    if (!imageProp.length) return 'https://picsum.photos/400/300';
    const url = imageProp[0]?.url;
    if (!url) return 'https://picsum.photos/400/300';
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  if ('url' in imageProp && imageProp.url) {
    return imageProp.url.startsWith('http') ? imageProp.url : `${STRAPI_URL}${imageProp.url}`;
  }
  if (imageProp.data?.attributes?.url) {
    const url = imageProp.data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  return 'https://picsum.photos/400/300';
};

const getSlug = (work: WorkItem): string =>
  work.title
    ? work.title.trim().toLowerCase().replace(/\s+/g, '-')
    : work.documentId ?? `${work.id}`;

async function fetchWithRetry(url: string, retries = 3, timeoutMs = 20000): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) return res;
      if (res.status < 500) throw new Error(`HTTP ${res.status}`);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (attempt === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt)); // 1s, 2s, 4s
    }
  }
  throw new Error('All retries exhausted');
}

const LIMIT = 5;

// Reusable card component to avoid repetition
function WorkCard({ work }: { work: WorkItem }) {
  return (
    <Link
      href={`/work/${getSlug(work)}`}
      className="relative w-full h-full rounded-2xl overflow-hidden group block shadow-sm hover:shadow-lg transition-all"
    >
      <Image
        src={getImageUrl(work.thumbnail)}
        alt={work.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-white font-bold text-lg px-4 text-center">{work.title}</span>
      </div>
    </Link>
  );
}

export default function WorksSection() {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  const fetchWorks = useCallback(async (currentStart: number, isLoadMore = false) => {
    try {
      isLoadMore ? setLoadingMore(true) : setLoading(true);
      setError(null);

      const url = `${STRAPI_URL}/api/works?populate=*&status=published&sort=updatedAt:desc&pagination[start]=${currentStart}&pagination[limit]=${LIMIT}`;
      const res = await fetchWithRetry(url);
      const json = await res.json();

      const newWorks: WorkItem[] = json.data || [];
      const total: number = json.meta?.pagination?.total ?? 0;

      setWorks((prev) => (isLoadMore ? [...prev, ...newWorks] : newWorks));
      setHasMore(currentStart + LIMIT < total && newWorks.length === LIMIT);
    } catch (err: any) {
      console.error('Works fetch failed:', err);
      setError(
        err?.name === 'AbortError'
          ? 'Request timed out. Strapi may be starting up — please try again in a moment.'
          : 'Could not load works. Please check your Strapi connection.'
      );
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchWorks(0);
  }, [fetchWorks]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const next = startIndex + LIMIT;
    setStartIndex(next);
    fetchWorks(next, true);
  };

  const chunkedWorks: WorkItem[][] = [];
  for (let i = 0; i < works.length; i += 5) {
    chunkedWorks.push(works.slice(i, i + 5));
  }

  return (
    <section id="works" className="py-12 max-w-7xl mx-auto px-6">
      <div className="flex flex-col flex-wrap md:flex-row md:items-center items-start mb-12 gap-4 md:gap-0">
        <h2 className="text-4xl font-bold text-[#D9A384] mr-8">WORKS</h2>
        <div className="text-xs text-blue-500 max-w-sm border-l-2 border-gray-200 pl-4 mt-2 md:mt-0">
          <p>Creative agency driven by fresh ideas, unique approaches,</p>
          <p>and effective solutions.</p>
        </div>
      </div>

      {loading && works.length === 0 ? (
        <div className="text-center p-12 text-gray-400">
          <span className="inline-block animate-spin border-4 border-gray-300 border-t-black rounded-full w-8 h-8 mb-4" />
          <p>Loading works…</p>
        </div>
      ) : error ? (
        <div className="text-center p-12 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchWorks(0)}
            className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : works.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
          No works found.
        </div>
      ) : (
        <div className="space-y-16">
          {chunkedWorks.map((chunk, chunkIndex) => (
            <div key={`chunk-${chunkIndex}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Column 1 — items 0 & 3 */}
              <div className="flex flex-col gap-6">
                {chunk[0] && <div className="relative h-64"><WorkCard work={chunk[0]} /></div>}
                {chunk[3] && <div className="relative h-64"><WorkCard work={chunk[3]} /></div>}
              </div>

              {/* Column 2 — tall center item 1 */}
              {chunk[1] && (
                <div className="relative h-[536px]">
                  <WorkCard work={chunk[1]} />
                </div>
              )}

              {/* Column 3 — items 2 & 4 */}
              <div className="flex flex-col gap-6">
                {chunk[2] && <div className="relative h-64"><WorkCard work={chunk[2]} /></div>}
                {chunk[4] && <div className="relative h-64"><WorkCard work={chunk[4]} /></div>}
              </div>

            </div>
          ))}
        </div>
      )}

      {hasMore && works.length > 0 && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-wide"
          >
            {loadingMore ? (
              <>
                <span className="inline-block animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4" />
                Loading...
              </>
            ) : (
              'See more'
            )}
          </button>
        </div>
      )}
    </section>
  );
}