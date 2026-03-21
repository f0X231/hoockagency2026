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

export const metadata: Metadata = {
  title: {
    default: "HOOCK Agency",
    template: "%s | HOOCK Agency", 
  },
  description:
    "A creative agency and advertising consultancy covering both online and offline channels, with the goal of inspiring brands and delivering a great experience to customers.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://hoockagency.com"
  ),
  openGraph: {
    siteName: "HOOCK Agency",
    type: "website",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
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