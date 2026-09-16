"use client";

export default function Hero() {
  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Ken Burns */}
      <div className="absolute inset-0 z-0">
        <img
          src="montemariabaddie.png"
          alt="Monte Maria"
          className="w-full h-full object-cover animate-ken-burns"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-brand-red/10" />
      </div>

      {/* Decorative cross watermark */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="opacity-5">
          <div className="relative w-96 h-96 flex items-center justify-center">
            <div className="absolute w-4 h-full bg-white rounded-full" />
            <div className="absolute w-full h-4 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div className="cross-divider text-white/60 mb-6 max-w-xs mx-auto">
          <span
            className="text-xs tracking-[0.3em] uppercase text-white/70"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Pagkilatan, Batangas City
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-6xl md:text-8xl font-bold text-white mb-4 leading-none tracking-tight animate-fade-in"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Monte Maria
          
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/80 text-lg md:text-xl mt-6 max-w-xl mx-auto leading-relaxed animate-slide-up"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            animationDelay: "0.4s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          A sacred mountain sanctuary where faith meets breathtaking nature —
          a pilgrimage of peace, wonder, and spiritual renewal.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-slide-up"
          style={{
            animationDelay: "0.7s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <button
            onClick={scrollToAbout}
            className="px-8 py-3.5 bg-brand-red text-white rounded-full font-medium hover:bg-brand-red-dark transition-all duration-300 shadow-xl shadow-red-900/40 hover:shadow-red-900/60 hover:-translate-y-0.5"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Explore Monte Maria
          </button>
          <button
            onClick={() =>
              document
                .querySelector("#landmarks")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3.5 border border-white/60 text-white rounded-full font-medium hover:bg-white hover:text-brand-red transition-all duration-300 hover:-translate-y-0.5"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            View Landmarks
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-2 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  );
}
