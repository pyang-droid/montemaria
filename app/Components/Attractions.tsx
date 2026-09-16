"use client";

import { useEffect, useRef, useState } from "react";

const attractions = [
  {
    name: "Mirage Walk",
    tagline: "An Illusion of Infinite Space",
    description:
      "The Mirage Walk is a captivating optical experience where reflective panels and carefully positioned mirrors create a dazzling illusion of endless pathways stretching into infinity. As you walk through, the boundaries between the physical world and the horizon blur, creating an ethereal, almost dreamlike passage. A truly unique attraction that merges art, science, and the spiritual wonder of Monte Maria.",
    highlights: [
      "Stunning visual illusions",
      "Perfect for photography",
      "Suitable for all ages",
      "Unique art installation",
    ],
    img: "p1.jpg",
    badge: "New Experience",
    color: "bg-brand-red",
  },
  {
    name: "View Deck",
    tagline: "The World Beneath Your Feet",
    description:
      "Standing on the View Deck feels like being suspended between heaven and earth. At the highest accessible point of Monte Maria, this open-air platform rewards visitors with a 180-degree panoramic view of the West Philippine Sea and the lush Batangas landscape. Whether at sunrise, golden hour, or dusk, the view is always breathtaking — a powerful reminder of God's magnificent creation.",
    highlights: [
      "360° panoramic view",
      "Best at sunrise & sunset",
      "Accessible platform",
      "Photo opportunity spot",
    ],
    img: "p5.jpg",
    badge: "Most Popular",
    color: "bg-rose-700",
  },
  {
    name: "Glass Walk",
    tagline: "Walk on Air, Feel the Thrill",
    description:
      "For those seeking both adventure and awe, the Glass Walk delivers an unforgettable experience. This transparent walkway extends over the mountain's edge, with a clear glass floor that lets you see hundreds of feet straight down to the forest and rocky cliffs below. It's both thrilling and humbling — a reminder of how small we are in God's vast creation, and how faith allows us to walk boldly forward.",
    highlights: [
      "Crystal-clear glass floor",
      "200+ feet elevation",
      "Heart-pounding thrills",
      "Breathtaking cliff views",
    ],
    img: "p11.jpg",
    badge: "Adventure Pick",
    color: "bg-red-600",
  },
];

export default function Attractions() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = attractions[active];

  return (
    <section id="attractions" ref={ref} className="py-28 bg-gray-950 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-red/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="reveal cross-divider text-brand-red mb-4 max-w-xs">
          <span
            className="text-xs tracking-[0.35em] uppercase text-brand-red font-medium"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Experiences
          </span>
        </div>

        <div className="reveal flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <h2
            className="text-5xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Unforgettable
            <br />
            <span className="text-brand-red italic">Attractions</span>
          </h2>
          <p
            className="text-gray-400 max-w-xs text-sm leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Three extraordinary experiences that blend thrilling adventure with
            spiritual contemplation.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="reveal flex gap-3 mb-10 flex-wrap" style={{ transitionDelay: "0.1s" }}>
          {attractions.map((a, i) => (
            <button
              key={a.name}
              onClick={() => setActive(i)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                active === i
                  ? "bg-brand-red text-white shadow-lg shadow-red-700/40"
                  : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {a.name}
            </button>
          ))}
        </div>

        {/* Active Attraction Display */}
        <div className="reveal" style={{ transitionDelay: "0.2s" }}>
          <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Image */}
            <div className="relative h-[380px] md:h-auto overflow-hidden">
              <img
                key={current.name}
                src={current.img}
                alt={current.name}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              {/* Badge */}
              <div
                className={`absolute top-5 left-5 ${current.color} text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg`}
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {current.badge}
              </div>
            </div>

            {/* Content */}
            <div className="bg-gray-900 p-8 md:p-10 flex flex-col justify-between">
              <div>
                <p
                  className="text-brand-red text-sm tracking-widest uppercase mb-2"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {current.tagline}
                </p>
                <h3
                  className="text-4xl font-bold text-white mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {current.name}
                </h3>
                <p
                  className="text-gray-400 text-sm leading-relaxed mb-8"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {current.description}
                </p>

                {/* Highlights */}
                <div className="grid grid-cols-2 gap-3">
                  {current.highlights.map((h) => (
                    <div
                      key={h}
                      className="flex items-center gap-2 text-gray-300 text-xs"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  className="flex-1 py-3 bg-brand-red text-white rounded-full text-sm font-medium hover:bg-brand-red-dark transition-all hover:-translate-y-0.5"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Plan Your Visit
                </button>
                <button
                  className="px-5 py-3 border border-white/20 text-white/70 rounded-full text-sm hover:border-white/40 hover:text-white transition-all"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  More Info
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Attraction Index Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {attractions.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${
                active === i ? "w-8 h-2 bg-brand-red" : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
