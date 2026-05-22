
export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Messenger */}
      <a
        href="https://www.facebook.com/share/18VkFSBvsu/?mibextid=wwXIfr"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[45px] w-[45px] items-center justify-center rounded-full transition-transform hover:scale-110 drop-shadow-md overflow-hidden bg-gradient-to-b from-[#FF528A] via-[#A133FF] to-[#0A7CFF]"
        aria-label="Messenger app"
        title="แชทผ่าน Messenger"
      >
        <img
          src="https://cdn.simpleicons.org/messenger/ffffff"
          alt="Messenger"
          width={26}
          height={26}
        />
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
        <img
          src="https://cdn.simpleicons.org/line/ffffff"
          alt="LINE"
          width={28}
          height={28}
        />
      </a>

      {/* Phone */}
      <a
        href="tel:0870036751"
        className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-black text-white shadow-md transition-transform hover:scale-110 ring-1 ring-white/20"
        aria-label="Call us"
        title="โทรหาเรา"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="currentColor"
        >
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1v3.49c0 .55-.45 1-1 1C19.39 21 11 12.61 11 2.61c0-.55.45-1 1-1h3.49c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      </a>
    </div>
  );
}