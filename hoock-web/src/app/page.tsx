import { Suspense } from "react";
import ServicesSection from "@/components/home/ServicesSection";
import WorksSection from "@/components/home/WorksSection";
import PartnersSection from "@/components/home/PartnersSection";
import ArticleSection from "@/components/home/ArticleSection";
import BannerSection from "@/components/home/BannerSection";

const SectionSkeleton = ({ color = "border-t-[#D9A384]", label }: { color?: string; label: string }) => (
  <section className="py-20 h-[400px] flex items-center justify-center bg-gray-50/50 animate-pulse rounded-lg mt-10">
    <div className="flex flex-col items-center gap-4">
      <div className={`w-10 h-10 border-4 border-gray-300 ${color} rounded-full animate-spin`} />
      <p className="text-gray-500 font-medium">{label}</p>
    </div>
  </section>
);

export default function Home() {
  return (
    <main className="min-h-screen">
      <BannerSection /> 
      
      <Suspense fallback={<SectionSkeleton color="border-t-[#D9A384]" label="Loading Services..." />}>
        <ServicesSection />
      </Suspense>

      <WorksSection />

      <Suspense fallback={<SectionSkeleton color="border-t-gray-600" label="Loading Partners..." />}>
        <PartnersSection />
      </Suspense>

      <ArticleSection />
    </main>
  );
}