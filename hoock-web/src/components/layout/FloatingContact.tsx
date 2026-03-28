import React from "react";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Messenger App Icon */}
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
          <path
            d="M12 2C6.477 2 2 6.145 2 11.258c0 2.923 1.487 5.517 3.824 7.221v3.521l3.486-1.921c.854.237 1.758.368 2.69.368 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2z"
            fill="url(#messenger-gradient)"
          />
          <path
            d="M13.066 11.531l-2.311 2.47-4.496-2.47 5.006-5.462 2.373 2.47 4.436 2.47-5.008 5.462z"
            fill="white"
          />
        </svg>
      </a>

      {/* LINE App Icon */}
      <a
        href="https://lin.ee/vgfQxJQt"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#06C755] text-white shadow-md transition-transform hover:scale-110"
        aria-label="LINE app"
        title="คุยผ่าน LINE"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-[30px] w-[30px]"
          fill="white"
        >
          <path d="M12 4C5.38 4 0 8.37 0 13.74c0 4.81 4.27 8.85 10.04 9.61.39.08.92.26 1.05.59.12.3.08.78.04 1.09l-.17 1.03c-.05.3-.24 1.19 1.04.65 1.28-.54 6.91-4.07 9.43-6.97C23.17 17.83 24 15.89 24 13.74 24 8.37 18.62 4 12 4z" />
          <path
            fill="#06C755"
            d="M18.85 15.91h-3.09v-6.91h3.09v1.23h-1.86v1.61h1.86v1.23h-1.86v1.61h1.86v1.23zm-4.31 0h-1.24l-2.01-3.13v3.13h-1.23v-6.91h1.24l2.01 3.13V9h1.23v6.91zm-5.95 0H7.36V9h1.23v6.91zm-3.06 0H2.44V9h1.23v5.68h1.86v1.23z"
          />
        </svg>
      </a>

      {/* Phone Icon */}
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
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1v3.49c0 .55-.45 1-1 1C19.39 21 11 12.61 11 2.61c0-.55.45-1 1-1h3.49c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" transform="translate(-2, -2) scale(1.15)" />
        </svg>
      </a>
    </div>
  );
}
