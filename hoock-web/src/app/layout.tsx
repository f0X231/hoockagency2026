import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hoockagency.com";

export const metadata: Metadata = {
  title: {
    default: "HOOCK Agency | เอเจนซี่โฆษณาครบวงจร Online & Offline",
    template: "%s | HOOCK Agency",
  },
  description:
    "HOOCK Agency เอเจนซี่โฆษณาครบวงจร ทั้ง Online และ Offline ให้บริการ Digital Marketing, Content Creation, Performance Marketing และ Brand Strategy สำหรับแบรนด์และธุรกิจไทย",
  keywords: [
    "HOOCK Agency",
    "เอเจนซี่โฆษณา",
    "Digital Marketing",
    "โฆษณาออนไลน์",
    "Content Creation",
    "Performance Marketing",
    "Brand Strategy",
    "Social Media Marketing",
    "บริการโฆษณา",
    "เอเจนซี่กรุงเทพ",
    "Bangkok Agency",
    "Thailand Marketing",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    siteName: "HOOCK Agency",
    type: "website",
    locale: "th_TH",
    url: "/",
    title: "HOOCK Agency | เอเจนซี่โฆษณาครบวงจร Online & Offline",
    description:
      "HOOCK Agency เอเจนซี่โฆษณาครบวงจร ทั้ง Online และ Offline ให้บริการ Digital Marketing, Content Creation, Performance Marketing และ Brand Strategy",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "HOOCK Agency เอเจนซี่โฆษณาครบวงจร",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HOOCK Agency | เอเจนซี่โฆษณาครบวงจร Online & Offline",
    description:
      "เอเจนซี่โฆษณาครบวงจร ทั้ง Online และ Offline บริการ Digital Marketing, Content Creation, Performance Marketing",
    images: ["/logo.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "HOOCK Agency",
  legalName: "HOOCK Agency Co., Ltd.",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo-hoock.png`,
  },
  image: `${SITE_URL}/logo.png`,
  description:
    "เอเจนซี่โฆษณาครบวงจร ทั้ง Online และ Offline ให้บริการ Digital Marketing, Content Creation, Performance Marketing และ Brand Strategy สำหรับแบรนด์และธุรกิจไทย",
  address: {
    "@type": "PostalAddress",
    streetAddress: "8/71 Soi Nong Rahaeng 4 Yeak 3, Sam Wa Tawan Tok Subdistrict",
    addressLocality: "Khlong Sam Wa",
    addressRegion: "Bangkok",
    postalCode: "10510",
    addressCountry: "TH",
  },
  telephone: "+66-87-003-6751",
  email: "supphagorn.s@hoockagency.com",
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/HOOCKAgencyThailand",
    "https://line.me/R/ti/p/@697szhbq",
  ],
  areaServed: {
    "@type": "Country",
    name: "Thailand",
  },
  knowsAbout: [
    "Digital Marketing",
    "Content Creation",
    "Performance Marketing",
    "Brand Strategy",
    "Social Media Marketing",
    "Advertising",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <FloatingContact />
        <Footer />
      </body>
    </html>
  );
}
