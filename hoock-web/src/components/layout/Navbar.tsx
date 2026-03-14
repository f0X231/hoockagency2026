"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "Works", href: "/#works" },
  { label: "Article", href: "/#article" },
];

export default function Navbar() {
  const [contactHovered, setContactHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  return (
    // ✅ absolute + top-0 + w-full ให้ navbar ลอยทับ banner
    <nav
      style={{ zIndex: 50 }}
      className="absolute top-0 left-0 right-0 flex items-center justify-between max-w-7xl mx-auto px-6 py-8 w-full"
    >
      {/* ── LEFT: Desktop nav links / Mobile hamburger ── */}
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
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              className="hover:!text-white"
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
                  backgroundColor: "#ffffff",
                  borderRadius: "2px",
                  transition: "transform 0.3s ease, opacity 0.3s ease",
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
          className="flex items-center justify-center transition-transform hover:scale-105"
        >
          <Image
            src="/logo.png"
            alt="Hoock Agency Logo"
            width={140}
            height={45}
            className="object-contain"
            priority
            style={{ filter: "brightness(0) invert(1)" }}
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
              // ✅ เปลี่ยนเป็นสีขาวบน banner
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2.5"
            />
            <path
              d="M18 62 L14 74 L26 66"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
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
              color: "white",
              opacity: contactHovered ? 1 : 0,
              transition: "opacity 0.25s ease",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            CONTACT
          </span>
        </div>
      </Link>
    </nav>
  );
}