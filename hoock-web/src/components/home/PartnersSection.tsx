"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
}

interface PartnerItem {
  id: number;
  documentId: string;
  name: string;
  logo: StrapiImage[] | StrapiImage | { url: string } | null;
}

const STRAPI_URL =
  process.env.NEXT_PUBLIC_URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

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

const getImageUrl = (
  imageProp: StrapiImage[] | StrapiImage | { url: string } | null | undefined
): string => {
  if (!imageProp) return 'https://picsum.photos/200/50';
  if (Array.isArray(imageProp)) {
    if (!imageProp.length) return 'https://picsum.photos/200/50';
    const url = imageProp[0]?.url;
    if (!url) return 'https://picsum.photos/200/50';
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  if ('url' in imageProp && imageProp.url) {
    return imageProp.url.startsWith('http') ? imageProp.url : `${STRAPI_URL}${imageProp.url}`;
  }
  return 'https://picsum.photos/200/50';
};

export default function PartnersSection() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPartners() {
      try {
        // ✅ เรียกผ่าน Next.js API route แทน Strapi โดยตรง
        const res = await fetchWithRetry('/api/partners');
        const json = await res.json();
        setPartners(json.data || []);
      } catch (error) {
        console.warn('Error fetching partners:', error);
        setPartners([]);
      } finally {
        setLoading(false);
      }
    }

    loadPartners();
  }, []);

  // ✅ Hide section ระหว่าง loading และเมื่อไม่มีข้อมูล
  if (loading || partners.length === 0) return null;

  const displayPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-20 bg-gray-50/50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-[#D9A384] mb-12">OUR PARTNERS</h2>

        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee flex items-center gap-16 md:gap-24 whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {displayPartners.map((partner, idx) => (
              <div
                key={`${partner.id}-${idx}`}
                className="relative h-48 w-64 md:w-80 flex-shrink-0 transition-all duration-300"
              >
                <Image
                  src={getImageUrl(partner.logo)}
                  alt={partner.name || `Partner ${idx}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: fit-content;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}