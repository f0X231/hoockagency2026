"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Works", href: "#works" },
  { label: "Article", href: "#article" },
];

export default function Navbar() {
  const [coverVisible, setCoverVisible] = useState(false);
  const [contactHovered, setContactHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* ── Full-screen hover cover ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          backgroundImage: "url('/hover-cover.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: coverVisible ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Description text — vertically centered, left-aligned with menu */}
        <div
          style={{
            width: "100%",
            maxWidth: "80rem",      /* max-w-7xl */
            margin: "0 auto",
            padding: "0 1.5rem",   /* px-6 */
          }}
        >
          <p
            style={{
              maxWidth: "420px",
              fontSize: "1.1rem",
              fontWeight: 400,
              lineHeight: 1.65,
              color: "#1a1a1a",
              opacity: coverVisible ? 1 : 0,
              transform: coverVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.45s ease 0.1s, transform 0.45s ease 0.1s",
            }}
          >
            A creative agency and advertising consultancy covering both online
            and offline channels, with the goal of inspiring brands and
            delivering a great experience to customers.
          </p>
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav
        style={{ position: "relative", zIndex: 20 }}
        className="flex items-center justify-between max-w-7xl mx-auto px-6 py-8 w-full"
      >
        {/* ── LEFT: Desktop nav links / Mobile hamburger ── */}
        <div>
          {/* Desktop */}
          <div className="hidden md:flex space-x-10">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onMouseEnter={() => setCoverVisible(true)}
                onMouseLeave={() => setCoverVisible(false)}
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#555",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                className="hover:!text-[#1a1a1a]"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile — Hamburger with hover-expand */}
          <div
            ref={hamburgerRef}
            className="md:hidden relative"
            onMouseEnter={() => setMobileOpen(true)}
            onMouseLeave={() => setMobileOpen(false)}
          >
            {/* Hamburger Icon */}
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
                    backgroundColor: "#1a1a1a",
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

            {/* Dropdown menu */}
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
            onMouseEnter={() => setCoverVisible(true)}
            onMouseLeave={() => setCoverVisible(false)}
            className="flex items-center justify-center transition-transform hover:scale-105"
          >
            <Image 
              src="/logo.png" 
              alt="Hoock Agency Logo" 
              width={140} 
              height={45} 
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* ── RIGHT: Contact bubble icon ── */}
        <Link
          href="/contact"
          aria-label="Contact"
          onMouseEnter={() => {
            setContactHovered(true);
            setCoverVisible(true);
          }}
          onMouseLeave={() => {
            setContactHovered(false);
            setCoverVisible(false);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          {/* SVG speech bubble with "CONTACT" text inside on hover */}
          <div style={{ position: "relative", width: "80px", height: "56px" }}>
            {/* Bubble outline SVG */}
            <svg
              viewBox="0 0 120 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "64px", height: "56px" }}
            >
              {/* Bubble body */}
              <rect
                x="2"
                y="2"
                width="110"
                height="55"
                rx="8"
                ry="8"
                stroke="#2d3748"
                strokeWidth="2.5"
              />
              {/* Bubble tail */}
              <path
                d="M18 62 L14 74 L26 66"
                stroke="#2d3748"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* CONTACT text — fades in on hover */}
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
                color: "#2d3748",
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
    </>
  );
}
