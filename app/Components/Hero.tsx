"use client";

export default function Hero() {
  const scrollTo = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section id="home" className="bg-[#f5f5f7]">
      <div className="relative h-[100svh] min-h-[760px] overflow-hidden bg-black">

        {/* ================= BACKGROUND IMAGE ================= */}
        <img
          src="/montemariabaddie.png"
          alt="Montemaria"
          className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-center"
        />

        {/* ================= OVERLAYS ================= */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/55" />

        {/* ================= LOCATION ================= */}
        <div className="absolute left-1/2 top-[17%] z-20 -translate-x-1/2">
          <p
            className="whitespace-nowrap text-sm font-semibold tracking-[0.02em] text-white drop-shadow-lg md:text-base"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            Pagkilatan • Batangas City • Philippines
          </p>
        </div>

        {/* ================= MONTEMARIA TITLE ================= */}
        <div className="absolute left-1/2 top-[31%] z-10 w-full -translate-x-1/2 text-center">
          <h1
            className="px-6 text-[clamp(5rem,11vw,10rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-white drop-shadow-sm"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
            }}
          >
            Montemaria
          </h1>
        </div>

        {/* ================= BUTTONS ================= */}
        {/* Positioned lower based on the area marked in your screenshot */}
        <div className="absolute bottom-[13%] left-1/2 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-4">
          
          {/* DISCOVER */}
          <button
            type="button"
            onClick={() => scrollTo("#about")}
            className="min-w-[175px] rounded-full bg-white px-8 py-3.5 text-base font-semibold text-[#1d1d1f] shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[#f5f5f7]"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            Discover
          </button>

          {/* EXPLORE ATTRACTIONS */}
          <button
            type="button"
            onClick={() => scrollTo("#attractions")}
            className="min-w-[230px] rounded-full bg-[#c1122f] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[#a90f29]"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            Explore attractions
          </button>
        </div>

        {/* ================= BOTTOM GRADIENT ================= */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />

        {/* ================= SCROLL INDICATOR ================= */}
        <button
          type="button"
          onClick={() => scrollTo("#about")}
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-white/75 transition hover:text-white"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Scroll to discover ↓
        </button>
      </div>
    </section>
  );
}