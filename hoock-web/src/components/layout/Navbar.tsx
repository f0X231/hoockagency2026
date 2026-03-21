"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "Works", href: "/#works" },
  { label: "Article", href: "/#article" },
];

export default function Navbar() {
  const [contactHovered, setContactHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Color tokens ──────────────────────────────────────────────────────────
  const textColor      = scrolled ? "rgba(0,0,0,0.85)"  : "rgba(255,255,255,0.85)";
  const textHoverColor = scrolled ? "#000000"            : "#ffffff";
  const iconColor      = scrolled ? "rgba(0,0,0,0.85)"  : "rgba(255,255,255,0.85)";
  const barColor       = scrolled ? "#000000"            : "#ffffff";

  return (
    <nav
      style={{
        zIndex: 50,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        transition:
          "background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease",
        background: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        boxShadow: scrolled
          ? "0 1px 0 rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.08)"
          : "none",
      }}
    >
      <div
        className="flex items-center justify-between max-w-7xl mx-auto w-full"
        style={{
          padding: scrolled ? "16px 24px" : "32px 24px",
          transition: "padding 0.3s ease",
        }}
      >
        <div>
          {/* Desktop */}
          <div className="hidden md:flex space-x-10">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: textColor,
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = textHoverColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile — Hamburger */}
          <div
            ref={hamburgerRef}
            className="md:hidden relative"
            onMouseEnter={() => setMobileOpen(true)}
            onMouseLeave={() => setMobileOpen(false)}
          >
            <button
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                padding: "4px",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: "24px",
                    height: "2px",
                    backgroundColor: barColor,
                    borderRadius: "2px",
                    transition:
                      "transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease",
                    transform:
                      mobileOpen && i === 0
                        ? "translateY(7px) rotate(45deg)"
                        : mobileOpen && i === 2
                        ? "translateY(-7px) rotate(-45deg)"
                        : "none",
                    opacity: mobileOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </button>

            <div
              style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                left: 0,
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                overflow: "hidden",
                minWidth: "160px",
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
                transition: "opacity 0.25s ease, transform 0.25s ease",
                pointerEvents: mobileOpen ? "auto" : "none",
              }}
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    padding: "14px 20px",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#333",
                    textDecoration: "none",
                    borderBottom: "1px solid #f0f0f0",
                    transition: "background 0.2s",
                  }}
                  className="hover:bg-gray-50"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── CENTER: Logo ── */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center justify-center transition-transform hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="Hoock Agency Logo"
              width={140}
              height={45}
              className="object-contain"
              priority
              style={{
                filter: scrolled ? "none" : "brightness(0) invert(1)",
                transition: "filter 0.3s ease",
              }}
            />
          </Link>
        </div>

        {/* ── RIGHT: Contact bubble ── */}
        <Link
          href="/contact"
          aria-label="Contact"
          onMouseEnter={() => setContactHovered(true)}
          onMouseLeave={() => setContactHovered(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <div style={{ position: "relative", width: "80px", height: "56px" }}>
            <svg
              viewBox="0 0 120 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "64px", height: "56px" }}
            >
              <rect
                x="2" y="2" width="110" height="55" rx="8" ry="8"
                stroke={iconColor}
                strokeWidth="2.5"
                style={{ transition: "stroke 0.3s ease" }}
              />
              <path
                d="M18 62 L14 74 L26 66"
                stroke={iconColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: "stroke 0.3s ease" }}
              />
            </svg>
            <span
              style={{
                position: "absolute",
                top: "22px",
                left: 0,
                right: "15px",
                textAlign: "center",
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: scrolled ? "#000000" : "white",
                opacity: contactHovered ? 1 : 0,
                transition: "opacity 0.25s ease, color 0.3s ease",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              CONTACT
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
}