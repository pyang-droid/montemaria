"use client";

import { useEffect, useState } from "react";

const galleryImages = [
  {
    id: 1,
    src: "/p1.jpg",
    alt: "Monte Maria attraction",
  },
  {
    id: 2,
    src: "/p2.jpg",
    alt: "Monte Maria retreat facility",
  },
  {
    id: 3,
    src: "/p3.jpg",
    alt: "Monte Maria view",
  },
  {
    id: 4,
    src: "/p4.jpg",
    alt: "Monte Maria pilgrimage",
  },
  {
    id: 5,
    src: "/p5.jpg",
    alt: "Monte Maria view deck",
  },
  {
    id: 6,
    src: "/p6.jpg",
    alt: "Monte Maria grounds",
  },
  {
    id: 7,
    src: "/p7.jpg",
    alt: "Monte Maria church",
  },
  {
    id: 8,
    src: "/p8.jpg",
    alt: "Monte Maria coastal view",
  },
  {
    id: 9,
    src: "/p9.jpg",
    alt: "Monte Maria attraction",
  },
  {
    id: 10,
    src: "/p10.jpg",
    alt: "Monte Maria sacred site",
  },
  {
    id: 11,
    src: "/p11.jpg",
    alt: "Monte Maria glass walk",
  },
  {
    id: 12,
    src: "/p12.jpg",
    alt: "Monte Maria pilgrims",
  },
];

export default function Gallery() {
  const [lightbox, setLightbox] =
    useState<(typeof galleryImages)[number] | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <section id="gallery" className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {/* HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-medium text-[#6e6e73]">
                Gallery
              </p>

              <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f] md:text-5xl lg:text-6xl">
                Get the highlights.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-[#86868b] md:text-base">
              A closer look at the sacred spaces, breathtaking views, and
              memorable moments around Monte Maria.
            </p>
          </div>

          {/* FEATURED GRID */}
          <div className="grid gap-4 md:grid-cols-12">

            {/* LARGE FEATURE */}
            <button
              type="button"
              onClick={() => setLightbox(galleryImages[0])}
              className="group relative overflow-hidden rounded-[28px] md:col-span-7"
            >
              <img
                src={galleryImages[0].src}
                alt={galleryImages[0].alt}
                className="h-[330px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] md:h-[430px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 p-6 text-left md:p-8">
                <p className="text-sm font-medium text-white/75">
                  Experience Monte Maria
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-white md:text-3xl">
                  Views worth remembering.
                </h3>
              </div>
            </button>

            {/* RIGHT FEATURE */}
            <button
              type="button"
              onClick={() => setLightbox(galleryImages[4])}
              className="group relative overflow-hidden rounded-[28px] md:col-span-5"
            >
              <img
                src={galleryImages[4].src}
                alt={galleryImages[4].alt}
                className="h-[330px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] md:h-[430px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 p-6 text-left md:p-8">
                <p className="text-sm font-medium text-white/75">
                  Above Batangas
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-white">
                  See the horizon.
                </h3>
              </div>
            </button>
          </div>

          {/* SMALL IMAGES */}
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {galleryImages.slice(1, 5).map((image) => (
              <button
                type="button"
                key={image.id}
                onClick={() => setLightbox(image)}
                className="group overflow-hidden rounded-[24px]"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-[170px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[210px]"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {/* MORE PHOTOS */}
          <div className="mt-4 grid grid-cols-3 gap-4 md:grid-cols-7">
            {galleryImages.slice(5).map((image) => (
              <button
                type="button"
                key={image.id}
                onClick={() => setLightbox(image)}
                className="group overflow-hidden rounded-[20px]"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-[120px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[150px]"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-5 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
            aria-label="Close image"
          >
            ×
          </button>

          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[85vh] max-w-5xl rounded-[24px] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}