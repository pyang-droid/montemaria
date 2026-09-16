"use client";

import { useEffect, useRef, useState } from "react";

const galleryImages = [
  {
    id: 1,
    src: "p1.jpg",
    alt: "Monte Maria Sunrise",
    size: "large",
  },
  {
    id: 2,
    src: "p2.jpg",
    alt: "Chapel Interior",
    size: "small",
  },
  {
    id: 3,
    src: "p3.jpg",
    alt: "Mountain Path",
    size: "small",
  },
  {
    id: 4,
    src: "p4.jpg",
    alt: "View Deck",
    size: "small",
  },
  {
    id: 5,
    src: "p5.jpg",
    alt: "Mountain View",
    size: "large",
  },
  {
    id: 6,
    src: "p6.jpg",
    alt: "Pathway",
    size: "small",
  },
  {
    id: 7,
    src: "p7.jpg",
    alt: "Church",
    size: "small",
  },
  {
    id: 8,
    src: "p8.jpg",
    alt: "Coastal View",
    size: "small",
  },
  {
    id: 9,
    src: "p9.jpg",
    alt: "Glass Walk",
    size: "large",
  },
  {
    id: 10,
    src: "p10.jpg",
    alt: "Gate",
    size: "small",
  },
  {
    id: 11,
    src: "p11.jpg",
    alt: "Retreat",
    size: "small",
  },
  {
    id: 12,
    src: "p12.jpg",
    alt: "Pilgrims",
    size: "small",
  },
  
];

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<null | (typeof galleryImages)[0]>(null);

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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <section id="gallery" ref={ref} className="py-28 bg-brand-cream relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #C0122C 0, #C0122C 1px, transparent 0, transparent 50%)`,
          backgroundSize: "20px 20px"
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="reveal cross-divider text-brand-red mb-4 max-w-xs">
          <span
            className="text-xs tracking-[0.35em] uppercase text-brand-red font-medium"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Gallery
          </span>
        </div>

        <div className="reveal flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <h2
            className="text-5xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Glimpses of
            <br />
            <span className="text-brand-red italic">Monte Maria</span>
          </h2>
          <p
            className="text-white max-w-xs text-sm leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Every photo tells a story of devotion, breathtaking views, and sacred
            moments captured at Monte Maria.
          </p>
        </div>

        {/* Masonry Gallery Grid */}
        <div className="reveal columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4" style={{ transitionDelay: "0.2s" }}>
          {galleryImages.map((img, i) => (
            <div
              key={img.id}
              className="gallery-item relative overflow-hidden rounded-xl cursor-pointer break-inside-avoid"
              style={{ transitionDelay: `${i * 0.05}s` }}
              onClick={() => setLightbox(img)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover transition-transform duration-700 hover:scale-110"
                style={{ height: img.size === "large" ? "280px" : "200px" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src.replace("w=600", "w=1200")}
              alt={lightbox.alt}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}