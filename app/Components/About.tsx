import Image from "next/image";

const experiences = [
  {
    title: "Walk the Pilgrimage Path",
    description: "Take the 1,200+ steps of the pilgrimage at your own pace and pause for reflection along the way.",
    image: "/p1.jpg",
    alt: "The Miracle Walk at Monte Maria",
  },
  {
    title: "Visit the Chapels",
    description: "Spend a quiet moment in prayer at one of Monte Maria’s three sacred chapels, including Santo Niño Chapel.",
    image: "/sto.nino.jpg",
    alt: "Santo Niño Chapel",
  },
  {
    title: "Take In the Coastal Views",
    description: "Look out over the Batangas coastline from the hilltop.",
    image: "/p8.jpg",
    alt: "The Batangas coastline seen from Monte Maria",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-[#f5f5f7] pb-8 pt-16 md:pb-10 md:pt-20">
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
              A place to slow down, pray, and give thanks for countless blessings received.
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

        <section
          aria-labelledby="experience-heading"
          className="mt-12 rounded-[32px] bg-[#faf7f0] p-5 text-[#18283b] sm:p-8 lg:mt-16 lg:p-10"
        >
          <h2
            id="experience-heading"
            className="text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Experience Monte Maria
          </h2>
          <p className="mb-7 mt-2 text-base leading-relaxed text-[#465467]">
            Monte Maria welcomes visitors 365 days a year.
          </p>

          <div className="grid gap-8 md:grid-cols-[3fr_2fr]">
            {experiences.map((experience, index) => (
              <article
                key={experience.title}
                className="flex min-w-0 flex-col md:first:row-span-2"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] md:aspect-[2/1] md:min-h-36 md:flex-1">
                  <Image
                    src={experience.image}
                    alt={experience.alt}
                    fill
                    sizes={index === 0
                      ? "(min-width: 1280px) 660px, (min-width: 768px) 55vw, 100vw"
                      : "(min-width: 1280px) 440px, (min-width: 768px) 37vw, 100vw"}
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{experience.title}</h3>
                <p className="mt-1 text-base leading-relaxed text-[#465467]">
                  {experience.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}