"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Landmarks", href: "#landmarks" },
  { label: "Attractions", href: "#attractions" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (label: string, href: string) => {
    setActive(label);
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white shadow-lg shadow-red-900/10 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNav("Home", "#home")}
            className="flex items-center gap-3 group"
          >
            {/* Cross Icon */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div
                className={`bg-black absolute w-1 h-8 rounded-full transition-colors ${
                  scrolled ? "bg-brand-red" : "bg-white"
                }`}
              />
              <div
                className={`bg-black absolute w-7 h-1 rounded-full transition-colors ${
                  scrolled ? "bg-brand-red" : "bg-white"
                }`}
              />
            </div>
            <span
              className={`text-gray-700 font-serif text-xl font-bold tracking-wide transition-colors ${
                scrolled ? "text-brand-red" : "text-white"
              }`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Monte Maria
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.label, link.href)}
                className={`text-gray-700 nav-link text-sm tracking-widest uppercase font-body font-medium transition-colors ${
                  scrolled
                    ? active === link.label
                      ? "text-brand-red"
                      : "text-gray-700 hover:text-black"
                    : active === link.label
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                } ${active === link.label ? "active" : ""}`}
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all duration-300 ${
                scrolled
                  ? "border-gray-700 text-gray-700 hover:bg-black hover:text-white"
                  : "border-white text-white hover:bg-white hover:text-black"
              }`}
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Login
            </Link>
            <Link
              href="/signup"
               className={`px-5 py-2 text-sm font-medium rounded-full border transition-all duration-300 ${
                scrolled
                  ? "border-gray-700 text-gray-700 hover:bg-black hover:text-white"
                  : "border-white text-white hover:bg-white hover:text-black"
              }`}
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              } ${scrolled ? "bg-gray-700" : "bg-white"}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              } ${scrolled ? "bg-gray-700" : "bg-white"}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              } ${scrolled ? "bg-gray-700" : "bg-white"}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
       <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-500 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full flex flex-col justify-center items-center px-6">
          <div className="flex flex-col gap-6 w-full max-w-xs">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.label, link.href)}
                className={`text-2xl font-serif text-black text-left py-3 border-b-2 transition-all ${
                  active === link.label
                    ? "border-brand-red text-brand-red"
                    : "border-transparent hover:border-gray-300"
                }`}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {link.label}
              </button>
            ))}
            
            <div className="flex flex-col gap-3 mt-6">
              <Link
                href="/login"
                className="w-full py-3 border border-black text-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition-all"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="w-full py-3 border border-black text-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}