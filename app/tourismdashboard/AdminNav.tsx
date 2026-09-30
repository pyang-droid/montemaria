"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* =========================================================
   FIREBASE CONFIGURATION
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyAE0fspY9xXQBBwcHPtvs523L1vZS-C1CE",
  authDomain: "monte-maria.firebaseapp.com",
  projectId: "monte-maria",
  storageBucket: "monte-maria.firebasestorage.app",
  messagingSenderId: "381198821409",
  appId: "1:381198821409:web:b17cb90e0184d4c35fdb60",
  measurementId: "G-VZ13LW8K94",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export { app };

/* =========================================================
   ADMIN NAVIGATION
========================================================= */

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /* =========================================================
     NAVIGATION LINKS
  ========================================================= */

  const navLinks = [
    {
      label: "Overview",
      href: "/tourismdashboard",
    },
    {
      label: "Reservations",
      href: "/tourismdashboard/reservations",
    },
    {
      label: "Visitor Records",
      href: "/tourismdashboard/records",
    },
    {
      label: "Attractions",
      href: "/tourismdashboard/attractions",
    },
    {
      label: "Monitoring",
      href: "/tourismdashboard/monitoring",
    },
    {
      label: "Users",
      href: "/tourismdashboard/users",
    },
  ];

  /* =========================================================
     CHECK ACTIVE PAGE
  ========================================================= */

  const isLinkActive = (href: string) => {
    if (href === "/tourismdashboard") {
      return pathname === "/tourismdashboard";
    }

    return pathname.startsWith(href);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      // Sign out the currently authenticated Firebase user
      await signOut(auth);

      // Close mobile menu if it is open
      setMobileOpen(false);

      // Redirect to homepage
      router.replace("/");

      // Refresh Next.js router state
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);

      alert("Unable to log out. Please try again.");

      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* =====================================================
          MAIN NAVIGATION
      ====================================================== */}

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-6 lg:px-8">

          {/* =================================================
              LOGO / BRAND
          ================================================== */}

          <Link
            href="/tourismdashboard"
            className="flex flex-shrink-0 items-center gap-3"
          >
            <img
              src="/montemarialogo.png"
              alt="Montemaria Logo"
              className="h-12 w-12 object-contain"
            />

            <div className="leading-none">
              <span
                className="block text-xl font-bold text-[#344054]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                Montemaria
              </span>

              <span
                className="mt-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Tourism Office
              </span>
            </div>
          </Link>

          {/* =================================================
              DESKTOP MENU
          ================================================== */}

          <div className="hidden items-center gap-5 xl:flex">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative whitespace-nowrap py-2 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors duration-200 ${
                    active
                      ? "text-[#c1122f]"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  style={{
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  {link.label}

                  {/* ACTIVE UNDERLINE */}

                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-[#c1122f] transition-all duration-300 ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* =================================================
              DESKTOP ADMIN INFORMATION
          ================================================== */}

          <div className="hidden flex-shrink-0 items-center gap-4 xl:flex">
            <div className="text-right">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Admin Panel
              </p>

              <p
                className="mt-0.5 text-xs font-medium text-gray-600"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Tourism Administrator
              </p>
            </div>

            {/* DESKTOP LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                fontFamily: "'Lato', sans-serif",
              }}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen((previous) => !previous)
            }
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-gray-200 xl:hidden"
          >
            <span
              className={`block h-[2px] w-5 bg-gray-700 transition-all duration-300 ${
                mobileOpen
                  ? "translate-y-[7px] rotate-45"
                  : ""
              }`}
            />

            <span
              className={`block h-[2px] w-5 bg-gray-700 transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block h-[2px] w-5 bg-gray-700 transition-all duration-300 ${
                mobileOpen
                  ? "-translate-y-[7px] -rotate-45"
                  : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* =====================================================
          MOBILE / TABLET MENU
      ====================================================== */}

      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-300 xl:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex min-h-screen flex-col px-7 pb-10 pt-28">

          {/* =================================================
              MOBILE BRAND
          ================================================== */}

          <div className="mb-7 flex items-center gap-4 border-b border-gray-200 pb-6">
            <img
              src="/montemarialogo.png"
              alt="Montemaria Logo"
              className="h-14 w-14 object-contain"
            />

            <div>
              <h2
                className="text-2xl font-bold text-gray-900"
                style={{
                  fontFamily:
                    "'Playfair Display', Georgia, serif",
                }}
              >
                Montemaria
              </h2>

              <p
                className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c1122f]"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Tourism Administration
              </p>
            </div>
          </div>

          {/* =================================================
              MOBILE NAVIGATION LINKS
          ================================================== */}

          <div className="flex flex-col">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`border-b border-gray-100 py-4 text-xl font-semibold transition-colors ${
                    active
                      ? "text-[#c1122f]"
                      : "text-gray-800 hover:text-[#c1122f]"
                  }`}
                  style={{
                    fontFamily:
                      "'Playfair Display', Georgia, serif",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* =================================================
              MOBILE ADMIN ACCOUNT
          ================================================== */}

          <div className="mt-auto border-t border-gray-200 pt-6">
            <div className="mb-5 text-center">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Admin Panel
              </p>

              <p
                className="mt-1 text-sm font-medium text-gray-700"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Tourism Administrator
              </p>
            </div>

            {/* MOBILE LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full rounded-full border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                fontFamily: "'Lato', sans-serif",
              }}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}