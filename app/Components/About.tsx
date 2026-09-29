"use client";

const stats = [
  { value: "1,200+", label: "Steps of pilgrimage" },
  { value: "3", label: "Sacred chapels" },
  { value: "365", label: "Days open" },
  { value: "∞", label: "Blessings received" },
];

export default function About() {
  return (
    <section id="about" className="bg-[#f5f5f7] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* MAIN CONTENT */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* LEFT */}
          <div>
            <p className="mb-4 text-sm font-medium text-[#6e6e73]">
              Our story
            </p>

            <h2 className="max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#1d1d1f] md:text-6xl lg:text-7xl">
              A place shaped by
              <span className="block text-[#c1122f]">
                faith and wonder.
              </span>
            </h2>

            <p className="mt-8 max-w-xl text-lg font-medium leading-relaxed text-[#424245] md:text-xl">
              Nestled on a mountain overlooking the Batangas coastline,
              Monte Maria welcomes pilgrims, families, and travelers to a
              sanctuary of prayer, reflection, beauty, and unforgettable views.
            </p>

            <p className="mt-5 max-w-lg text-sm leading-6 text-[#86868b]">
              Sacred landmarks, peaceful spaces, and dramatic scenery come
              together in a destination created for moments of devotion and
              discovery.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative overflow-hidden rounded-[32px]">
            <img
              src="/monte2.jpg"
              alt="Monte Maria overlooking the Batangas coastline"
              className="h-[420px] w-full object-cover md:h-[500px]"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-7 pt-24">
              <p className="text-sm font-semibold text-white">
                Montemaria, Batangas
              </p>
              <p className="mt-1 max-w-sm text-sm text-white/75">
                Faith, reflection, and breathtaking views above the coast.
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[24px] bg-white px-6 py-6"
            >
              <p className="text-3xl font-semibold tracking-tight text-[#1d1d1f] md:text-4xl">
                {stat.value}
              </p>

              <p className="mt-2 text-sm text-[#86868b]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}