"use client";

import { useRouter } from "next/navigation";

export default function BackToArticles() {
  const router = useRouter();

  const handleBack = () => {
    // ถ้ามี history ก่อนหน้า (มาจากหน้า home) — ใช้ back() แล้ว scroll
    if (window.history.length > 1) {
      router.back();
      setTimeout(() => {
        const el = document.getElementById("article");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      router.push("/#article");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#D9A384] mb-8 transition-colors uppercase tracking-widest bg-transparent border-none cursor-pointer p-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4 mr-2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Back to Articles
    </button>
  );
}