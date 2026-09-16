"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // FIXED: Routing paths point to valid Next.js route folders
  const navLinks = [
    { label: "Map", href: "/tourismdashboard", icon: "🗺️" },
    { label: "Analytics", href: "/tourismdashboard/analytics", icon: "📊" },
    { label: "Alerts", href: "/tourismdashboard/alerts", icon: "🔔" },
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
            <div>
              <span
                className="text-xl font-bold text-gray-700 block line-height-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Monte Maria
              </span>
              <span
                className="text-[10px] text-gray-400 uppercase tracking-widest block -mt-1"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Tourism Office
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative text-sm tracking-widest uppercase font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "text-gray-400 font-semibold after:w-full after:bg-brand-red"
                      : "text-gray-700 hover:text-brand-red after:w-0 hover:after:w-full after:bg-brand-red"
                  } after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:transition-all after:duration-300`}
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Admin Menu */}
          <div className="hidden md:flex items-center gap-3">
            <span 
              className="text-xs text-gray-400 uppercase tracking-wider font-semibold"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Admin Panel
            </span>
            <button
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-all flex items-center gap-2 text-sm"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Logout
            </button>
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
                className={`text-2xl font-serif text-left py-3 border-b-2 transition-all flex items-center gap-3 ${
                  pathname === link.href
                    ? "border-brand-red text-brand-red"
                    : "border-transparent text-black hover:border-gray-300"
                }`}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                
                {link.label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <span 
                className="text-xs text-center text-gray-400 uppercase tracking-widest font-medium"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Admin Panel Settings
              </span>
              <button
                className="w-full py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-all"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}