import Image from 'next/image';

const services = [
  { title: "STRATEGY & MARKETING PLAN", image: "https://picsum.photos/300/500" },
  { title: "CREATIVE & PRODUCTION", image: "https://picsum.photos/301/500" },
  { title: "TECHNOLOGY", image: "https://picsum.photos/302/500" },
  { title: "PERFORMANCE MEDIA", image: "https://picsum.photos/303/500" },
  { title: "INFLUENCER MARKETING", image: "https://picsum.photos/304/500" },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 max-w-7xl mx-auto px-6">
      <div className="flex items-center mb-12">
        <h2 className="text-4xl font-bold text-[#D9A384] mr-8">SERVICES</h2>
        <div className="text-xs text-blue-500 max-w-xs border-l-2 border-gray-200 pl-4">
          <p>Simple yet unique.</p>
          <p>This idea is key to helping our your succeed.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {services.map((service, index) => (
          <div key={index} className="relative group h-[400px] overflow-hidden rounded-lg cursor-pointer">
             <Image 
                src={service.image} 
                alt={service.title} 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-slate-700/50 to-transparent">
                <h3 className="text-white font-bold p-6 text-lg leading-tight uppercase relative z-10 w-2/3">
                    {service.title}
                </h3>
             </div>
          </div>
        ))}
      </div>
    </section>
  );
}
