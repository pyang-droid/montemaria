export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute w-1 h-8 rounded-full bg-brand-red" />
                <div className="absolute w-8 h-1 rounded-full bg-brand-red" />
              </div>
              <span
                className="text-white text-xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Monte Maria
              </span>
            </div>
            <p
              className="text-gray-500 text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              A sacred pilgrimage destination on the mountains of Kumintang Ibaba,
              Batangas, Philippines. Open to all seekers of faith, peace, and
              natural wonder.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-white text-sm font-semibold uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Home", "About", "Landmarks", "Attractions"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="text-gray-500 text-sm hover:text-brand-red transition-colors"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Info */}
          <div>
            <h4
              className="text-white text-sm font-semibold uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Visit Us
            </h4>
            <ul
              className="space-y-3 text-gray-500 text-sm"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              <li>Kumintang Ibaba, Batangas</li>
              <li>Philippines</li>
              <li>Open Daily: 6AM – 6PM</li>
              <li className="text-brand-red">+63 XXX XXX XXXX</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="text-gray-600 text-xs"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            © {new Date().getFullYear()} Monte Maria. All rights reserved.
          </p>
          <p
            className="text-gray-700 text-xs"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Designed with ✝️ and devotion
          </p>
        </div>
      </div>
    </footer>
  );
}
