"use client";

import { useState } from "react";
import Link from "next/link";
import StaffAuthGuard, { useStaffAuth } from "./StaffAuthGuard";
import StaffNav from "./StaffNav";
import {
  useStaffOperations,
} from "./useStaffOperations";
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  MapPin,
  Clock,
  ArrowRightLeft,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  Plus,
  Minus,
  ExternalLink,
  Info,
  KeyRound,
  FileText,
  BadgeCheck,
} from "lucide-react";

function StaffDashboardContent() {
  const { accountData, role, isAdmin, assignedAttraction, setAssignedAttraction } = useStaffAuth();
  const staffName = accountData?.fullName || "Staff Officer";

  const {
    attractions,
    currentAttraction,
    setActiveAttractionName,
    scanMode,
    setScanMode,
    isQueuePaused,
    setIsQueuePaused,
    logs,
    lastVerification,
    setLastVerification,
    verifyAndProcessCode,
    confirmAdmission,
    manualAdjustCount,
    totalEntriesToday,
    totalExitsToday,
  } = useStaffOperations(assignedAttraction, staffName);

  const [inputCode, setInputCode] = useState("");
  const [stationModalOpen, setStationModalOpen] = useState(false);

  const handleScanSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCode.trim()) return;
    verifyAndProcessCode(inputCode);
    setInputCode("");
  };

  const occupancyRatio = currentAttraction.capacity > 0
    ? (currentAttraction.currentVisitors / currentAttraction.capacity) * 100
    : 0;

  const getCapacityColor = (ratio: number) => {
    if (ratio >= 95) return "text-red-700 bg-red-50 border-red-200";
    if (ratio >= 75) return "text-amber-800 bg-amber-50 border-amber-200";
    return "text-emerald-800 bg-emerald-50 border-emerald-200";
  };

  const getProgressBarColor = (ratio: number) => {
    if (ratio >= 95) return "bg-red-500";
    if (ratio >= 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <>
      <StaffNav />
      <main className="min-h-screen bg-[#f5f5f7] pt-26 pb-20 px-5 md:px-8">
        <div className="max-w-[1280px] mx-auto space-y-7">

          {/* TOP DUAL ACCESS NOTIFICATION FOR ADMINS */}
          {isAdmin && (
            <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-[0_1px_12px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c1122f]/10 text-[#c1122f]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#1d1d1f]">
                    Administrator Clearance Active
                  </h2>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    You have elevated access to oversee all station terminals, headcounts, and operational controls.
                  </p>
                </div>
              </div>
              <Link
                href="/tourismdashboard"
                className="rounded-full bg-[#1d1d1f] hover:bg-black text-white px-5 py-2.5 text-xs font-semibold shadow-xs transition-all duration-200 hover:scale-[1.02] flex items-center gap-2 shrink-0"
              >
                Go to Tourism Admin Office
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* HEADER SECTION MATCHING LANDING PAGE TYPOGRAPHY */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c1122f]">
                Terminal Operations • Manage Attraction Operations (3.0)
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.045em] text-[#1d1d1f] mt-1">
                Operations <span className="text-[#c1122f]">Command Center</span>
              </h1>
              <p className="text-sm text-[#6e6e73] mt-2 max-w-xl">
                Real-time visitor monitoring, ticket verification, and attraction flow management for Monte Maria sanctuary grounds.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStationModalOpen(true)}
                className="rounded-full border border-black/10 bg-white hover:bg-[#f5f5f7] px-5 py-2.5 text-xs font-semibold text-[#1d1d1f] shadow-xs transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <ArrowRightLeft className="h-3.5 w-3.5 text-[#c1122f]" />
                Switch Assigned Station
              </button>
            </div>
          </div>

          {/* DFD SECTION 1: Staff Account Data (D1) + Assigned Attraction Information (3.0) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Staff Account & Session Card (1.0 Manage Accounts & D1) */}
            <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#86868b]">
                    Account Clearance (D1)
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    On-Duty
                  </span>
                </div>

                <div className="flex items-center gap-3.5 mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c1122f] text-white font-bold text-lg shadow-sm">
                    {staffName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-[#1d1d1f] leading-tight">
                      {staffName}
                    </h2>
                    <p className="text-xs text-[#86868b] font-mono mt-0.5">
                      {accountData?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 rounded-2xl bg-[#f5f5f7] p-4 text-xs text-[#424245]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#86868b]">
                      <KeyRound className="h-3.5 w-3.5" />
                      Employee ID:
                    </span>
                    <span className="font-mono font-bold text-[#1d1d1f]">
                      {accountData?.employeeId || "STF-1004"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#86868b]">
                      <Clock className="h-3.5 w-3.5" />
                      Shift:
                    </span>
                    <span className="font-medium text-[#1d1d1f]">
                      {accountData?.shift || "Morning (08:00 AM - 04:00 PM)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#86868b]">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Role:
                    </span>
                    <span className="font-semibold text-[#c1122f]">
                      {role === "Tourism" ? "Tourism Administrator" : "Operations Staff"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-black/[0.05] flex items-center justify-between text-[11px] text-[#86868b]">
                <span>Terminal: {currentAttraction.stationTerminal.split("-")[0]}</span>
                <span className="text-emerald-700 font-semibold">Active Session ✓</span>
              </div>
            </div>

            {/* Assigned Attraction Card (3.0 Manage Attraction Operations -> Staff) */}
            <div className="lg:col-span-2 rounded-[28px] border border-black/[0.08] bg-gradient-to-br from-[#1d1d1f] via-black to-[#2b0811] text-white p-7 md:p-8 shadow-md relative overflow-hidden flex flex-col justify-between">
              {/* Subtle radiant glow */}
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#c1122f]/20 blur-3xl pointer-events-none" />

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/90 border border-white/20">
                      Assigned Attraction (Flow 3.0)
                    </span>
                    <span className="rounded-full bg-[#c1122f]/40 px-3 py-1 text-[10px] font-semibold text-rose-200">
                      {currentAttraction.type} Experience
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      currentAttraction.status === "Full"
                        ? "bg-red-500/30 text-red-200 border border-red-500/40"
                        : currentAttraction.status === "Near Capacity"
                        ? "bg-amber-500/30 text-amber-200 border border-amber-500/40"
                        : "bg-emerald-500/30 text-emerald-200 border border-emerald-500/40"
                    }`}
                  >
                    {currentAttraction.status}
                  </span>
                </div>

                <h2
                  className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white mb-2"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {currentAttraction.name}
                </h2>
                <p className="text-sm text-white/80 flex items-center gap-2 mb-6">
                  <MapPin className="h-4 w-4 text-[#c1122f] shrink-0" />
                  <span>{currentAttraction.location}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/70 font-mono text-xs">{currentAttraction.stationTerminal}</span>
                </p>

                {/* Key Metrics Grid in landing style */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">Current Visitors</span>
                    <span className="text-2xl font-bold text-white mt-0.5 block">
                      {currentAttraction.currentVisitors}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">Capacity Limit</span>
                    <span className="text-2xl font-bold text-white/90 mt-0.5 block">
                      {currentAttraction.capacity} <span className="text-xs font-normal text-white/60">pax</span>
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">Operating Hours</span>
                    <span className="text-xs font-semibold text-white/90 mt-1 block">
                      {currentAttraction.operatingHours}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">Live Occupancy</span>
                    <span className="text-xs font-bold text-amber-300 mt-1 block font-mono">
                      {Math.round(occupancyRatio)}% Capacity
                    </span>
                  </div>
                </div>
              </div>

              {/* Station safety rules */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-white/70 gap-2">
                <span className="flex items-center gap-1.5 text-white/80 text-[11px]">
                  <Info className="h-3.5 w-3.5 text-[#c1122f]" />
                  <strong>Guidelines:</strong> {currentAttraction.rules.join(" • ")}
                </span>
                <span className="text-[11px] text-white/50 font-mono">
                  Telemetry Synced
                </span>
              </div>
            </div>
          </div>

          {/* DFD SECTION 2, 3 & 4:
              - QR Scan & Entry/Exit Information (Staff -> 3.0)
              - Ticket Verification Result (3.0 -> Staff)
              - Visitor Monitoring Information (3.0 -> Staff) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

            {/* LEFT: QR SCANNER & TICKET VERIFICATION RESULT (7 cols) */}
            <div className="lg:col-span-7 space-y-6">

              {/* QR Scanner Module */}
              <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-black/[0.05]">
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f] flex items-center gap-2.5">
                      <QrCode className="h-5 w-5 text-[#c1122f]" />
                      QR Scan &amp; Entry/Exit Information
                    </h2>
                    <p className="text-xs text-[#86868b] mt-0.5">
                      Process visitor passes for {currentAttraction.name}
                    </p>
                  </div>

                  {/* Mode Toggle: Entry vs Exit */}
                  <div className="inline-flex rounded-full border border-black/[0.06] bg-[#f5f5f7] p-1">
                    <button
                      type="button"
                      onClick={() => setScanMode("ENTRY")}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        scanMode === "ENTRY"
                          ? "bg-white text-emerald-700 shadow-xs"
                          : "text-[#6e6e73] hover:text-[#1d1d1f]"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                      Entry Scan (In)
                    </button>
                    <button
                      type="button"
                      onClick={() => setScanMode("EXIT")}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        scanMode === "EXIT"
                          ? "bg-white text-blue-700 shadow-xs"
                          : "text-[#6e6e73] hover:text-[#1d1d1f]"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                      Exit Scan (Out)
                    </button>
                  </div>
                </div>

                {/* Viewfinder box */}
                <div className="relative rounded-[24px] bg-[#1d1d1f] overflow-hidden aspect-video sm:aspect-21/9 flex flex-col items-center justify-center text-white mb-5 border border-black/10 shadow-inner">
                  {/* Framing crosshairs */}
                  <div className="absolute inset-7 border border-white/15 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                    <div className="flex justify-between">
                      <div className="h-5 w-5 border-t-2 border-l-2 border-[#c1122f]" />
                      <div className="h-5 w-5 border-t-2 border-r-2 border-[#c1122f]" />
                    </div>
                    {/* Laser line */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#c1122f] to-transparent animate-pulse shadow-sm shadow-[#c1122f]" />
                    <div className="flex justify-between">
                      <div className="h-5 w-5 border-b-2 border-l-2 border-[#c1122f]" />
                      <div className="h-5 w-5 border-b-2 border-r-2 border-[#c1122f]" />
                    </div>
                  </div>

                  <ScanLine className="h-10 w-10 text-white/50 mb-2 animate-bounce" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/90">
                    {scanMode === "ENTRY" ? "Ready for Entry QR Code" : "Ready for Exit QR Code"}
                  </p>
                  <p className="text-[11px] text-white/50 mt-0.5">
                    Align visitor mobile QR code or printed ticket barcode
                  </p>
                </div>

                {/* Manual Barcode Input Form */}
                <form onSubmit={handleScanSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Scan or enter ticket code (e.g. MM-2026-8812)"
                        className="w-full pl-10 pr-4 py-3 bg-[#f5f5f7] border border-black/[0.08] rounded-full text-xs font-mono text-[#1d1d1f] placeholder:text-gray-400 focus:bg-white focus:border-[#c1122f] focus:ring-2 focus:ring-[#c1122f]/10 outline-none transition"
                      />
                      <QrCode className="h-4 w-4 text-[#86868b] absolute left-4 top-3.5" />
                    </div>
                    <button
                      type="submit"
                      className={`px-6 py-3 rounded-full font-semibold text-xs tracking-wider uppercase text-white transition-all duration-200 shadow-sm cursor-pointer hover:scale-[1.02] flex items-center gap-2 ${
                        scanMode === "ENTRY"
                          ? "bg-[#c1122f] hover:bg-[#a50f28]"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      <ScanLine className="h-4 w-4" />
                      Verify Code
                    </button>
                  </div>
                </form>

                {/* Simulation presets in landing page pill style */}
                <div className="mt-5 pt-4 border-t border-black/[0.05]">
                  <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.14em] mb-2.5">
                    Quick Demonstration Presets:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => verifyAndProcessCode("MM-2026-8812")}
                      className="rounded-full border border-black/[0.06] bg-[#f5f5f7] hover:bg-white px-3 py-1 text-xs font-mono text-[#424245] transition-all hover:border-[#c1122f]/40 cursor-pointer"
                    >
                      ✓ Valid Single Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => verifyAndProcessCode("MM-2026-4431")}
                      className="rounded-full border border-black/[0.06] bg-[#f5f5f7] hover:bg-white px-3 py-1 text-xs font-mono text-[#424245] transition-all hover:border-[#c1122f]/40 cursor-pointer"
                    >
                      ✓ All-Access (4 Pax)
                    </button>
                    <button
                      type="button"
                      onClick={() => verifyAndProcessCode("MM-2026-USED1")}
                      className="rounded-full border border-black/[0.06] bg-[#f5f5f7] hover:bg-white px-3 py-1 text-xs font-mono text-amber-800 transition-all hover:border-amber-400 cursor-pointer"
                    >
                      ⚠ Already Used
                    </button>
                    <button
                      type="button"
                      onClick={() => verifyAndProcessCode("MM-2026-WRONG")}
                      className="rounded-full border border-black/[0.06] bg-[#f5f5f7] hover:bg-white px-3 py-1 text-xs font-mono text-orange-800 transition-all hover:border-orange-400 cursor-pointer"
                    >
                      ⛔ Wrong Station
                    </button>
                    <button
                      type="button"
                      onClick={() => verifyAndProcessCode("INVALID-CODE-999")}
                      className="rounded-full border border-black/[0.06] bg-[#f5f5f7] hover:bg-white px-3 py-1 text-xs font-mono text-red-800 transition-all hover:border-red-400 cursor-pointer"
                    >
                      ✗ Unregistered Code
                    </button>
                  </div>
                </div>
              </div>

              {/* TICKET VERIFICATION RESULT CARD (Flow 3.0 -> Staff) */}
              {lastVerification ? (
                <div
                  className={`rounded-[28px] p-7 border transition-all shadow-sm ${
                    lastVerification.status === "VERIFIED_VALID"
                      ? "bg-white border-emerald-300 ring-4 ring-emerald-500/10"
                      : lastVerification.status === "ALREADY_SCANNED"
                      ? "bg-white border-amber-300 ring-4 ring-amber-500/10"
                      : lastVerification.status === "WRONG_ATTRACTION"
                      ? "bg-white border-orange-300 ring-4 ring-orange-500/10"
                      : "bg-white border-red-300 ring-4 ring-red-500/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      {lastVerification.status === "VERIFIED_VALID" ? (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                      ) : lastVerification.status === "ALREADY_SCANNED" ? (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
                          <AlertTriangle className="h-6 w-6" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#c1122f] text-white shadow-sm">
                          <XCircle className="h-6 w-6" />
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#86868b]">
                          Flow 3.0: Ticket Verification Result
                        </span>
                        <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f] leading-tight">
                          {lastVerification.status === "VERIFIED_VALID"
                            ? lastVerification.scanMode === "ENTRY"
                              ? "Pass Verified • Ready to Admit"
                              : "Pass Verified • Ready for Exit"
                            : lastVerification.status === "ALREADY_SCANNED"
                            ? "Duplicate / Already Scanned Pass"
                            : lastVerification.status === "WRONG_ATTRACTION"
                            ? "Attraction Mismatch"
                            : "Admission Denied"}
                        </h3>
                        <p className="text-xs text-[#424245] mt-0.5">
                          {lastVerification.message}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLastVerification(null)}
                      className="text-[#86868b] hover:text-[#1d1d1f] text-sm font-bold p-1"
                    >
                      ✕
                    </button>
                  </div>

                  {lastVerification.ticket && (
                    <div className="rounded-2xl border border-black/[0.06] bg-[#f5f5f7] p-4 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-[#86868b]">Visitor Name</span>
                        <span className="font-semibold text-[#1d1d1f] text-sm mt-0.5 block">
                          {lastVerification.ticket.visitorName}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-[#86868b]">Ticket Code</span>
                        <span className="font-mono font-bold text-[#1d1d1f] mt-0.5 block">
                          {lastVerification.ticket.ticketId}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-[#86868b]">Party Size</span>
                        <span className="font-bold text-[#c1122f] text-sm mt-0.5 block">
                          {lastVerification.ticket.paxCount} {lastVerification.ticket.paxCount > 1 ? "Guests" : "Guest"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-[#86868b]">Payment</span>
                        <span className="text-emerald-700 font-semibold mt-0.5 block">
                          ✓ Verified Paid
                        </span>
                      </div>
                    </div>
                  )}

                  {lastVerification.status === "VERIFIED_VALID" ? (
                    <button
                      type="button"
                      onClick={() => confirmAdmission(lastVerification)}
                      className={`w-full py-3.5 rounded-full text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 hover:scale-[1.01] shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                        lastVerification.scanMode === "ENTRY"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {lastVerification.scanMode === "ENTRY"
                        ? `Confirm Admission (${lastVerification.ticket?.paxCount || 1} Pax)`
                        : `Confirm Exit (${lastVerification.ticket?.paxCount || 1} Pax)`}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLastVerification(null)}
                      className="w-full py-3 rounded-full border border-black/10 bg-[#f5f5f7] hover:bg-white text-[#1d1d1f] font-semibold text-xs tracking-wider uppercase transition cursor-pointer"
                    >
                      Acknowledge &amp; Dismiss Result
                    </button>
                  )}
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-black/[0.12] bg-white/60 p-8 text-center text-[#86868b]">
                  <FileText className="h-8 w-8 mx-auto mb-2.5 opacity-40 text-[#1d1d1f]" />
                  <h4 className="text-sm font-semibold text-[#1d1d1f]">
                    Ready for Next Ticket Scan
                  </h4>
                  <p className="text-xs text-[#86868b] mt-1 max-w-sm mx-auto">
                    Scan a visitor QR code above to trigger the Ticket Verification Result and passenger details.
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT: VISITOR MONITORING INFORMATION & CAPACITY (5 cols) */}
            <div className="lg:col-span-5 space-y-6">

              {/* Real-time Visitor Monitoring Information (Flow 3.0 -> Staff) */}
              <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                      Visitor Monitoring
                    </h2>
                    <p className="text-xs text-[#86868b] mt-0.5">
                      Attraction capacity and flow telemetry (Flow 3.0)
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
                    Flow 3.0
                  </span>
                </div>

                {/* Capacity Gauge */}
                <div className={`p-5 rounded-2xl border mb-5 ${getCapacityColor(occupancyRatio)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Current Occupancy
                    </span>
                    <span className="text-xs font-mono font-bold">
                      {Math.round(occupancyRatio)}% Full
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-bold font-serif text-[#1d1d1f]">
                      {currentAttraction.currentVisitors}
                    </span>
                    <span className="text-xs text-[#6e6e73]">
                      / {currentAttraction.capacity} Safe Limit
                    </span>
                  </div>

                  <div className="w-full bg-black/10 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getProgressBarColor(occupancyRatio)}`}
                      style={{ width: `${Math.min(100, occupancyRatio)}%` }}
                    />
                  </div>
                </div>

                {/* Entry vs Exit Flow Counters */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-4 rounded-2xl border border-black/[0.06] bg-[#f5f5f7]">
                    <span className="text-[10px] font-bold text-[#86868b] uppercase block">
                      Today&apos;s Entries
                    </span>
                    <span className="text-2xl font-bold text-emerald-800 mt-1 block">
                      +{totalEntriesToday}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl border border-black/[0.06] bg-[#f5f5f7]">
                    <span className="text-[10px] font-bold text-[#86868b] uppercase block">
                      Today&apos;s Exits
                    </span>
                    <span className="text-2xl font-bold text-blue-800 mt-1 block">
                      -{totalExitsToday}
                    </span>
                  </div>
                </div>

                {/* Controls: Pause Queue & Headcount */}
                <div className="space-y-3 pt-3 border-t border-black/[0.05]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#1d1d1f] block">Admissions Gate</span>
                      <span className="text-[11px] text-[#86868b]">Hold queue when full</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsQueuePaused(!isQueuePaused)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        isQueuePaused
                          ? "bg-[#c1122f] text-white shadow-xs"
                          : "border border-black/10 bg-[#f5f5f7] text-[#424245] hover:bg-white"
                      }`}
                    >
                      {isQueuePaused ? (
                        <>
                          <PlayCircle className="h-3.5 w-3.5" />
                          Resume
                        </>
                      ) : (
                        <>
                          <PauseCircle className="h-3.5 w-3.5" />
                          Pause Queue
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-xs font-semibold text-[#1d1d1f] block">Manual Headcount</span>
                      <span className="text-[11px] text-[#86868b]">Unticketed infants / staff escorts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => manualAdjustCount(-1)}
                        disabled={currentAttraction.currentVisitors <= 0}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-[#f5f5f7] hover:bg-white text-[#1d1d1f] font-bold disabled:opacity-40 transition cursor-pointer"
                        title="Subtract 1"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => manualAdjustCount(1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-[#f5f5f7] hover:bg-white text-[#1d1d1f] font-bold transition cursor-pointer"
                        title="Add 1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Entry/Exit Activity Stream */}
              <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-[#1d1d1f]">
                    Live Visitor Stream
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Live Activity
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {logs.slice(0, 6).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl border border-black/[0.05] bg-[#f5f5f7] hover:bg-white transition flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            log.eventType === "ENTRY"
                              ? "bg-emerald-100 text-emerald-800"
                              : log.eventType === "EXIT"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {log.eventType === "ENTRY" ? "IN" : log.eventType === "EXIT" ? "OUT" : "DEN"}
                        </span>
                        <div>
                          <p className="font-semibold text-[#1d1d1f] leading-tight">
                            {log.visitorName}
                          </p>
                          <p className="text-[10px] text-[#86868b] font-mono mt-0.5">
                            {log.ticketId} • {log.statusText}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#86868b] font-mono shrink-0">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* OPERATIONAL SUB-MODULES GRID */}
          <div className="pt-6">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c1122f]">
                Terminal Stations
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.035em] text-[#1d1d1f] mt-1">
                Sub-Operational Tools
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Link href="/staffdashboard/qrcode" className="group block">
                <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-black/15 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c1122f]/10 text-[#c1122f] mb-5 group-hover:bg-[#c1122f] group-hover:text-white transition-colors">
                      <QrCode className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] mb-1.5">
                      QR Scanner Terminal
                    </h3>
                    <p className="text-xs text-[#6e6e73] leading-relaxed">
                      Dedicated full-screen camera scanning station, barcode decoding, and audio chime feedback.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-black/[0.05] flex justify-end">
                    <span className="text-xs font-semibold text-[#86868b] group-hover:text-[#c1122f] transition-colors">
                      Open Scanner →
                    </span>
                  </div>
                </div>
              </Link>

              <Link href="/staffdashboard/entry-validation" className="group block">
                <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-black/15 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c1122f]/10 text-[#c1122f] mb-5 group-hover:bg-[#c1122f] group-hover:text-white transition-colors">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] mb-1.5">
                      Entry Validation Desk
                    </h3>
                    <p className="text-xs text-[#6e6e73] leading-relaxed">
                      Manual approval/denial queue, visitor credential inspection, and reason tracking.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-black/[0.05] flex justify-end">
                    <span className="text-xs font-semibold text-[#86868b] group-hover:text-[#c1122f] transition-colors">
                      Review Requests →
                    </span>
                  </div>
                </div>
              </Link>

              <Link href="/staffdashboard/capacity-monitoring" className="group block">
                <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-black/15 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c1122f]/10 text-[#c1122f] mb-5 group-hover:bg-[#c1122f] group-hover:text-white transition-colors">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] mb-1.5">
                      Capacity &amp; Crowd Control
                    </h3>
                    <p className="text-xs text-[#6e6e73] leading-relaxed">
                      Sanctuary-wide multi-zone headcounts, occupancy safety gauges, and operating mode switches.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-black/[0.05] flex justify-end">
                    <span className="text-xs font-semibold text-[#86868b] group-hover:text-[#c1122f] transition-colors">
                      Monitor Capacity →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* MODAL: Switch Station / Assigned Attraction */}
      {stationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-8 shadow-[0_4px_30px_rgba(0,0,0,0.08)] border border-black/[0.06]">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.05] mb-5">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                  Select Assigned Station
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Change active terminal to manage another attraction
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStationModalOpen(false)}
                className="text-[#86868b] hover:text-[#1d1d1f] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {attractions.map((attraction) => (
                <div
                  key={attraction.id}
                  onClick={() => {
                    setActiveAttractionName(attraction.name);
                    setAssignedAttraction(attraction.name);
                    setStationModalOpen(false);
                  }}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    attraction.name === currentAttraction.name
                      ? "bg-[#c1122f]/10 border-[#c1122f] text-[#1d1d1f] shadow-xs"
                      : "bg-[#f5f5f7] border-black/[0.06] hover:bg-white text-[#424245]"
                  }`}
                >
                  <div>
                    <span className="font-semibold block text-sm text-[#1d1d1f]">{attraction.name}</span>
                    <span className="text-[11px] text-[#86868b]">{attraction.location}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold block text-xs text-[#1d1d1f]">
                      {attraction.currentVisitors}/{attraction.capacity}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        attraction.status === "Full"
                          ? "text-red-700"
                          : attraction.status === "Near Capacity"
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {attraction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.05] flex justify-end">
              <button
                type="button"
                onClick={() => setStationModalOpen(false)}
                className="rounded-full border border-black/10 bg-[#f5f5f7] hover:bg-white px-5 py-2.5 text-xs font-semibold text-[#1d1d1f] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function StaffDashboardPage() {
  return (
    <StaffAuthGuard>
      <StaffDashboardContent />
    </StaffAuthGuard>
  );
}
