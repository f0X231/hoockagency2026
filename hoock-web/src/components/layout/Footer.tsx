export default function Footer() {
  return (
    <footer className="w-full bg-[#333E48] text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Branding & Socials */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">Hoock</h2>
          <p className="text-sm text-gray-400">
            Creative agency driven by fresh ideas, unique approaches, and effective solutions.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col space-y-2">
            <h3 className="font-bold mb-2">Explore</h3>
            <a href="#services" className="text-sm text-gray-300 hover:text-white">Services</a>
            <a href="#works" className="text-sm text-gray-300 hover:text-white">Works</a>
            <a href="#article" className="text-sm text-gray-300 hover:text-white">Article</a>
        </div>

         {/* Contact */}
         <div className="flex flex-col space-y-2">
            <h3 className="font-bold mb-2">Contact</h3>
            <p className="text-sm text-gray-300">hello@hoock.com</p>
            <p className="text-sm text-gray-300">+66 123 456 789</p>
        </div>
      </div>
       <div className="border-t border-gray-600 mt-12 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} HOOCK Agency. All rights reserved.
       </div>
    </footer>
  );
}
