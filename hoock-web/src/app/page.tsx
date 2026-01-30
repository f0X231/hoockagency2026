import ServicesSection from "@/components/home/ServicesSection";
import WorksSection from "@/components/home/WorksSection";
import PartnersSection from "@/components/home/PartnersSection";
import ArticleSection from "@/components/home/ArticleSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 
        Note: The design shows "Services" as the first major section after the header/navbar area.
        The top area acts as a hero/introduction. 
        Based on the provided image, the 'Services' section is the most prominent top element.
        I will render them in order.
      */}
      
      <ServicesSection />
      
      <WorksSection />
      
      <PartnersSection />
      
      <ArticleSection />
      
    </main>
  );
}
