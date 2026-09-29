"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Attractions", href: "/dashboard" },
  ];

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-2">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* ================= MONTEMARIA LOGO ================= */}
          <Link
            href="/"
            className="flex items-center"
            aria-label="Go to Monte Maria homepage"
          >
            <img
              src="/montemarialogo.png"
              alt="Montemaria Batangas Logo"
              className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative text-sm tracking-widest uppercase font-medium transition-colors ${
                    isActive
                      ? "text-gray-700 after:w-full after:bg-gray-300"
                      : "text-gray-700 hover:text-brand-red after:w-0 hover:after:w-full after:bg-brand-red"
                  } after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:transition-all after:duration-300`}
                  style={{
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* ================= PROFILE ================= */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard/profile"
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-all flex items-center gap-2"
              style={{
                fontFamily: "'Lato', sans-serif",
              }}
            >
              <span>👤</span>
              Profile
            </Link>
          </div>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            type="button"
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-brand-red transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />

            <span
              className={`block w-6 h-0.5 bg-brand-red transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block w-6 h-0.5 bg-brand-red transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-500 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full flex flex-col justify-center items-center px-6">
          <div className="flex flex-col gap-6 w-full max-w-xs">

            {/* MOBILE NAVIGATION LINKS */}
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-2xl font-serif text-left py-3 border-b-2 transition-all ${
                  pathname === link.href
                    ? "border-brand-red text-brand-red"
                    : "border-transparent text-black hover:border-gray-300"
                }`}
                style={{
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* MOBILE PROFILE */}
            <Link
              href="/dashboard/profile"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-all text-center"
              style={{
                fontFamily: "'Lato', sans-serif",
              }}
            >
              👤 Profile
            </Link>

            {/* MOBILE LOGOUT */}
            <button
              type="button"
              className="w-full py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-all"
              style={{
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}