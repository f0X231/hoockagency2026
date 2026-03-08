import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact Us | HOOCK Agency",
  description: "Get in touch with HOOCK Agency. Fill out our form for a free consultation.",
};

const socialLinks = [
  { name: "Facebook", icon: "f", href: "#" },
  { name: "Instagram", icon: "📷", href: "#" },
  { name: "X", icon: "𝕏", href: "#" },
  { name: "TikTok", icon: "♪", href: "#" },
  { name: "YouTube", icon: "▶", href: "#" },
  { name: "LinkedIn", icon: "in", href: "#" },
];

export default function ContactPage() {
  return (
    <div className={styles.container}>      
      <div className={styles.content}>
        {/* Left Side - Contact Information */}
        <div className={styles.contactInfo}>
          <h1 className={styles.heading}>Contact us</h1>
          
          <div>
            <h2 className={styles.companyName}>HOOCK Agency Co., Ltd.</h2>
            <p className={styles.address}>
              8/71 Soi Nong Rahaeng 4 Yeak 3, Sam Wa Tawan<br />
              Tok,Subdistrict, Khlong Sam Wa, Bangkok 10510
            </p>
          </div>
          
          <div className={styles.contactDetails}>
            <p className={styles.contactItem}>Phone : 088-888-8888</p>
            <p className={styles.contactItem}>Mail : Support@hoockagency.com</p>
          </div>
          
          <div className={styles.socialLinks}>
            {socialLinks.map((social) => (
              <a 
                key={social.name}
                href={social.href}
                className={styles.socialIcon}
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        
        {/* Right Side - Contact Form */}
        <div className={styles.formSection}>
          <button className={styles.closeButton} aria-label="Close">
            ×
          </button>
          
          <h2 className={styles.formHeading}>กรอกข้อมูลปรึกษาฟรี</h2>
          
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                placeholder="Name *" 
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <input 
                type="email" 
                placeholder="Your mail *" 
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <input 
                type="tel" 
                placeholder="Your Phone *" 
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <textarea 
                placeholder="Message *" 
                className={styles.textarea}
                required
              />
            </div>
            
            <div className={styles.checkboxGroup}>
              <input 
                type="checkbox" 
                id="privacy" 
                className={styles.checkbox}
                required
              />
              <label htmlFor="privacy" className={styles.checkboxLabel}>
                You have read the{" "}
                <Link href="/privacy-policy" className={styles.privacyLink}>
                  privacy policy
                </Link>
                .
              </label>
            </div>
            
            <button type="submit" className={styles.submitButton}>
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
