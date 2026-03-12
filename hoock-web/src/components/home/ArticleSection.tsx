"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cachedFetch } from '@/lib/cache';

interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
}

interface ArticleItem {
  id: number;
  documentId: string;
  title: string;
  updatedAt: string;
  publishedAt: string;
  thumbnail?: StrapiImage[] | StrapiImage | { url: string } | null;
  image?: StrapiImage[] | StrapiImage | { url: string } | null;
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
    return imageProp.url.startsWith('http')
      ? imageProp.url
      : `${STRAPI_URL}${imageProp.url}`;
  }
  if (imageProp.data?.attributes?.url) {
    const url = imageProp.data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  return 'https://picsum.photos/400/300';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

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
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
  throw new Error('All retries exhausted');
}

const LIMIT = 3;

export default function ArticleSection() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  const fetchArticles = useCallback(async (currentStart: number, isLoadMore = false) => {
    try {
      isLoadMore ? setLoadingMore(true) : setLoading(true);
      setError(null);

      const apiUrl = `/api/articles?start=${currentStart}&limit=${LIMIT}`;

      const json = await cachedFetch<{ data: ArticleItem[]; meta: { pagination: { total: number } } }>(
        apiUrl,
        async (url) => {
          const res = await fetchWithRetry(url);
          return res.json();
        }
      );

      const newArticles: ArticleItem[] = json.data || [];
      const total: number = json.meta?.pagination?.total ?? 0;

      setArticles((prev) => isLoadMore ? [...prev, ...newArticles] : newArticles);
      setHasMore(currentStart + LIMIT < total && newArticles.length === LIMIT);
    } catch (err: any) {
      console.error('Article fetch failed:', err);
      setError(
        err?.name === 'AbortError'
          ? 'Request timed out — please try again in a moment.'
          : 'Could not load articles. Please try again later.'
      );
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles(0);
  }, [fetchArticles]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const next = startIndex + LIMIT;
    setStartIndex(next);
    fetchArticles(next, true);
  };

  return (
    <section id="article" className="py-20 bg-[#54626F] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12">ARTICLE</h2>

        {loading && articles.length === 0 ? (
          <div className="text-center p-12 text-gray-300">
            <span className="inline-block animate-spin border-4 border-gray-400 border-t-white rounded-full w-8 h-8 mb-4" />
            <p>Loading articles…</p>
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-white/5 rounded-lg border border-white/10">
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => fetchArticles(0)}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center p-12 bg-white/5 rounded-lg border border-white/10">
            <p>No articles found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => {
              const imageUrl = getImageUrl(article.thumbnail ?? article.image);
              const titleSlug = article.title
                ? article.title.trim().toLowerCase().replace(/\s+/g, '-')
                : article.documentId ?? article.id?.toString();

              return (
                <Link
                  href={`/article/${titleSlug}`}
                  key={`article-${article.id}`}
                  className="group bg-white/10 p-6 rounded-lg backdrop-blur-sm flex flex-col md:flex-row gap-6 hover:bg-white/20 transition-all cursor-pointer block border border-transparent hover:border-white/10"
                >
                  <div className="relative w-full md:w-64 h-40 flex-shrink-0 rounded-md overflow-hidden bg-gray-800">
                    <Image
                      src={imageUrl}
                      alt={article.title ?? 'Article Thumbnail'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="flex flex-col justify-center w-full">
                    <span className="text-xs text-gray-300 mb-2 tracking-wide font-medium">
                      {formatDate(article.publishedAt ?? article.updatedAt)}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold leading-snug mb-4 text-white group-hover:text-[#D9A384] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <span className="mt-auto text-xs text-[#D9A384] font-medium uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform w-[max-content]">
                      View More
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {hasMore && articles.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-transparent border-2 border-white/50 text-white rounded hover:bg-white hover:text-[#54626F] transition-all font-semibold uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loadingMore ? (
                <>
                  <span className="inline-block animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}