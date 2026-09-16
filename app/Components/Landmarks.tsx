"use client";

import { useEffect, useRef } from "react";

const landmarks = [
  {
    name: "View Deck",
    description:
      "Perched atop Monte Maria, the View Deck offers a sweeping panoramic vista of the Monte Maria, and the rolling hills of Kumintang Ibaba. On a clear day, you can see the nearby islands and coastal barangays stretching into the horizon — a sight that moves every visitor to silence and wonder.",
    icon: "⛰️",
    color: "from-gray-700 to-brand-red",
    img: "p5.jpg",
  },
  {
    name: "Miracle Walk",
    description:
      "The Miracle Walk is a stone pathway leading pilgrims through a meditative journey lined with sacred statues and religious symbols. Each step represents a moment of prayer and reflection, recounting the mysteries of the rosary and the blessings bestowed on those who walk this path with faith and devotion.",
    icon: "🛤️",
    color: "from-gray-700 to-brand-red",
    img: "p1.jpg",
  },
  {
    name: "Glass Walk",
    description:
      "One of Monte Maria's most thrilling attractions, the Glass Walk is a transparent elevated walkway suspended over the mountain's edge. Visitors can look directly down through the floor at the lush forest and cliffs below — a heart-pounding experience that tests courage while rewarding with extraordinary views.",
    icon: "🔷",
    color: "from-gray-700 to-brand-red",
    img: "p11.jpg",
  },
  {
    name: "Gate of the Archangels",
    description:
      "A magnificent entrance arch adorned with sculptures of the Archangels Michael, Gabriel, and Raphael, the Gate of the Archangels marks the sacred threshold into the heart of Monte Maria. It serves as a powerful reminder of heavenly protection and the divine guardianship that accompanies every pilgrim on their journey.",
    icon: "⚔️",
    color: "from-gray-700 to-brand-red",
    img: "gate.jpg",
  },
  {
    name: "Sto. Niño Chapel",
    description:
      "The Sto. Niño Chapel is a small but beautifully ornate chapel dedicated to the Holy Child Jesus. Nestled within the mountain grounds, it is a place of quiet prayer and intimate devotion, beloved by families and children who come to seek the intercession of the Child Jesus for their daily needs and blessings.",
    icon: "⛪",
    color: "from-gray-700 to-brand-red",
    img: "sto.nino.jpg",
  },
  {
    name: "Retreat Facility",
    description:
      "Ideal for spiritual groups, schools, and religious communities, the Retreat Facility at Monte Maria provides a peaceful and well-equipped space for recollection, seminars, and renewal programs. Surrounded by nature and sacred imagery, it creates the perfect environment for deep prayer, community building, and spiritual growth.",
    icon: "🏡",
    color: "from-gray-700 to-brand-red",
    img: "p2.jpg",
  },
  {
    name: "St. John Paul II Chapel",
    description:
      "Dedicated to the beloved Pope Saint John Paul II, this chapel honors his historic visit to the Philippines and his enduring legacy of faith. Visitors come here to pray before his image, reflect on his teachings, and draw inspiration from his message of hope, love, and the dignity of every human person.",
    icon: "✝️",
    color: "from-gray-700 to-brand-red",
    img: "p10.jpg",
  },
];

export default function Landmarks() {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <section id="landmarks" ref={ref} className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="reveal cross-divider text-brand-red mb-4 max-w-xs">
          <span
            className="text-xs tracking-[0.35em] uppercase text-brand-red font-medium"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Sacred Sites
          </span>
        </div>

        <div className="reveal flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <h2
            className="text-5xl font-bold text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Sacred
            <br />
            <span className="text-brand-red italic">Landmarks</span>
          </h2>
          <p
            className="text-gray-500 max-w-sm text-sm leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Seven remarkable sites await your pilgrimage — each bearing unique
            spiritual significance and natural beauty.
          </p>
        </div>

        {/* Landmark Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landmarks.slice(0, 6).map((lm, i) => (
            <div
              key={lm.name}
              className="reveal card-lift group rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={lm.img}
                  alt={lm.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${lm.color} opacity-60`} />
                <div className="absolute inset-0 flex items-end p-5">
                  <h3
                    className="text-white text-2xl font-bold drop-shadow-lg"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {lm.name}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p
                  className="text-gray-500 text-sm leading-relaxed line-clamp-4"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {lm.description}
                </p>
                <button
                  className="mt-4 text-brand-red text-sm font-medium hover:text-brand-red-dark transition-colors flex items-center gap-1 group"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Learn more
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 7th landmark - wide card */}
        <div
          className="reveal mt-6 card-lift group rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
          style={{ transitionDelay: "0.6s" }}
        >
          <div className="md:flex">
            <div className="relative md:w-80 h-56 md:h-auto overflow-hidden flex-shrink-0">
              <img
                src={landmarks[6].img}
                alt={landmarks[6].name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${landmarks[6].color} opacity-60`}
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span
                className="text-brand-red text-xs tracking-widest uppercase font-medium mb-3"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Featured Landmark
              </span>
              <h3
                className="text-3xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {landmarks[6].name}
              </h3>
              <p
                className="text-gray-500 text-sm leading-relaxed max-w-2xl"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {landmarks[6].description}
              </p>
              <button
                className="mt-6 self-start px-6 py-2.5 bg-brand-red text-white rounded-full text-sm font-medium hover:bg-brand-red-dark transition-all hover:-translate-y-0.5"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Explore This Site
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
