"use client";

import { useEffect, useState } from "react";

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Landmarks", href: "#landmarks" },
  { label: "Attractions", href: "#attractions" },
];

export default function Navbar({
  onOpenLogin,
  onOpenSignUp,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goTo = (href: string) => {
    setMobileOpen(false);

    document
      .querySelector(href)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = () => {
    setMobileOpen(false);
    onOpenLogin();
  };

  const handleSignUp = () => {
    setMobileOpen(false);
    onOpenSignUp();
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
          scrolled
            ? "border-black/[0.06] bg-white/80 shadow-[0_1px_12px_rgba(0,0,0,0.04)] backdrop-blur-2xl"
            : "border-white/10 bg-black/5 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5 md:px-8">

          {/* LOGO */}
          <button
            type="button"
            onClick={() => goTo("#home")}
            className="flex items-center"
            aria-label="Go to homepage"
          >
            <img
              src="/montemarialogo.png"
              alt="Montemaria Batangas"
              className="h-14 w-14 object-contain"
            />
          </button>

          {/* DESKTOP NAVIGATION */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => goTo(link.href)}
                className={`text-[18px] font-medium transition-colors ${
                  scrolled
                    ? "text-[#424245] hover:text-black"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* LOGIN / SIGN UP */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={handleLogin}
              className={`rounded-full px-5 py-2.5 text-[15px] font-medium transition ${
                scrolled
                  ? "text-[#1d1d1f] hover:bg-black/5"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Log in
            </button>

            <button
              type="button"
              onClick={handleSignUp}
              className={`rounded-full px-6 py-2.5 text-[15px] font-semibold transition ${
                scrolled
                  ? "bg-[#1d1d1f] text-white hover:bg-black"
                  : "bg-white text-[#1d1d1f] hover:bg-white/90"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="relative h-10 w-10 md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            <span
              className={`absolute left-2 top-[15px] h-[1.5px] w-6 transition-all ${
                mobileOpen
                  ? "translate-y-[4px] rotate-45 bg-black"
                  : scrolled
                  ? "bg-black"
                  : "bg-white"
              }`}
            />

            <span
              className={`absolute bottom-[15px] left-2 h-[1.5px] w-6 transition-all ${
                mobileOpen
                  ? "-translate-y-[4px] -rotate-45 bg-black"
                  : scrolled
                  ? "bg-black"
                  : "bg-white"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* MOBILE NAVIGATION */}
      <div
        className={`fixed inset-0 z-40 bg-[#f5f5f7] transition-all duration-500 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mx-auto flex h-full max-w-md flex-col justify-center px-8 pt-16">

          <p className="mb-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#86868b]">
            Explore Monte Maria
          </p>

          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => goTo(link.href)}
              className="border-b border-black/[0.08] py-4 text-left text-3xl font-semibold tracking-[-0.03em] text-[#1d1d1f]"
            >
              {link.label}
            </button>
          ))}

          <div className="mt-9 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleLogin}
              className="rounded-full border border-black/20 py-3 text-[15px] font-medium"
            >
              Log in
            </button>

            <button
              type="button"
              onClick={handleSignUp}
              className="rounded-full bg-[#1d1d1f] py-3 text-[15px] font-medium text-white"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </>
  );
}