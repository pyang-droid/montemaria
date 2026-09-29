"use client";

const landmarks = [
  {
    name: "View Deck",
    description:
      "A panoramic destination overlooking the surrounding landscape and Batangas coastline.",
    img: "/p5.jpg",
  },
  {
    name: "Miracle Walk",
    description:
      "A peaceful pathway designed for prayer, reflection, and meaningful moments.",
    img: "/p1.jpg",
  },
  {
    name: "Glass Walk",
    description:
      "A transparent elevated walkway offering dramatic views and an unforgettable experience.",
    img: "/p11.jpg",
  },
  {
    name: "Gate of the Archangels",
    description:
      "A remarkable entrance welcoming visitors into the sacred grounds of Monte Maria.",
    img: "/gate.jpg",
  },
  {
    name: "Sto. Niño Chapel",
    description:
      "A quiet chapel dedicated to the Holy Child Jesus and a place for personal prayer.",
    img: "/sto.nino.jpg",
  },
  {
    name: "Retreat Facility",
    description:
      "A calm environment for recollection, spiritual gatherings, seminars, and community reflection.",
    img: "/p2.jpg",
  },
  {
    name: "St. John Paul II Chapel",
    description:
      "A chapel honoring Saint John Paul II and his enduring message of faith, hope, and human dignity.",
    img: "/p10.jpg",
  },
];

export default function Landmarks() {
  return (
    <section id="landmarks" className="bg-[#f5f5f7] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-medium text-[#6e6e73]">
              Explore Monte Maria
            </p>

            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f] md:text-5xl lg:text-6xl">
              Sacred landmarks.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[#86868b] md:text-base">
            Discover spaces of devotion, reflection, breathtaking scenery,
            and memorable experiences throughout Monte Maria.
          </p>
        </div>

        {/* FIRST LARGE ROW */}
        <div className="grid gap-4 lg:grid-cols-2">
          {landmarks.slice(0, 2).map((landmark) => (
            <article
              key={landmark.name}
              className="group relative h-[360px] overflow-hidden rounded-[30px] md:h-[420px]"
            >
              <img
                src={landmark.img}
                alt={landmark.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <h3 className="text-3xl font-semibold tracking-tight text-white">
                  {landmark.name}
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-6 text-white/75 md:text-base">
                  {landmark.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* SECOND ROW */}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {landmarks.slice(2, 5).map((landmark) => (
            <article
              key={landmark.name}
              className="group relative h-[320px] overflow-hidden rounded-[28px]"
            >
              <img
                src={landmark.img}
                alt={landmark.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-2xl font-semibold text-white">
                  {landmark.name}
                </h3>

                <p className="mt-2 text-sm leading-5 text-white/70">
                  {landmark.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* LAST ROW */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {landmarks.slice(5).map((landmark) => (
            <article
              key={landmark.name}
              className="group relative h-[300px] overflow-hidden rounded-[28px]"
            >
              <img
                src={landmark.img}
                alt={landmark.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-7">
                <h3 className="text-2xl font-semibold text-white md:text-3xl">
                  {landmark.name}
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                  {landmark.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}