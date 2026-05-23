import type { Metadata } from "next";
import ContactPageClient from "@/components/contact/ContactPageClient";

export const metadata: Metadata = {
  title: "ติดต่อเรา | Contact HOOCK Agency",
  description:
    "ติดต่อ HOOCK Agency เอเจนซี่โฆษณาครบวงจร กรุงเทพฯ โทร 087-003-6751 หรือกรอกแบบฟอร์มเพื่อรับคำปรึกษาฟรี — Digital Marketing, Content, Performance Marketing",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "ติดต่อเรา | HOOCK Agency",
    description:
      "ติดต่อ HOOCK Agency เอเจนซี่โฆษณาครบวงจร กรุงเทพฯ รับคำปรึกษาฟรีด้าน Digital Marketing",
    url: "/contact",
    type: "website",
    locale: "th_TH",
    siteName: "HOOCK Agency",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
