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
    href: "https://www.facebook.com/HOOCKAgencyThailand",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    name: "LINE",
    href: "https://line.me/R/ti/p/@697szhbq",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
        <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
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