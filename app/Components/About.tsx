"use client";

import { useEffect, useRef } from "react";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: "1,200+", label: "Steps of Pilgrimage" },
    { value: "3", label: "Sacred Chapels" },
    { value: "365", label: "Days Open" },
    { value: "∞", label: "Blessings Received" },
  ];

  return (
    <section id="about" ref={ref} className="py-28 bg-white relative overflow-hidden">
      {/* Background cross watermark */}
      <div className="absolute right-0 top-0 w-96 h-96 opacity-[0.03] pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-6 h-full bg-brand-red rounded-full" />
          <div className="absolute w-full h-6 bg-brand-red rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <div className="reveal cross-divider text-brand-red mb-4 max-w-xs">
          <span
            className="text-xs tracking-[0.35em] uppercase text-brand-red font-medium"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Our Story
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <h2
              className="reveal text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              A Place of
              <br />
              <span className="text-brand-red italic">Faith & Grace</span>
            </h2>

            <div
              className="reveal space-y-5 text-gray-600 leading-relaxed"
              style={{
                fontFamily: "'Lato', sans-serif",
                transitionDelay: "0.15s",
              }}
            >
              <p>
                Nestled on a mountain overlooking the stunning Kumintang Ibaba coastline in Batangas,
                Monte Maria is a sacred sanctuary dedicated to the Blessed Virgin Mary.
                This spiritual haven offers pilgrims and visitors a profound journey of
                faith, beauty, and inner peace.
              </p>
              <p>
                The site was established by the Vincentian Fathers and features remarkable
                religious landmarks set against breathtaking natural scenery. From the
                iconic Gate of the Archangels to the awe-inspiring Glass Walk, every corner
                of Monte Maria invites reflection, prayer, and wonder.
              </p>
              <p>
                Whether you come seeking spiritual renewal, a family outing, or simply the
                magnificent Sea View, Monte Maria welcomes all with
                open arms and a spirit of deep Marian devotion.
              </p>
            </div>

          </div>

          {/* Right: Image + Stats */}
          <div className="reveal" style={{ transitionDelay: "0.2s" }}>
            <div className="relative">
              {/* Main image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-gray-900/20">
                <img
                  src="monte2.jpg"
                  alt="Monte Maria Chapel"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="reveal mt-24 grid grid-cols-2 md:grid-cols-4 gap-6" style={{ transitionDelay: "0.4s" }}>
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center py-8 px-4 border border-gray-300 rounded-2xl hover:border-brand-red/30 hover:shadow-lg hover:shadow-red-50 transition-all card-lift"
            >
              <div
                className="text-4xl text-black font-bold text-brand-red mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.value}
              </div>
              <div
                className="text-sm text-gray-500 tracking-wide uppercase"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
