"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
}

interface ServiceItem {
  id: number;
  documentId: string;
  title: string;
  description: string;
  image: StrapiImage[] | StrapiImage | { url: string } | null;
  imagefull: StrapiImage[] | StrapiImage | { url: string } | null;
  imagemobile?: StrapiImage[] | StrapiImage | { url: string } | null;
}

const STRAPI_URL =
  process.env.NEXT_PUBLIC_URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

const getImageUrl = (imageProp: any): string => {
  if (!imageProp) return 'https://picsum.photos/300/500';
  if (Array.isArray(imageProp)) {
    if (!imageProp.length) return 'https://picsum.photos/300/500';
    const url = imageProp[0]?.url;
    if (!url) return 'https://picsum.photos/300/500';
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  if ('url' in imageProp && imageProp.url) {
    return imageProp.url.startsWith('http') ? imageProp.url : `${STRAPI_URL}${imageProp.url}`;
  }
  return 'https://picsum.photos/300/500';
};

export default function ServicesSection() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setServices(json.data || []);
    } catch (err) {
      console.error('Services fetch failed:', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (loading || services.length === 0) return null;

  return (
    <section id="services" className="py-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-center items-start mb-12 gap-4 md:gap-0">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#CBA68B] mr-8 font-heading tracking-wider">SERVICES</h2>
        <div className="text-base text-[#6386A3] max-w-xs border-l-2 border-gray-200 pl-4 mt-2 md:mt-0">
          <p>Simple yet unique.</p>
          <p>This idea is key to helping our your succeed.</p>
        </div>
      </div>

      {/* ── Mobile / Tablet: grid layout (ไม่เปลี่ยน) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {services.map((service, index) => {
          const desktopImgUrl = getImageUrl(service.image);
          const mobileImgUrl = service.imagemobile
            ? getImageUrl(service.imagemobile)
            : desktopImgUrl;

          return (
            <div
              key={service.id ?? index}
              className="relative overflow-hidden rounded-lg aspect-video"
            >
              <Image
                src={mobileImgUrl}
                alt={service.title || 'Service Image'}
                fill
                className="object-cover"
              />
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent" />
              <div className="absolute top-0 left-0 right-0 p-6">
                <h3 className="text-white font-bold text-lg leading-tight uppercase drop-shadow-md">
                  {service.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Desktop: accordion flex layout ── */}
      <div className="hidden lg:flex flex-row gap-4 h-[500px]">
        {services.map((service, index) => {
          const isActive = index === activeIndex;
          const imgUrl = getImageUrl(service.image);

          return (
            <div
              key={service.id ?? index}
              onMouseEnter={() => setActiveIndex(index)}
              className="relative overflow-hidden rounded-lg cursor-pointer transform-gpu"
              style={{
                flex: isActive ? '3 1 0%' : '1 1 0%',
                transition: 'flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: 0,
              }}
            >
              {/* Image */}
              <Image
                src={imgUrl}
                alt={service.title || 'Service Image'}
                fill
                className="object-cover"
                style={{
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.7s ease-out',
                }}
              />

              {/* Gradient overlays */}
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent" />
              <div
                className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }}
              />

              {/* Active highlight bar — เส้นสีเหลือมด้านล่าง */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-[#CBA68B]"
                style={{
                  transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 0.4s ease',
                  transformOrigin: 'left',
                }}
              />

              {/* Title — แสดงเสมอ */}
              <div className="absolute top-0 left-0 right-0 p-6">
                <h3
                  className="text-white font-bold leading-tight uppercase drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{
                    fontSize: isActive ? '1.25rem' : '1rem',
                    transition: 'font-size 0.4s ease',
                  }}
                >
                  {service.title}
                </h3>
              </div>

              {/* Description — fade in เมื่อ active */}
              <div
                className="absolute bottom-0 left-0 right-0 p-6"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
                }}
              >
                <p className="text-white/90 text-base leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}