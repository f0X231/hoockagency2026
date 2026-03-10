"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  // Handle both potential field names for the cover image
  thumbnail?: StrapiImage[] | StrapiImage | { url: string } | null;
  image?: StrapiImage[] | StrapiImage | { url: string } | null;
}

// Reusable function to extract image URL
const getImageUrl = (imageProp: any): string => {
  if (!imageProp) return "https://picsum.photos/400/300";

  // Use NEXT_PUBLIC_URI_STRAPI since this is a Client Component
  const STRAPI_URL = process.env.NEXT_PUBLIC_URI_STRAPI || process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

  if (Array.isArray(imageProp)) {
    if (imageProp.length === 0) return "https://picsum.photos/400/300";
    const url = imageProp[0].url;
    if (!url) return "https://picsum.photos/400/300";
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }

  if ('url' in imageProp && imageProp.url) {
    return imageProp.url.startsWith('http') ? imageProp.url : `${STRAPI_URL}${imageProp.url}`;
  }

  if (imageProp.data?.attributes?.url) { // Fallback for deeply nested Strapi v4
    const url = imageProp.data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }

  return "https://picsum.photos/400/300";
};

// Formatter for display dates
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function ArticleSection() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [start, setStart] = useState(0);
  const limit = 3;

  const fetchArticles = async (currentStart: number, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const STRAPI_URL = process.env.NEXT_PUBLIC_URI_STRAPI || process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';
      // Fetch URL including pagination and ordering by updatedAt:desc
      const url = `${STRAPI_URL}/api/articles?populate=*&status=published&sort=updatedAt:desc&pagination[start]=${currentStart}&pagination[limit]=${limit}`;
      
      const res = await fetch(url, { 
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 3600 }
      });
      
      if (!res.ok) throw new Error('Failed to fetch articles');

      const json = await res.json();
      const newArticles = json.data || [];
      const total = json.meta?.pagination?.total || 0;

      if (isLoadMore) {
        setArticles(prev => [...prev, ...newArticles]);
      } else {
        setArticles(newArticles);
      }

      // Check if we fetched all available articles
      if (currentStart + limit >= total || newArticles.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setHasMore(false); // Stop trying to load more if it fails
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchArticles(0);
  }, []);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextStart = start + limit;
    setStart(nextStart);
    fetchArticles(nextStart, true);
  };

  return (
    <section id="article" className="py-20 bg-[#54626F] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12">ARTICLE</h2>

        {loading && articles.length === 0 ? (
          <div className="text-center p-12 text-gray-300">
            <span className="inline-block animate-spin border-4 border-gray-400 border-t-white rounded-full w-8 h-8 mb-4"></span>
            <p>Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center p-12 bg-white/5 rounded-lg border border-white/10">
            <p>No articles found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => {
              // Ensure we fallback between possible image field names
              const imageUrl = getImageUrl(article.thumbnail || article.image);

              // Create a URL-friendly slug from the title (replace spaces with hyphens, lowercase)
              const titleSlug = article.title 
                ? article.title.trim().toLowerCase().replace(/\s+/g, '-') 
                : article.documentId || article.id?.toString();

              return (
                <Link 
                  href={`/article/${titleSlug}`} 
                  key={`article-${article.id}`} 
                  className="group bg-white/10 p-6 rounded-lg backdrop-blur-sm flex flex-col md:flex-row gap-6 hover:bg-white/20 transition-all cursor-pointer block border border-transparent hover:border-white/10"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-64 h-40 flex-shrink-0 rounded-md overflow-hidden bg-gray-800">
                    <Image 
                      src={imageUrl} 
                      alt={article.title || 'Article Thumbnail'} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col justify-center w-full">
                    {/* Use publishedAt or fallback to updatedAt */}
                    <span className="text-xs text-gray-300 mb-2 tracking-wide font-medium">
                      {formatDate(article.publishedAt || article.updatedAt)}
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

        {/* Load More Button */}
        {hasMore && articles.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-transparent border-2 border-white/50 text-white rounded hover:bg-white hover:text-[#54626F] transition-all font-semibold uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loadingMore ? (
                <>
                  <span className="inline-block animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4"></span>
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
