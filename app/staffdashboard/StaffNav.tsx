"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStaffAuth } from "./StaffAuthGuard";
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Users,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  MapPin,
  Menu,
  X,
} from "lucide-react";

export default function StaffNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { accountData, role, isAdmin, assignedAttraction, logout } = useStaffAuth();

  const navLinks = [
    { label: "Overview", href: "/staffdashboard", icon: LayoutDashboard },
    { label: "QR Scanning", href: "/staffdashboard/qrcode", icon: QrCode },
    { label: "Entry Validation", href: "/staffdashboard/entry-validation", icon: CheckCircle2 },
    { label: "Capacity", href: "/staffdashboard/capacity-monitoring", icon: Users },
  ];

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-black/[0.06] bg-white/80 shadow-[0_1px_12px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-all">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-5 md:px-8">
          
          {/* BRAND LOGO matching Landing Page */}
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/montemarialogo.png"
                alt="Montemaria Batangas Logo"
                className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <span
                  className="block text-xl font-semibold leading-none tracking-[-0.03em] text-[#1d1d1f]"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  Montemaria
                </span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">
                  Staff Portal
                </span>
              </div>
            </Link>

            {/* Station / Terminal Badge in landing page pill style */}
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-black/[0.06] bg-[#f5f5f7] px-3.5 py-1 text-xs text-[#424245]">
              <MapPin className="h-3.5 w-3.5 text-[#c1122f]" />
              <span className="text-[11px] font-medium text-[#86868b]">Station:</span>
              <span className="font-semibold text-[#1d1d1f]">{assignedAttraction || "Mirage Walk"}</span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION PILLS */}
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-black/[0.05] bg-[#f5f5f7]/80 p-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#c1122f] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                      : "text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.02]"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#c1122f]" : "text-[#86868b]"}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* RIGHT CONTROLS: ADMIN SWITCHER & USER PILL */}
          <div className="hidden md:flex items-center gap-3">
            {/* If Tourism Admin, provide landing-style pill button to switch */}
            {isAdmin && (
              <Link
                href="/tourismdashboard"
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-xs font-semibold text-[#1d1d1f] shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-[#f5f5f7]"
                title="Switch to Tourism Admin Dashboard"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[#c1122f]" />
                <span>Admin Office</span>
                <ExternalLink className="h-3 w-3 text-[#86868b]" />
              </Link>
            )}

            {/* User Pill */}
            <div className="flex items-center gap-2.5 rounded-full border border-black/[0.06] bg-[#f5f5f7] pl-3.5 pr-1.5 py-1">
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-xs font-semibold text-[#1d1d1f] truncate max-w-[120px]">
                    {accountData?.fullName || "Staff Officer"}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      isAdmin ? "bg-[#c1122f]/10 text-[#c1122f]" : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {role === "Tourism" ? "Admin" : "Staff"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#86868b] shadow-xs transition hover:text-[#c1122f] hover:shadow-sm"
                title="Sign out of Terminal"
                aria-label="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-[#f5f5f7] text-[#1d1d1f] md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl pt-24 px-6 pb-8 md:hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="rounded-[24px] border border-black/[0.06] bg-[#f5f5f7] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider">Active Staff</p>
                  <p className="text-base font-semibold text-[#1d1d1f] mt-0.5">{accountData?.fullName}</p>
                  <p className="text-xs text-[#86868b] font-mono">{accountData?.email}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    isAdmin ? "bg-[#c1122f]/10 text-[#c1122f]" : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {role}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-black/[0.05] flex items-center gap-2 text-xs text-[#424245]">
                <MapPin className="h-3.5 w-3.5 text-[#c1122f]" />
                <span>Station: <strong>{assignedAttraction}</strong></span>
              </div>
            </div>

            <div className="space-y-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#c1122f]/10 text-[#c1122f]"
                        : "text-[#424245] hover:bg-[#f5f5f7]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-[#c1122f]" : "text-[#86868b]"}`} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {isAdmin && (
              <Link
                href="/tourismdashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-2xl border border-black/[0.08] bg-white p-4 text-sm font-semibold text-[#1d1d1f] shadow-xs"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-[#c1122f]" />
                  Tourism Administrator Dashboard
                </span>
                <ExternalLink className="h-4 w-4 text-[#86868b]" />
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              logout();
            }}
            className="w-full rounded-full border border-black/10 bg-white py-3.5 text-sm font-semibold text-[#c1122f] shadow-xs hover:bg-red-50 flex items-center justify-center gap-2 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign Out of Terminal
          </button>
        </div>
      )}
    </>
  );
}
