"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Attractions", href: "/dashboard" },
    { label: "Map", href: "/dashboard/map" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute w-1 h-8 rounded-full bg-gray-700" />
              <div className="absolute w-8 h-1 rounded-full bg-gray-700" />
            </div>
            <span
              className="text-xl font-bold text-gray-700"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Monte Maria
            </span>
          </Link>

          {/* Desktop Nav */}
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
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
         {link.label}
        </Link>
        );
      })}
        </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard/profile"
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-all flex items-center gap-2"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              <span>👤</span> Profile
            </Link>
            
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
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

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-500 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full flex flex-col justify-center items-center px-6">
          <div className="flex flex-col gap-6 w-full max-w-xs">
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
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard/profile"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-all text-center"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              👤 Profile
            </Link>
            <button
              className="w-full py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-all"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}