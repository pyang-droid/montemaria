"use client";

import { useEffect, useState } from "react";

/* =========================================================
   PROPS
========================================================= */

interface AttractionsProps {
  onPlanVisit: () => void;
}

/* =========================================================
   ATTRACTION DATA
========================================================= */

const attractions = [
  {
    name: "Mirage Walk",
    tagline: "An illusion of infinite space.",
    description:
      "Step into a captivating visual experience where reflective surfaces and carefully positioned elements create the illusion of endless pathways and extraordinary perspectives.",
    highlights: [
      "Stunning visual illusions",
      "Perfect for photography",
      "Suitable for all ages",
      "Unique experience",
    ],
    img: "/p1.jpg",
    badge: "New Experience",
  },
  {
    name: "View Deck",
    tagline: "See Batangas from above.",
    description:
      "Take in sweeping views of the surrounding landscape and coastline from one of Monte Maria's most memorable vantage points.",
    highlights: [
      "Panoramic scenery",
      "Great photography spot",
      "Open-air experience",
      "Coastal views",
    ],
    img: "/p5.jpg",
    badge: "Popular",
  },
  {
    name: "Glass Walk",
    tagline: "A different way to see the view.",
    description:
      "Experience the scenery through a transparent elevated walkway that combines breathtaking surroundings with a memorable sense of adventure.",
    highlights: [
      "Transparent walkway",
      "Elevated views",
      "Unique experience",
      "Scenic photography",
    ],
    img: "/p11.jpg",
    badge: "Adventure",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function Attractions({
  onPlanVisit,
}: AttractionsProps) {
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const current = attractions[active];

  /* =========================================================
     AUTO PLAY
     Changes attraction every 5 seconds
  ========================================================= */

  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      setActive(
        (previous) => (previous + 1) % attractions.length
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isPlaying]);

  /* =========================================================
     MANUAL SELECT
  ========================================================= */

  const selectAttraction = (index: number) => {
    setActive(index);
  };

  return (
    <section
      id="attractions"
      className="bg-black py-16 text-white md:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-medium text-[#a1a1a6]">
              Experiences
            </p>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-white md:text-5xl lg:text-6xl">
              More to experience.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[#a1a1a6] md:text-base">
            Discover experiences that bring together scenery,
            exploration, and memorable moments at Monte Maria.
          </p>
        </div>

        {/* =====================================================
            ATTRACTION SELECTOR
        ===================================================== */}

        <div className="mb-7 flex flex-wrap gap-2">
          {attractions.map((attraction, index) => (
            <button
              type="button"
              key={attraction.name}
              onClick={() => selectAttraction(index)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                active === index
                  ? "bg-white text-black"
                  : "bg-[#1d1d1f] text-[#a1a1a6] hover:text-white"
              }`}
            >
              {attraction.name}
            </button>
          ))}
        </div>

        {/* =====================================================
            MAIN ATTRACTION CARD
        ===================================================== */}

        <div className="overflow-hidden rounded-[32px] bg-[#1d1d1f]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">

            {/* ================= IMAGE ================= */}

            <div className="relative min-h-[360px] overflow-hidden md:min-h-[480px]">
              {attractions.map((attraction, index) => (
                <img
                  key={attraction.name}
                  src={attraction.img}
                  alt={attraction.name}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                    active === index
                      ? "scale-100 opacity-100"
                      : "pointer-events-none scale-[1.03] opacity-0"
                  }`}
                />
              ))}

              {/* IMAGE OVERLAY */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/15" />

              {/* BADGE */}

              <div className="absolute left-6 top-6">
                <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-black backdrop-blur-md">
                  {current.badge}
                </span>
              </div>
            </div>

            {/* ================= CONTENT ================= */}

            <div
              key={current.name}
              className="flex flex-col justify-center p-7 md:p-10 lg:p-12"
            >
              {/* TAGLINE */}

              <p className="text-sm font-medium text-[#a1a1a6]">
                {current.tagline}
              </p>

              {/* NAME */}

              <h3 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                {current.name}
              </h3>

              {/* DESCRIPTION */}

              <p className="mt-6 text-base leading-7 text-[#a1a1a6]">
                {current.description}
              </p>

              {/* HIGHLIGHTS */}

              <div className="mt-7 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                {current.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-2 text-sm text-[#d2d2d7]"
                  >
                    <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c1122f]" />

                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* =================================================
                  PLAN YOUR VISIT

                  IMPORTANT:
                  This no longer redirects directly to /dashboard.
                  It opens the shared login modal from app/page.tsx.
              ================================================== */}

              <div className="mt-9">
                <button
                  type="button"
                  onClick={onPlanVisit}
                  className="rounded-full bg-[#c1122f] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#a70f28]"
                >
                  Plan your visit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CAROUSEL CONTROLS
        ===================================================== */}

        <div className="mt-8 flex items-center justify-center gap-4">

          {/* DOT / PROGRESS CONTAINER */}

          <div className="flex items-center gap-4 rounded-full bg-[#1d1d1f] px-5 py-4">
            {attractions.map((attraction, index) => (
              <button
                type="button"
                key={attraction.name}
                onClick={() => selectAttraction(index)}
                aria-label={`View ${attraction.name}`}
                className="group flex h-3 items-center justify-center"
              >
                {active === index ? (
                  <span className="relative block h-2 w-14 overflow-hidden rounded-full bg-white/25">

                    {/* PROGRESS */}

                    {isPlaying ? (
                      <span
                        key={`${active}-${isPlaying}`}
                        className="absolute inset-y-0 left-0 rounded-full bg-white"
                        style={{
                          animation:
                            "attractionProgress 5s linear forwards",
                        }}
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-full bg-white" />
                    )}
                  </span>
                ) : (
                  <span className="block h-2 w-2 rounded-full bg-white/40 transition-all group-hover:bg-white/70" />
                )}
              </button>
            ))}
          </div>

          {/* PLAY / PAUSE BUTTON */}

          <button
            type="button"
            onClick={() =>
              setIsPlaying((previous) => !previous)
            }
            aria-label={
              isPlaying
                ? "Pause slideshow"
                : "Play slideshow"
            }
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d1d1f] text-white transition-all duration-300 hover:bg-[#2c2c2e]"
          >
            {isPlaying ? (
              /* PAUSE ICON */

              <div className="flex items-center gap-1">
                <span className="h-4 w-1.5 rounded-sm bg-white" />
                <span className="h-4 w-1.5 rounded-sm bg-white" />
              </div>
            ) : (
              /* PLAY ICON */

              <span
                className="ml-1 block h-0 w-0"
                style={{
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  borderLeft: "12px solid white",
                }}
              />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          PROGRESS BAR ANIMATION
      ===================================================== */}

      <style jsx>{`
        @keyframes attractionProgress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}