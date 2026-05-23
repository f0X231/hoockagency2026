"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/app/contact/contact.module.css";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/HOOCKAgencyThailand",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "LINE",
    href: "https://line.me/R/ti/p/@697szhbq",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
      </svg>
    ),
  },
];

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email address.";
    if (!form.phone.trim()) newErrors.phone = "Phone is required.";
    else if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone)) newErrors.phone = "Invalid phone number.";
    if (!form.message.trim()) newErrors.message = "Message is required.";
    if (!privacy) newErrors.privacy = "You must accept the privacy policy.";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
      setPrivacy(false);
    } catch {
      setStatus("error");
      setErrorMsg("ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบการเชื่อมต่อและลองใหม่");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Left Side */}
        <div className={styles.contactInfo}>
          <h1 className={styles.heading}>Contact us</h1>
          <div>
            <h2 className={styles.companyName}>HOOCK Agency Co., Ltd.</h2>
            <p className={styles.address}>
              8/71 Soi Nong Rahaeng 4 Yeak 3, Sam Wa Tawan
              <br />
              Tok, Subdistrict, Khlong Sam Wa, Bangkok 10510
            </p>
          </div>
          <div className={styles.contactDetails}>
            <p className={styles.contactItem}>Phone : <a href="tel:0870036751">087-003-6751</a></p>
            <p className={styles.contactItem}>Mail : <a href="mailto:supphagorn.s@hoockagency.com">supphagorn.s@hoockagency.com</a></p>
          </div>
          <div className={styles.socialLinks}>
            {socialLinks.map((social) => (
              <a key={social.name} href={social.href} className={styles.socialIcon} aria-label={social.name}>
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.formSection}>
          <h2 className={styles.formHeading}>กรอกข้อมูลปรึกษาฟรี</h2>

          {status === "success" ? (
            <div className={styles.successMessage}>
              <p>ส่งข้อมูลเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด</p>
              <button className={styles.submitButton} onClick={() => setStatus("idle")}>
                ส่งอีกครั้ง
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.formGroup}>
                <input type="text" name="name" placeholder="Name *"
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  value={form.name} onChange={handleChange} />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              <div className={styles.formGroup}>
                <input type="email" name="email" placeholder="Your mail *"
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  value={form.email} onChange={handleChange} />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <input type="tel" name="phone" placeholder="Your Phone *"
                  className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                  value={form.phone} onChange={handleChange} />
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </div>

              <div className={styles.formGroup}>
                <textarea name="message" placeholder="Message *"
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                  value={form.message} onChange={handleChange} />
                {errors.message && <span className={styles.errorText}>{errors.message}</span>}
              </div>

              <div className={styles.checkboxGroup}>
                <input type="checkbox" id="privacy" className={styles.checkbox}
                  checked={privacy}
                  onChange={(e) => { setPrivacy(e.target.checked); if (errors.privacy) setErrors((prev) => ({ ...prev, privacy: "" })); }} />
                <label htmlFor="privacy" className={styles.checkboxLabel}>
                  You have read the{" "}
                  <Link href="/privacy-policy" className={styles.privacyLink}>privacy policy</Link>.
                </label>
              </div>
              {errors.privacy && <span className={styles.errorText}>{errors.privacy}</span>}

              {status === "error" && errorMsg && (
                <div role="alert" style={{
                  padding: "12px 16px", borderRadius: "8px",
                  backgroundColor: "#fef2f2", border: "1px solid #fca5a5",
                  color: "#dc2626", fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "8px",
                }}>
                  {errorMsg}
                </div>
              )}

              <button type="submit" className={styles.submitButton} disabled={status === "loading"}>
                {status === "loading" ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                    <span style={{
                      display: "inline-block", width: "14px", height: "14px",
                      border: "2px solid currentColor", borderTopColor: "transparent",
                      borderRadius: "50%", animation: "spin 0.7s linear infinite",
                    }} />
                    กำลังส่ง...
                  </span>
                ) : "SEND"}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
