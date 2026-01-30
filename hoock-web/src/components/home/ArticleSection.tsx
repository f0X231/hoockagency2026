import Link from 'next/link';
import Image from 'next/image';

const articles = [
  {
    id: 1,
    date: "June 2, 2025",
    title: "HOOCK AGENCY ครบจบทุกความต้องการด้านการตลาดออนไลน์",
    image: "https://picsum.photos/400/300",
  },
  {
    id: 2,
    date: "June 1, 2025",
    title: "ยิงโฆษณาให้ได้ยอดขาย ไม่ใช่ใครก็ทำได้ สร้างยอดขายให้ปังโดย HOOCK AGENCY",
    image: "https://picsum.photos/401/300",
  },
  {
    id: 3,
    date: "May 30, 2025",
    title: "โฆษณาออนไลน์ จะช่วยให้แบรนด์ของคุณเติบโตได้อย่างไร",
    image: "https://picsum.photos/402/300",
  }
];

export default function ArticleSection() {
  return (
    <section id="article" className="py-20 bg-[#54626F] text-white"> {/* Dark background based on design */}
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12">ARTICLE</h2>

        <div className="space-y-6">
            {articles.map((article) => (
                <div key={article.id} className="group bg-white/10 p-6 rounded-lg backdrop-blur-sm flex flex-col md:flex-row gap-6 hover:bg-white/20 transition-colors cursor-pointer">
                    <div className="relative w-full md:w-64 h-40 flex-shrink-0 rounded-md overflow-hidden">
                        <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex flex-col justify-center">
                        <span className="text-xs text-gray-300 mb-2">{article.date}</span>
                        <h3 className="text-xl font-bold leading-snug mb-4">{article.title}</h3>
                        <span className="text-xs text-[#D9A384] font-medium uppercase tracking-wide group-hover:underline">View More</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
