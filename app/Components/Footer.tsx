export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        <div className="grid gap-10 border-b border-black/10 pb-10 md:grid-cols-3">

          {/* BRAND */}
          <div>
            <img
              src="/montemarialogo.png"
              alt="Montemaria Batangas"
              className="h-16 w-16 object-contain"
            />

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#6e6e73]">
              A destination for faith, reflection, discovery, and memorable
              experiences in Batangas.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-sm font-semibold text-[#1d1d1f]">
              Explore
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              {[
                ["Home", "#home"],
                ["About", "#about"],
                ["Gallery", "#gallery"],
                ["Landmarks", "#landmarks"],
                ["Attractions", "#attractions"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="w-fit text-sm text-[#6e6e73] transition hover:text-[#1d1d1f]"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* VISIT */}
          <div>
            <h3 className="text-sm font-semibold text-[#1d1d1f]">
              Visit Monte Maria
            </h3>

            <div className="mt-4 space-y-2 text-sm leading-6 text-[#6e6e73]">
              <p>Pagkilatan, Batangas City, Philippines</p>
              <p>Open daily</p>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="flex flex-col gap-3 pt-6 text-xs text-[#86868b] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Monte Maria. All rights reserved.
          </p>

          <p>
            Montemaria Express
          </p>
        </div>
      </div>
    </footer>
  );
}