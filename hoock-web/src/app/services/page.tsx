import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import ServiceCard from "@/components/ui/ServiceCard";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services | HOOCK Agency",
  description: "Simple yet unique, This idea is key to helping your succeed.",
};

const services = [
  {
    title: "Strategy & Marketing Plan",
    imageSrc: "/services/strategy.png",
    imageAlt: "Strategic planning with pen and notebook",
  },
  {
    title: "Creative & Production",
    imageSrc: "/services/creative.png",
    imageAlt: "Professional cinema camera for creative production",
  },
  {
    title: "Technology",
    imageSrc: "/services/technology.png",
    imageAlt: "Person experiencing virtual reality technology",
  },
  {
    title: "Performance Media",
    imageSrc: "/services/performance.png",
    imageAlt: "Digital devices showing analytics dashboards",
  },
];

export default function ServicesPage() {
  return (
    <div className={styles.container}>
      <Header />
      
      <section className={styles.hero}>
        <h1 className={styles.heading}>Services</h1>
        <div className={styles.tagline}>
          <p className={styles.taglineText}>
            Simple yet unique, This idea is key to helping your succeed.
          </p>
        </div>
      </section>

      <section className={styles.cardsGrid}>
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            imageSrc={service.imageSrc}
            imageAlt={service.imageAlt}
          />
        ))}
      </section>
    </div>
  );
}
