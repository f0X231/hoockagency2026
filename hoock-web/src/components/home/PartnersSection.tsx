import Image from 'next/image';

const partners = [
    { name: "Kubota", logo: "https://picsum.photos/200/50" }, // Placeholder sizes suited for logos
    { name: "SkyCoachMam", logo: "https://picsum.photos/201/50" },
    { name: "OPTIMUM", logo: "https://picsum.photos/202/50" },
    { name: "Me-O", logo: "https://picsum.photos/203/60" } // A bit taller perhaps
];

export default function PartnersSection() {
  return (
    <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#1C2329] mb-12">OUR PARTNERS</h2>
            
            <div className="flex flex-wrap items-center justify-between gap-8 md:gap-16 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {partners.map((partner, idx) => (
                    <div key={idx} className="relative h-16 w-32 md:w-48">
                         <Image 
                            src={partner.logo} 
                            alt={partner.name} 
                            fill 
                            className="object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
}
