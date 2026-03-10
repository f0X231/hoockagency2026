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

const STRAPI_URL = process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

async function fetchWithRetry(url: string, retries = 3, timeoutMs = 20000): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
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

async function getServices(): Promise<ServiceItem[]> {
  try {
    const res = await fetchWithRetry(
      `${STRAPI_URL}/api/services?populate=*&status=published`
    );
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn('Error fetching services:', error);
    return [];
  }
}

const getImageUrl = (imageProp: StrapiImage[] | StrapiImage | { url: string } | null | undefined): string => {
  if (!imageProp) return 'https://picsum.photos/300/500';
  if (Array.isArray(imageProp)) {
    if (!imageProp.length) return 'https://picsum.photos/300/500';
    const url = imageProp[0]?.url;
    if (!url) return 'https://picsum.photos/300/500';
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  if ('url' in imageProp && imageProp.url) {
    // Fixed: removed spurious trailing slash before imageProp.url
    return imageProp.url.startsWith('http') ? imageProp.url : `${STRAPI_URL}${imageProp.url}`;
  }
  return 'https://picsum.photos/300/500';
};

export default async function ServicesSection() {
  const services = await getServices();

  return (
    <section id="services" className="py-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-center items-start mb-12 gap-4 md:gap-0">
        <h2 className="text-4xl font-bold text-[#D9A384] mr-8">SERVICES</h2>
        <div className="text-xs text-blue-500 max-w-xs border-l-2 border-gray-200 pl-4 mt-2 md:mt-0">
          <p>Simple yet unique.</p>
          <p>This idea is key to helping our your succeed.</p>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="text-center p-10 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          <p className="font-semibold text-lg mb-2">No services found.</p>
          <p className="text-sm">Please ensure your Strapi server is running at {STRAPI_URL}</p>
          <p className="text-sm mt-1">and you have published Services content accessible via API.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row gap-4 h-auto lg:h-[500px]">
          {services.map((service, index) => {
            const desktopImgUrl = getImageUrl(service.image);
            const mobileImgUrl = service.imagemobile ? getImageUrl(service.imagemobile) : desktopImgUrl;

            return (
              <div
                key={service.id ?? index}
                className="relative group overflow-hidden rounded-lg transform-gpu transition-all duration-500 ease-in-out aspect-video lg:aspect-auto lg:h-full lg:flex-1 lg:hover:flex-[2] cursor-default lg:cursor-pointer"
              >
                {/* Mobile / Tablet image */}
                <Image
                  src={mobileImgUrl}
                  alt={service.title || 'Service Image'}
                  fill
                  className="object-cover lg:hidden"
                />

                {/* Desktop image */}
                <Image
                  src={desktopImgUrl}
                  alt={service.title || 'Service Image'}
                  fill
                  className="object-cover hidden lg:block transition-transform duration-700 ease-out lg:group-hover:scale-110"
                />

                {/* Top gradient */}
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent" />
                {/* Bottom gradient — desktop only */}
                <div className="hidden lg:block absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Title */}
                <div className="absolute top-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg lg:text-xl leading-tight uppercase w-full drop-shadow-md">
                    {service.title}
                  </h3>
                </div>

                {/* Description — desktop hover only */}
                <div className="hidden lg:block absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <p className="text-white/90 text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
