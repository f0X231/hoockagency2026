"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const STRAPI_URL =
  process.env.NEXT_PUBLIC_URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

const SLIDE_INTERVAL = 15000;

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
  const url = cover.formats?.large?.url ?? cover.url;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
};

export default function BannerSection() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const goTo = useCallback((index: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 600);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % banners.length;
        goTo(next);
        return prev;
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

  if (loading || banners.length === 0) return null;

  const banner = banners[current];

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black">

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
      </div>

      <div
        className="absolute inset-0 flex items-center"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <div
            style={{
              display: 'inline-block',
              maxWidth: '560px',
              marginLeft: '2rem',
            }}
          >
            {banner.title && (
              <h1
                style={{
                  color: '#000000',
                  fontSize: 'clamp(1.9rem, 3.9vw, 3.1rem)',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  marginBottom: '16px',
                }}
              >
                {banner.title}
              </h1>
            )}
            {banner.description && (
              <p
                style={{
                  color: '#000000',
                  fontSize: 'clamp(1.1rem, 1.95vw, 1.32rem)',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {banner.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Dot Indicators ── */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
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