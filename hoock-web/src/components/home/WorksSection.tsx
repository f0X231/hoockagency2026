"use client";

import { useState, useEffect } from 'react';
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

const getImageUrl = (imageProp: any): string => {
  if (!imageProp) return "https://picsum.photos/400/300";

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

  if (imageProp.data?.attributes?.url) { 
    const url = imageProp.data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }

  return "https://picsum.photos/400/300";
};

// Generates a URL-friendly slug from the title
const getSlug = (work: WorkItem): string => {
  return work.title 
    ? work.title.trim().toLowerCase().replace(/\s+/g, '-') 
    : work.documentId || `${work.id}`;
};

export default function WorksSection() {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [start, setStart] = useState(0);
  const limit = 5; // Load 5 at a time to match the masonry design

  const fetchWorks = async (currentStart: number, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const STRAPI_URL = process.env.NEXT_PUBLIC_URI_STRAPI || process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';
      const url = `${STRAPI_URL}/api/works?populate=*&status=published&sort=updatedAt:desc&pagination[start]=${currentStart}&pagination[limit]=${limit}`;
      
      const res = await fetch(url, { 
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 3600 }
      });
      
      if (!res.ok) throw new Error('Failed to fetch works');

      const json = await res.json();
      const newWorks: WorkItem[] = json.data || [];
      const total = json.meta?.pagination?.total || 0;

      if (isLoadMore) {
        setWorks(prev => [...prev, ...newWorks]);
      } else {
        setWorks(newWorks);
      }

      // Check if we fetched all available works
      if (currentStart + limit >= total || newWorks.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching works:', error);
      setHasMore(false); 
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchWorks(0);
  }, []);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextStart = start + limit;
    setStart(nextStart);
    fetchWorks(nextStart, true);
  };

  // The design requires blocks of 5 items per "row" layout
  // We chunk the array into arrays of 5 and render the masonry grid for each chunk
  const chunkedWorks = [];
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
          <span className="inline-block animate-spin border-4 border-gray-300 border-t-black rounded-full w-8 h-8 mb-4"></span>
          <p>Loading works...</p>
        </div>
      ) : works.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
          No works found.
        </div>
      ) : (
        <div className="space-y-16">
          {chunkedWorks.map((chunk, chunkIndex) => (
             <div key={`chunk-${chunkIndex}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
             
               {/* Column 1 (Items 0 and 3) */}
               <div className="flex flex-col gap-6">
                 {chunk[0] && (
                   <Link href={`/work/${getSlug(chunk[0])}`} className="relative h-64 rounded-2xl overflow-hidden group block shadow-sm hover:shadow-lg transition-all">
                     <Image src={getImageUrl(chunk[0].thumbnail)} alt={chunk[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold text-lg px-4 text-center">{chunk[0].title}</span>
                     </div>
                   </Link>
                 )}
                 {chunk[3] && (
                   <Link href={`/work/${getSlug(chunk[3])}`} className="relative h-64 rounded-2xl overflow-hidden group block shadow-sm hover:shadow-lg transition-all">
                     <Image src={getImageUrl(chunk[3].thumbnail)} alt={chunk[3].title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold text-lg px-4 text-center">{chunk[3].title}</span>
                     </div>
                   </Link>
                 )}
               </div>
               
               {/* Column 2 - Center Tall Item (Item 1) */}
               {chunk[1] && (
                 <Link href={`/work/${getSlug(chunk[1])}`} className="relative h-[536px] rounded-2xl overflow-hidden group block shadow-sm hover:shadow-lg transition-all">
                   <Image src={getImageUrl(chunk[1].thumbnail)} alt={chunk[1].title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold text-2xl px-6 text-center">{chunk[1].title}</span>
                     </div>
                 </Link>
               )}
   
               {/* Column 3 (Items 2 and 4) */}
               <div className="flex flex-col gap-6">
                 {chunk[2] && (
                   <Link href={`/work/${getSlug(chunk[2])}`} className="relative h-64 rounded-2xl overflow-hidden group block shadow-sm hover:shadow-lg transition-all">
                     <Image src={getImageUrl(chunk[2].thumbnail)} alt={chunk[2].title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold text-lg px-4 text-center">{chunk[2].title}</span>
                     </div>
                   </Link>
                 )}
                 {chunk[4] && (
                   <Link href={`/work/${getSlug(chunk[4])}`} className="relative h-64 rounded-2xl overflow-hidden group block shadow-sm hover:shadow-lg transition-all">
                     <Image src={getImageUrl(chunk[4].thumbnail)} alt={chunk[4].title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold text-lg px-4 text-center">{chunk[4].title}</span>
                     </div>
                   </Link>
                 )}
               </div>
   
             </div>
          ))}
        </div>
      )}
      
      {/* Search More button */}
      {hasMore && works.length > 0 && (
         <div className="mt-16 flex justify-center">
           <button 
             onClick={handleLoadMore}
             disabled={loadingMore}
             className="px-8 py-3 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-wide"
           >
              {loadingMore ? (
                <>
                  <span className="inline-block animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4"></span>
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
