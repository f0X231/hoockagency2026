"use client";

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface StrapiImage {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string | null;
}

interface WorkDetail {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  tags?: string;
  thumbnail?: StrapiImage[] | StrapiImage | { url: string } | null;
  gallery?: StrapiImage[] | { data: StrapiImage[] } | null;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';
const PLACEHOLDER = '/placeholder.png';

const extractGalleryUrls = (galleryProp: any): string[] => {
  if (!galleryProp) return [];
  let rawArray: any[] = [];
  if (Array.isArray(galleryProp)) rawArray = galleryProp;
  else if (Array.isArray(galleryProp.data)) rawArray = galleryProp.data;
  return rawArray.map((img: any) => {
    const url = img.url ?? img.attributes?.url;
    if (!url) return PLACEHOLDER;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  });
};

function goBackToWorks(router: ReturnType<typeof useRouter>) {
  sessionStorage.setItem('scrollTo', 'works');
  router.push('/');
}

export default function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [work, setWork] = useState<WorkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 9;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const STRAPI_URL = process.env.NEXT_PUBLIC_URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';
        const res = await fetch(`${STRAPI_URL}/api/works?populate=*&status=published&pagination[limit]=100`, {
          next: { revalidate: 3600 }
        });
        if (!res.ok) throw new Error('Failed to fetch works');
        const json = await res.json();
        const works: WorkDetail[] = json.data || [];
        const decodedSlug = decodeURIComponent(slug);
        const matched = works.find(w => {
          const generatedSlug = w.title
            ? w.title.trim().toLowerCase().replace(/\s+/g, '-')
            : w.documentId || `${w.id}`;
          return generatedSlug === decodedSlug || generatedSlug === slug || encodeURIComponent(generatedSlug) === slug;
        });
        setWork(matched || null);
      } catch (error) {
        console.error('Error fetching work details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWork();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 pb-24 text-gray-400">
        <span className="inline-block animate-spin border-4 border-gray-200 border-t-black rounded-full w-12 h-12 mb-4" />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-[#1C2329] pt-32">
        <h1 className="text-4xl font-bold mb-4">Work Not Found</h1>
        <p className="text-gray-500 mb-8">The project you are looking for does not exist.</p>
        <button
          onClick={() => goBackToWorks(router)}
          className="px-6 py-3 bg-[#1C2329] text-white font-semibold rounded hover:bg-[#D9A384] transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const renderTags = () => {
    if (!work.tags) return null;
    return work.tags.split(',').map((tag, idx) => (
      <span key={idx} className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full mr-2 mb-2 border border-gray-200 uppercase tracking-wide">
        {tag.trim()}
      </span>
    ));
  };

  const allGalleryImages = extractGalleryUrls(work.gallery);
  const totalPages = Math.ceil(allGalleryImages.length / imagesPerPage);
  const currentImages = allGalleryImages.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage);

  return (
    <article className="min-h-screen bg-white pb-24 pt-32">
      <div className="max-w-7xl mx-auto px-6">

        {/* Back Link — uses router + sessionStorage scroll intent */}
        <button
          onClick={() => goBackToWorks(router)}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#D9A384] mb-8 transition-colors uppercase tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Works
        </button>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1C2329] leading-tight mb-6">
          {work.title}
        </h1>

        <div className="flex flex-wrap items-center mb-16">
          {renderTags()}
        </div>

        {allGalleryImages.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentImages.map((src, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all"
                  onClick={() => setSelectedPhoto(src)}
                >
                  <Image src={src} alt={`Gallery Image ${idx + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-12">
                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="p-2 rounded-full border border-gray-300 disabled:opacity-30 hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <span className="text-gray-500 font-medium">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="p-2 rounded-full border border-gray-300 disabled:opacity-30 hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {work.description && (
          <div className="mt-20 border-t border-gray-200 pt-16">
            <h3 className="text-2xl font-bold text-[#1C2329] mb-8">About The Project</h3>
            <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
              {work.description}
            </div>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setSelectedPhoto(null)}
        >
          <button onClick={() => setSelectedPhoto(null)} className="absolute top-6 right-6 text-white hover:text-gray-300 z-[110]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-6xl max-h-[90vh] aspect-video sm:aspect-auto sm:h-full flex items-center justify-center pointer-events-none">
            <Image src={selectedPhoto} alt="Popup detail" fill className="object-contain pointer-events-auto" sizes="100vw" priority />
          </div>
        </div>
      )}
    </article>
  );
}