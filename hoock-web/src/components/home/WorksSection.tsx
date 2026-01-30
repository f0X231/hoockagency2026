import Image from 'next/image';

const works = [
    { id: 1, image: "https://picsum.photos/400/300" },
    { id: 2, image: "https://picsum.photos/401/400" }, // Taller for masonry-like effect
    { id: 3, image: "https://picsum.photos/400/301" },
    { id: 4, image: "https://picsum.photos/400/302" },
    { id: 5, image: "https://picsum.photos/402/300" },
];

export default function WorksSection() {
  return (
    <section id="works" className="py-12 max-w-7xl mx-auto px-6">
      <div className="flex items-center mb-12">
        <h2 className="text-4xl font-bold text-[#D9A384] mr-8">WORKS</h2>
         <div className="text-xs text-blue-500 max-w-sm border-l-2 border-gray-200 pl-4">
          <p>Creative agency driven by fresh ideas, unique approaches,</p>
          <p>and effective solutions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* Manually placing items to mimic the masonry/grid layout in design */}
          <div className="flex flex-col gap-6">
              <div className="relative h-64 rounded-2xl overflow-hidden">
                   <Image src={works[0].image} alt="Work 1" fill className="object-cover" />
              </div>
               <div className="relative h-64 rounded-2xl overflow-hidden">
                   <Image src={works[3].image} alt="Work 4" fill className="object-cover" />
              </div>
          </div>
          
           <div className="relative h-[536px] rounded-2xl overflow-hidden"> {/* Center Tall Item */}
                <Image src={works[1].image} alt="Work 2" fill className="object-cover" />
           </div>

            <div className="flex flex-col gap-6">
              <div className="relative h-64 rounded-2xl overflow-hidden">
                   <Image src={works[2].image} alt="Work 3" fill className="object-cover" />
              </div>
               <div className="relative h-64 rounded-2xl overflow-hidden">
                   <Image src={works[4].image} alt="Work 5" fill className="object-cover" />
              </div>
          </div>
      </div>
      
      <div className="mt-12 flex justify-center">
        <button className="px-8 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors">
            See more
        </button>
      </div>
    </section>
  );
}
