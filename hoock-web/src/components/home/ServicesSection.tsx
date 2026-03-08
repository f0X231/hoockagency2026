import Image from 'next/image';

// Types expected from Strapi
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
}

async function getServices(): Promise<ServiceItem[]> {
  try {
    const STRAPI_URL = process.env.URI_STRAPI || 'http://localhost:1337';
    const res = await fetch(`${STRAPI_URL}/api/services?populate=*&status=published`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch services');
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

const getImageUrl = (imageProp: StrapiImage[] | StrapiImage | { url: string } | null | undefined): string => {
  if (!imageProp) return "https://picsum.photos/300/500";

  const STRAPI_URL = process.env.URI_STRAPI || 'http://localhost:1337';

  if (Array.isArray(imageProp)) {
    if (imageProp.length === 0) return "https://picsum.photos/300/500";
    
    const url = imageProp[0].url;
    if (!url) return "https://picsum.photos/300/500";

    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }

  if ('url' in imageProp && imageProp.url) {
    return imageProp.url.startsWith('http') ? imageProp.url : `${STRAPI_URL}/${imageProp.url}`;
  }

  return "https://picsum.photos/300/500";
};

export default async function ServicesSection() {
  const services = await getServices();

  return (
    <section id="services" className="py-20 max-w-7xl mx-auto px-6">
      <div className="flex items-center mb-12">
        <h2 className="text-4xl font-bold text-[#D9A384] mr-8">SERVICES</h2>
        <div className="text-xs text-blue-500 max-w-xs border-l-2 border-gray-200 pl-4">
          <p>Simple yet unique.</p>
          <p>This idea is key to helping our your succeed.</p>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="text-center p-10 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          <p className="font-semibold text-lg mb-2">No services found.</p>
          <p className="text-sm">Please ensure your Strapi server is running at {process.env.URI_STRAPI || 'http://localhost:1337'}</p>
          <p className="text-sm mt-1">and you have published Services content accessible via API.</p>
        </div>
      ) : (
        /* Use flex container instead of grid so items can expand their width smoothly */
        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[500px]">
          {services.map((service, index) => (
            <div 
              key={service.id || index} 
              className="relative group overflow-hidden rounded-lg cursor-pointer transform-gpu transition-all duration-500 ease-in-out h-[300px] lg:h-full flex-1 hover:flex-[2]"
            >
               {/* Background Image */}
               <Image 
                  src={getImageUrl(service.image)} 
                  alt={service.title || 'Service Image'} 
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
               />
               
               {/* Overlay Gradients */}
               {/* Top gradient for title readability */}
               <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent"></div>
               {/* Bottom gradient for description readability */}
               <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

               {/* Title at top */}
               <div className="absolute top-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg lg:text-xl leading-tight uppercase w-full">
                      {service.title}
                  </h3>
               </div>

               {/* Description at bottom */}
               <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                 <p className="text-white/90 text-sm lg:text-base leading-relaxed line-clamp-4">
                   {service.description}
                 </p>
               </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
