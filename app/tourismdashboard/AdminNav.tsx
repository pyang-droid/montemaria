
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  LayoutDashboard,
  CreditCard,
  UserRoundCog,
  MapPin,
  Activity,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navLinks = [
  {
    label: "Overview",
    href: "/tourismdashboard",
    icon: LayoutDashboard,
    description: "Dashboard summary",
  },
  {
    label: "Bookings & Payments",
    href: "/tourismdashboard/bookings",
    icon: CreditCard,
    description: "Booking and payment records",
  },
  {
    label: "Staff Assignments",
    href: "/tourismdashboard/staff-assignments",
    icon: UserRoundCog,
    description: "Assign staff to attractions",
  },
  {
    label: "Manage Attractions",
    href: "/tourismdashboard/attractions",
    icon: MapPin,
    description: "Attraction details and capacity",
  },
  {
    label: "Visitor Monitoring",
    href: "/tourismdashboard/monitoring",
    icon: Activity,
    description: "Entry and exit monitoring",
  },
  {
    label: "Manage Accounts",
    href: "/tourismdashboard/accounts",
    icon: Users,
    description: "Visitor and staff accounts",
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const isLinkActive = (href: string) => {
    if (href === "/tourismdashboard") {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await signOut(auth);
      setMobileOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError(
        "Unable to log out. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-5 lg:hidden">
        <Link
          href="/tourismdashboard"
          className="flex items-center gap-3"
        >
          <img
            src="/montemarialogo.png"
            alt="Montemaria Logo"
            className="h-11 w-11 object-contain"
          />

          <div>
            <p
              className="text-xl font-bold text-[#344054]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Montemaria
            </p>

            <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
              Tourism Office
            </p>
          </div>
        </Link>

        <button
          type="button"
          aria-label={
            mobileOpen ? "Close navigation" : "Open navigation"
          }
          aria-expanded={mobileOpen}
          aria-controls="tourism-sidebar"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        id="tourism-sidebar"
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-[280px] flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* BRAND */}
        <div className="border-b border-gray-100 px-6 py-7">
          <Link
            href="/tourismdashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <img
              src="/montemarialogo.png"
              alt="Montemaria Logo"
              className="h-14 w-14 object-contain"
            />

            <div className="min-w-0">
              <p
                className="text-xl font-bold text-[#344054]"
                style={{
                  fontFamily:
                    "'Playfair Display', Georgia, serif",
                }}
              >
                Montemaria
              </p>

              <p
                className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-gray-400"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Tourism Office
              </p>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Administration
          </p>

          <nav className="space-y-2">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all ${
                    active
                      ? "bg-[#c1122f]/10 text-[#c1122f]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? "bg-white text-[#c1122f]"
                        : "bg-gray-100 text-gray-500 group-hover:bg-white"
                    }`}
                  >
                    <Icon size={19} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold">
                      {link.label}
                    </p>

                    <p
                      className={`mt-0.5 text-[10px] ${
                        active
                          ? "text-[#c1122f]/70"
                          : "text-gray-400"
                      }`}
                    >
                      {link.description}
                    </p>
                  </div>

                  {active && (
                    <ChevronRight size={16} className="shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ADMIN ACCOUNT + LOGOUT */}
        <div className="border-t border-gray-100 px-5 py-5">
          <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
              Admin Panel
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              Tourism Administrator
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#c1122f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={17} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* LOGOUT ERROR */}
      {logoutError && (
        <div
          role="alert"
          className="fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl border border-red-200 bg-white px-5 py-4 text-sm text-red-700 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <p>{logoutError}</p>

            <button
              type="button"
              onClick={() => setLogoutError("")}
              aria-label="Dismiss error"
              className="font-bold text-red-500"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
