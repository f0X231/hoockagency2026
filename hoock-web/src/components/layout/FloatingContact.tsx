
export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Messenger */}
      <a
        href="https://m.me/HOOCKAgencyThailand"
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
        href="https://line.me/R/ti/p/@697szhbq"
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
        className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-black shadow-md transition-transform hover:scale-110 ring-1 ring-white/20"
        aria-label="Call us"
        title="โทรหาเรา"
      >
        <img
          src="https://img.icons8.com/ios-filled/50/ffffff/phone.png"
          alt="Phone"
          width={24}
          height={24}
        />
      </a>
    </div>
  );
}