import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "Works", href: "/#works" },
  { label: "Article", href: "/#article" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Notice", href: "/privacy-policy" },
];

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#2D3643",
        position: "relative",
        paddingBottom: "4px", // space for gradient bar
      }}
    >
      {/* gradient bar bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: "linear-gradient(90deg, #4ECDC4, #45B7D1)",
        }}
      />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "3rem 4rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {/* ── LEFT: Logo + Company Info ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {/* Logo */}
          <Image
            src="/logo-hoock.png"
            alt="Hoock Agency Logo"
            width={180}
            height={60}
            className="object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />

          {/* Company Info */}
          <div style={{ marginTop: "1.75rem" }}>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#7CB4B8",
                margin: "0 0 0.5rem",
              }}
            >
              HOOCK Agency Co., Ltd.
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#8BA3A5",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              8/71 Soi Nong Rahaeng 4 Yeak 3, Sam Wa Tawan
              <br />
              Tok, Subdistrict, Khlong Sam Wa, Bangkok 10510
            </p>
          </div>
        </div>

        {/* ── RIGHT: Nav Links + Social Icons ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "1.25rem",
          }}
        >
          {/* Nav Links */}
          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: "2rem",
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  color: "#8BA3A5",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.2s ease",
                }}
                className="hover:!text-white"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Social Icons */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border: "1px solid #5A7A7D",
                  backgroundColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#7CB4B8",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
                className="hover:!bg-[#7CB4B8] hover:!text-[#2D3643] hover:!border-[#7CB4B8]"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile styles ── */}
      <style>{`
        @media (max-width: 768px) {
          footer > div {
            padding: 2rem 1.5rem 2rem !important;
            flex-direction: column !important;
            gap: 2rem !important;
          }
          footer nav {
            justify-content: flex-start !important;
          }
          footer > div > div:last-child {
            align-items: flex-start !important;
          }
        }
      `}</style>
    </footer>
  );
}