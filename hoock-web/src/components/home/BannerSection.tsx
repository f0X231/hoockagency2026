"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const STRAPI_URL =
  process.env.NEXT_PUBLIC_URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

const SLIDE_INTERVAL = 15000; // 15 วินาที

interface CoverFormat {
  url: string;
  width: number;
  height: number;
}

interface Cover {
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    large?: CoverFormat;
    medium?: CoverFormat;
    small?: CoverFormat;
    thumbnail?: CoverFormat;
  };
}

interface BannerItem {
  id: number;
  documentId: string;
  title: string;
  description: string;
  isStatus: boolean;
  cover: Cover | null;
}

const getImageUrl = (cover: Cover | null): string => {
  if (!cover) return 'https://picsum.photos/1440/892';
  // ใช้ large format ถ้ามี ไม่งั้นใช้ original
  const url = cover.formats?.large?.url ?? cover.url;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
};

export default function BannerSection() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // fetch
  useEffect(() => {
    fetch('/api/banner')
      .then((r) => r.ok ? r.json() : { data: [] })
      .then((json) => {
        const active = (json.data as BannerItem[]).filter((b) => b.isStatus);
        setBanners(active);
      })
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  // slide transition helper
  const goTo = useCallback((index: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 600); // fade duration
  }, []);

  // auto-advance
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % banners.length;
        goTo(next);
        return prev; // goTo handles the actual update
      });
    }, SLIDE_INTERVAL);
  }, [banners.length, goTo]);

  useEffect(() => {
    if (banners.length <= 1) return;
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length, startTimer]);

  const handleDotClick = (index: number) => {
    if (index === current || transitioning) return;
    if (timerRef.current) clearInterval(timerRef.current);
    goTo(index);
    startTimer();
  };

  // hide section when no data
  if (loading || banners.length === 0) return null;

  const banner = banners[current];

  return (
    <section className="relative w-full h-screen min-h-[500px] max-h-[900px] overflow-hidden bg-black">

      {/* ── Cover Image ── */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <Image
          key={banner.id}
          src={getImageUrl(banner.cover)}
          alt={banner.cover?.alternativeText ?? banner.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      {/* ── Text Content ── */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 pb-16 max-w-7xl mx-auto transition-all duration-700 ease-in-out"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(12px)' : 'translateY(0)',
        }}
      >
        <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-lg max-w-2xl">
          {banner.title}
        </h1>
        {banner.description && (
          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl drop-shadow">
            {banner.description}
          </p>
        )}
      </div>

      {/* ── Dot Indicators (แสดงเฉพาะเมื่อมีมากกว่า 1 slide) ── */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="transition-all duration-300 rounded-full focus:outline-none"
              style={{
                width: idx === current ? '24px' : '8px',
                height: '8px',
                backgroundColor: idx === current ? '#fff' : 'rgba(255,255,255,0.45)',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Progress bar ── */}
      {banners.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-10">
          <div
            key={current}
            className="h-full bg-white/60"
            style={{
              animation: `progress ${SLIDE_INTERVAL}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}