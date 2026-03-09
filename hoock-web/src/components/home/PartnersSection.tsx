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

async function getPartners(): Promise<PartnerItem[]> {
  try {
    const STRAPI_URL = process.env.URI_STRAPI || 'http://localhost:1337';
    const res = await fetch(`${STRAPI_URL}/api/partners?populate=*&status=published`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch partners');
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
}

const getImageUrl = (imageProp: StrapiImage[] | StrapiImage | { url: string } | null | undefined): string => {
  if (!imageProp) return "https://picsum.photos/200/50";

  const STRAPI_URL = process.env.URI_STRAPI || 'http://localhost:1337';

  if (Array.isArray(imageProp)) {
    if (imageProp.length === 0) return "https://picsum.photos/200/50";
    
    const url = imageProp[0].url;
    if (!url) return "https://picsum.photos/200/50";

    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }

  if ('url' in imageProp && imageProp.url) {
    return imageProp.url.startsWith('http') ? imageProp.url : `${STRAPI_URL}${imageProp.url}`;
  }

  return "https://picsum.photos/200/50";
};

export default async function PartnersSection() {
  const partners = await getPartners();

  // If we have fewer items, we duplicate them so the scrolling marquee has enough content to loop seamlessly
  const displayPartners = partners.length > 0 
    ? [...partners, ...partners, ...partners] // Duplicate to fill space for seamless scroll
    : [];

  return (
    <section className="py-20 bg-gray-50/50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#1C2329] mb-12">OUR PARTNERS</h2>

        {partners.length === 0 ? (
          <div className="text-center p-8 text-gray-400 border border-gray-200 rounded-lg">
            No partners found or unable to connect to Strapi.
          </div>
        ) : (
          <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee flex items-center gap-16 md:gap-24 whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              {displayPartners.map((partner, idx) => (
                <div key={`${partner.id}-${idx}`} className="relative h-48 w-64 md:w-80 flex-shrink-0 transition-all duration-300">
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
        )}
      </div>

      {/* Tailwind / Raw CSS for the continuous marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); } /* Move exactly one full set of items */
        }
        .animate-marquee {
          /* Adjust duration (e.g., 30s) to make it slower or faster */
          animation: marquee 30s linear infinite;
          width: fit-content;
        }
        
        /* Pause the animation on hover so users can see the colorized logo */
        .group:hover .animate-marquee {
           animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
