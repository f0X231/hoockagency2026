import React from "react";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Messenger */}
      <a
        href="https://www.facebook.com/share/18VkFSBvsu/?mibextid=wwXIfr"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center transition-transform hover:scale-110 drop-shadow-md rounded-full"
        aria-label="Messenger app"
        title="แชทผ่าน Messenger"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="h-[45px] w-[45px]"
        >
          <defs>
            <linearGradient
              id="messenger-gradient"
              x1="12"
              y1="22"
              x2="12"
              y2="2"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0A7CFF" />
              <stop offset="0.5" stopColor="#A133FF" />
              <stop offset="1" stopColor="#FF528A" />
            </linearGradient>
          </defs>
          {/* Bubble */}
          <path
            d="M12 2C6.477 2 2 6.145 2 11.258c0 2.923 1.487 5.517 3.824 7.221v3.521l3.486-1.921c.854.237 1.758.368 2.69.368 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2z"
            fill="url(#messenger-gradient)"
          />
          {/* Lightning bolt — stroke-based, matches official Messenger icon */}
          <path
            d="M5.5 13.5L10.5 7.5L13.5 10.5L19 5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </a>

      {/* LINE */}
      <a
        href="https://lin.ee/vgfQxJQt"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#06C755] shadow-md transition-transform hover:scale-110"
        aria-label="LINE app"
        title="คุยผ่าน LINE"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-[30px] w-[30px]"
        >
          {/*
            fillRule="evenodd" + รวม bubble และตัวอักษรไว้ใน path เดียว
            ทำให้ตัวอักษร "LINE" เป็น cutout เห็นพื้นเขียวด้านหลังผ่านตัวอักษร
          */}
          <path
            fill="white"
            fillRule="evenodd"
            d="
              M12 4C5.38 4 0 8.37 0 13.74c0 4.81 4.27 8.85 10.04 9.61
              .39.08.92.26 1.05.59.12.3.08.78.04 1.09l-.17 1.03
              c-.05.3-.24 1.19 1.04.65 1.28-.54 6.91-4.07 9.43-6.97
              C23.17 17.83 24 15.89 24 13.74 24 8.37 18.62 4 12 4z
              M18.85 15.91h-3.09V9h1.23v5.68h1.86v1.23z
              M15.54 15.91h-1.23V9h1.23v6.91z
              M13.3 15.91h-1.24l-2.01-3.13v3.13H8.82V9h1.24l2.01 3.13V9h1.23v6.91z
              M7.59 15.91H4.5V9h1.23v5.68h1.86v1.23z
            "
          />
        </svg>
      </a>

      {/* Phone */}
      <a
        href="tel:0870036751"
        className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-black text-white shadow-md transition-transform hover:scale-110"
        aria-label="Call us"
        title="โทรหาเรา"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="currentColor"
        >
          <path
            d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1v3.49c0 .55-.45 1-1 1C19.39 21 11 12.61 11 2.61c0-.55.45-1 1-1h3.49c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
            transform="translate(-2, -2) scale(1.15)"
          />
        </svg>
      </a>
    </div>
  );
}