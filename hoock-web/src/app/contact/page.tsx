"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";
import styles from "./contact.module.css";

const socialLinks = [
  { name: "Facebook", icon: "f", href: "#" },
  { name: "Instagram", icon: "📷", href: "#" },
  { name: "X", icon: "𝕏", href: "#" },
  { name: "TikTok", icon: "♪", href: "#" },
  { name: "YouTube", icon: "▶", href: "#" },
  { name: "LinkedIn", icon: "in", href: "#" },
];

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [captchaReady, setCaptchaReady] = useState(false);
  const captchaRef = useRef<string | null>(null);
  const widgetRef = useRef<number | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email address.";
    if (!form.phone.trim()) newErrors.phone = "Phone is required.";
    else if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone))
      newErrors.phone = "Invalid phone number.";
    if (!form.message.trim()) newErrors.message = "Message is required.";
    if (!privacy) newErrors.privacy = "You must accept the privacy policy.";
    if (!captchaRef.current) newErrors.captcha = "Please complete the CAPTCHA.";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── render reCAPTCHA widget เมื่อ script โหลดเสร็จ ──
  const onCaptchaLoad = useCallback(() => {
    if (!window.grecaptcha?.render) return;

    // ป้องกัน render ซ้ำ
    if (widgetRef.current !== null) return;

    try {
      widgetRef.current = window.grecaptcha.render("recaptcha-container", {
        sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        callback: (token: string) => {
          captchaRef.current = token;
          setCaptchaReady(true);
          setErrors((prev) => ({ ...prev, captcha: "" }));
        },
        "expired-callback": () => {
          captchaRef.current = null;
          setCaptchaReady(false);
        },
        "error-callback": () => {
          captchaRef.current = null;
          setCaptchaReady(false);
        },
      });
    } catch (err) {
      console.error("reCAPTCHA render error:", err);
    }
  }, []);

  const resetCaptcha = () => {
    captchaRef.current = null;
    setCaptchaReady(false);
    if (widgetRef.current !== null) {
      window.grecaptcha?.reset(widgetRef.current);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken: captchaRef.current }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ── บันทึกไม่สำเร็จหลัง retry ครบ 3 รอบ ──
        const msg = data.error || "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
        setStatus("error");
        setErrorMsg(msg);
        resetCaptcha(); // reset captcha ให้ user กรอกใหม่
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
      setPrivacy(false);
      resetCaptcha();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg("ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบการเชื่อมต่อและลองใหม่");
      resetCaptcha();
    }
  };

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
        strategy="lazyOnload"
        onLoad={onCaptchaLoad}
      />

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

          {/* Right Side - Form */}
          <div className={styles.formSection}>
            <h2 className={styles.formHeading}>กรอกข้อมูลปรึกษาฟรี</h2>

            {status === "success" ? (
              <div className={styles.successMessage}>
                <p>ส่งข้อมูลเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด</p>
                <button
                  className={styles.submitButton}
                  onClick={() => setStatus("idle")}
                >
                  ส่งอีกครั้ง
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {/* Name */}
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name *"
                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <span className={styles.errorText}>{errors.name}</span>
                  )}
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your mail *"
                    className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <span className={styles.errorText}>{errors.email}</span>
                  )}
                </div>

                {/* Phone */}
                <div className={styles.formGroup}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone *"
                    className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                    value={form.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <span className={styles.errorText}>{errors.phone}</span>
                  )}
                </div>

                {/* Message */}
                <div className={styles.formGroup}>
                  <textarea
                    name="message"
                    placeholder="Message *"
                    className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                    value={form.message}
                    onChange={handleChange}
                  />
                  {errors.message && (
                    <span className={styles.errorText}>{errors.message}</span>
                  )}
                </div>

                {/* reCAPTCHA */}
                <div className={styles.formGroup}>
                  <div id="recaptcha-container" />
                  {/* แสดง status captcha */}
                  {captchaReady && (
                    <span style={{ fontSize: "0.75rem", color: "#16a34a", marginTop: "4px", display: "block" }}>
                      ✓ CAPTCHA verified
                    </span>
                  )}
                  {errors.captcha && (
                    <span className={styles.errorText}>{errors.captcha}</span>
                  )}
                </div>

                {/* Privacy */}
                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="privacy"
                    className={styles.checkbox}
                    checked={privacy}
                    onChange={(e) => {
                      setPrivacy(e.target.checked);
                      if (errors.privacy)
                        setErrors((prev) => ({ ...prev, privacy: "" }));
                    }}
                  />
                  <label htmlFor="privacy" className={styles.checkboxLabel}>
                    You have read the{" "}
                    <Link href="/privacy-policy" className={styles.privacyLink}>
                      privacy policy
                    </Link>
                    .
                  </label>
                </div>
                {errors.privacy && (
                  <span className={styles.errorText}>{errors.privacy}</span>
                )}

                {/* ── Error alert เมื่อบันทึกไม่สำเร็จ ── */}
                {status === "error" && errorMsg && (
                  <div
                    role="alert"
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fca5a5",
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      marginBottom: "8px",
                    }}
                  >
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: "14px",
                          height: "14px",
                          border: "2px solid currentColor",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                      กำลังส่ง...
                    </span>
                  ) : (
                    "SEND"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}