import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/services" className={styles.navLink}>
          Services
        </Link>
        <Link href="/works" className={styles.navLink}>
          Works
        </Link>
        <Link href="/article" className={styles.navLink}>
          Article
        </Link>
      </nav>
      <Link href="/" className={styles.logo}>
        HO<span className={styles.logoAccent}>O</span>CK
      </Link>
    </header>
  );
}
