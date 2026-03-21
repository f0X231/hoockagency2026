import React from "react";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Phone Icon */}
      <a
        href="tel:+66xxxxxxxx"
        className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-110"
        aria-label="Call us"
        title="โทรหาเรา"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>

      {/* LINE App Icon */}
      <a
        href="#LINE_LINK_TBD"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#06C755] text-white shadow-lg transition-transform hover:scale-110"
        aria-label="LINE app"
        title="คุยผ่าน LINE"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.08.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-5.992zM8.384 13.911h-3.09v-6.908h3.09v1.233H6.527v1.606h1.857v1.233H6.527v1.606h1.857v1.23zM9.593 13.911h-1.232v-6.908h1.232v6.908zM14.536 13.911h-1.24l-2.001-3.134v3.134h-1.232v-6.908h1.24l2.001 3.133v-3.133h1.232v6.908zM18.846 13.911h-3.09v-6.908h3.09v1.233h-1.857v1.606h1.857v1.233h-1.857v1.606h1.857v1.23z" />
        </svg>
      </a>

      {/* Messenger App Icon */}
      <a
        href="#MESSENGER_LINK_TBD"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#0084FF] text-white shadow-lg transition-transform hover:scale-110"
        aria-label="Messenger app"
        title="แชทผ่าน Messenger"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.923 1.487 5.517 3.824 7.221v3.521l3.486-1.921c.854.237 1.758.368 2.69.368 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 9.531l-2.311 2.47-4.496-2.47 5.006-5.462 2.373 2.47 4.436 2.47-5.008 5.462z" />
        </svg>
      </a>
    </div>
  );
}
