
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    {
      label: "Attractions",
      href: "/dashboard",
    },
  ];

  // ============================================
  // CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
  // ============================================

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // ============================================
  // CLOSE MENUS WHEN ROUTE CHANGES
  // ============================================

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // ============================================
  // OPEN LOGOUT CONFIRMATION
  // ============================================

  const handleLogoutClick = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    setLogoutOpen(true);
  };

  // ============================================
  // CONFIRM LOGOUT
  // ============================================

  const handleConfirmLogout = () => {
    setLogoutOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);

    // Frontend-only redirect.
    // Add actual authentication sign-out
    // here when the backend is implemented.

    router.replace("/");
  };

  // ============================================
  // CANCEL LOGOUT
  // ============================================

  const handleCancelLogout = () => {
    setLogoutOpen(false);
  };

  return (
    <>
      {/* ============================================
          NAVBAR
      ============================================ */}

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-2">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* ======================================
              MONTEMARIA LOGO
          ====================================== */}

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

          {/* ======================================
              DESKTOP NAVIGATION
          ====================================== */}

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

          {/* ======================================
              DESKTOP PROFILE DROPDOWN
          ====================================== */}

          <div
            className="hidden md:flex items-center"
            ref={profileRef}
          >
            <div className="relative">

              {/* PROFILE BUTTON */}

              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                className={`px-4 py-2 text-gray-700 border rounded-full transition-all flex items-center gap-2 ${
                  profileOpen
                    ? "bg-gray-100 border-gray-400"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                <span>👤</span>
                <span>Profile</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* PROFILE DROPDOWN */}

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-[60]">

                  {/* MY PROFILE */}

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    style={{
                      fontFamily: "'Lato', sans-serif",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21a8 8 0 0 1 16 0" />
                    </svg>

                    My Profile
                  </Link>

                  <div className="h-px bg-gray-100 mx-3" />

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-5 py-4 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    style={{
                      fontFamily: "'Lato', sans-serif",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>

                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ======================================
              MOBILE MENU BUTTON
          ====================================== */}

          <button
            type="button"
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-brand-red transition-all duration-300 ${
                mobileOpen
                  ? "rotate-45 translate-y-2"
                  : ""
              }`}
            />

            <span
              className={`block w-6 h-0.5 bg-brand-red transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block w-6 h-0.5 bg-brand-red transition-all duration-300 ${
                mobileOpen
                  ? "-rotate-45 -translate-y-2"
                  : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* ============================================
          MOBILE MENU
      ============================================ */}

      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-500 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
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
              onClick={handleLogoutClick}
              className="w-full py-3 border border-red-200 text-red-600 rounded-full text-sm hover:bg-red-50 transition-all"
              style={{
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ============================================
          LOGOUT CONFIRMATION MODAL
      ============================================ */}

      {logoutOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          role="presentation"
          onClick={handleCancelLogout}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LOGOUT ICON */}

            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="m16 17 5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </div>

            {/* TITLE */}

            <h2
              id="logout-title"
              className="text-2xl font-bold text-gray-900 mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Confirm Logout
            </h2>

            {/* DESCRIPTION */}

            <p
              className="text-gray-500 text-sm leading-6 mb-7"
              style={{
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Are you sure you want to log out
              of your Montemaria Express account?
            </p>

            {/* ACTION BUTTONS */}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelLogout}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
