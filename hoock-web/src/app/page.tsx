import ServicesSection from "@/components/home/ServicesSection";
import WorksSection from "@/components/home/WorksSection";
import PartnersSection from "@/components/home/PartnersSection";
import ArticleSection from "@/components/home/ArticleSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ServicesSection />
      <WorksSection />
      <PartnersSection />
      <ArticleSection />
    </main>
  );
}
