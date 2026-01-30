import Image from "next/image";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
}

export default function ServiceCard({ title, imageSrc, imageAlt }: ServiceCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.imageContainer}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
    </div>
  );
}
