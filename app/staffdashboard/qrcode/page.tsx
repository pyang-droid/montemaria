"use client";

import { useState } from "react";
import StaffAuthGuard, { useStaffAuth } from "../StaffAuthGuard";
import StaffNav from "../StaffNav";
import {
  useStaffOperations,
} from "../useStaffOperations";
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  Check,
  Search,
} from "lucide-react";

function QRCodeContent() {
  const { accountData, assignedAttraction } = useStaffAuth();
  const staffName = accountData?.fullName || "Staff Officer";

  const {
    currentAttraction,
    scanMode,
    setScanMode,
    logs,
    lastVerification,
    setLastVerification,
    verifyAndProcessCode,
    confirmAdmission,
  } = useStaffOperations(assignedAttraction, staffName);

  const [inputCode, setInputCode] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "ENTRY" | "EXIT" | "DENIED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const handleScanSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCode.trim()) return;
    verifyAndProcessCode(inputCode);
    setInputCode("");
  };

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filterType === "ALL" || log.eventType === filterType;
    const matchesSearch =
      log.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const successfulScans = logs.filter((l) => l.eventType === "ENTRY" || l.eventType === "EXIT").length;
  const failedScans = logs.filter((l) => l.eventType === "DENIED").length;

  return (
    <>
      <StaffNav />
      <div className="min-h-screen bg-[#f5f5f7] pt-26 pb-20 px-5 md:px-8">
        <div className="max-w-[1280px] mx-auto space-y-7">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c1122f]">
                Optical Station • QR Scan &amp; Entry/Exit Information
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.045em] text-[#1d1d1f] mt-1">
                QR Scanner <span className="text-[#c1122f]">Station</span>
              </h1>
              <p className="text-sm text-[#6e6e73] mt-2 max-w-xl">
                Scan visitor passes, verify booking legitimacy against D1 records, and record entry/exit events.
              </p>
            </div>

            {/* Scan Mode Toggle in Landing Page Pill Style */}
            <div className="inline-flex rounded-full border border-black/[0.06] bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setScanMode("ENTRY")}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  scanMode === "ENTRY"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-[#6e6e73] hover:text-[#1d1d1f]"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Entry Scan (In)
              </button>
              <button
                type="button"
                onClick={() => setScanMode("EXIT")}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  scanMode === "EXIT"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-[#6e6e73] hover:text-[#1d1d1f]"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-white" />
                Exit Scan (Out)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

            {/* SCANNER INPUT & OPTICAL FEED (7 cols) */}
            <div className="lg:col-span-7 space-y-6">

              <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 md:p-8 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f] flex items-center gap-2">
                    <Camera className="h-5 w-5 text-[#c1122f]" />
                    Optical Scanner Feed
                  </h2>
                  <span className="rounded-full bg-[#f5f5f7] border border-black/[0.06] px-3.5 py-1 text-[11px] font-semibold text-[#424245]">
                    Station: {currentAttraction.name}
                  </span>
                </div>

                {/* Viewfinder display */}
                <div className="relative rounded-[24px] bg-[#1d1d1f] overflow-hidden aspect-video flex flex-col items-center justify-center text-white mb-6 border border-black/10 shadow-inner">
                  {/* Framing corners */}
                  <div className="absolute inset-8 border border-white/15 rounded-2xl pointer-events-none flex flex-col justify-between p-4">
                    <div className="flex justify-between">
                      <div className="h-6 w-6 border-t-2 border-l-2 border-[#c1122f]" />
                      <div className="h-6 w-6 border-t-2 border-r-2 border-[#c1122f]" />
                    </div>
                    {/* Laser line */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#c1122f] to-transparent animate-pulse shadow-sm shadow-[#c1122f]" />
                    <div className="flex justify-between">
                      <div className="h-6 w-6 border-b-2 border-l-2 border-[#c1122f]" />
                      <div className="h-6 w-6 border-b-2 border-r-2 border-[#c1122f]" />
                    </div>
                  </div>

                  <ScanLine className="h-12 w-12 text-white/50 mb-3 animate-bounce" />
                  <p className="text-sm font-semibold tracking-wider uppercase text-white/90">
                    {scanMode === "ENTRY" ? "ENTRY SCAN ACTIVE" : "EXIT SCAN ACTIVE"}
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    Align QR code in center of viewfinder
                  </p>
                </div>

                {/* Manual Code Input Bar */}
                <form onSubmit={handleScanSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Scan or type QR code (e.g. MM-2026-8812)"
                        className="w-full pl-11 pr-4 py-3 bg-[#f5f5f7] border border-black/[0.08] rounded-full text-xs font-mono text-[#1d1d1f] placeholder:text-gray-400 focus:bg-white focus:border-[#c1122f] focus:ring-2 focus:ring-[#c1122f]/10 outline-none transition"
                        autoFocus
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
                      Process Scan
                    </button>
                  </div>
                </form>

                {/* Preset Scan Helpers in Landing Page Pill Style */}
                <div className="mt-5 pt-4 border-t border-black/[0.05]">
                  <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.14em] mb-2.5">
                    Simulation Presets:
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
                      ✓ All-Access 4 Pax
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
                      onClick={() => verifyAndProcessCode("MM-2026-EXPD9")}
                      className="rounded-full border border-black/[0.06] bg-[#f5f5f7] hover:bg-white px-3 py-1 text-xs font-mono text-red-800 transition-all hover:border-red-400 cursor-pointer"
                    >
                      ✗ Expired Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => verifyAndProcessCode("MM-2026-WRONG")}
                      className="rounded-full border border-black/[0.06] bg-[#f5f5f7] hover:bg-white px-3 py-1 text-xs font-mono text-orange-800 transition-all hover:border-orange-400 cursor-pointer"
                    >
                      ⛔ Wrong Zone
                    </button>
                  </div>
                </div>

                {/* Scans Statistics Box in Landing Page Style */}
                <div className="mt-6 pt-5 border-t border-black/[0.05] grid grid-cols-2 gap-3.5">
                  <div className="rounded-2xl border border-black/[0.06] bg-[#f5f5f7] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
                      Successful Scans Today
                    </p>
                    <p className="text-2xl font-bold text-emerald-800 mt-0.5">
                      {successfulScans}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/[0.06] bg-[#f5f5f7] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
                      Failed / Denied Scans
                    </p>
                    <p className="text-2xl font-bold text-red-800 mt-0.5">
                      {failedScans}
                    </p>
                  </div>
                </div>
              </div>

              {/* TICKET VERIFICATION RESULT CARD (Flow 3.0 -> Staff) */}
              {lastVerification && (
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
                  <div className="flex items-start justify-between gap-3 mb-4">
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
                              ? "Pass Verified • Ready for Admission"
                              : "Pass Verified • Ready for Exit"
                            : lastVerification.status === "ALREADY_SCANNED"
                            ? "Already Used Pass"
                            : lastVerification.status === "WRONG_ATTRACTION"
                            ? "Wrong Attraction Pass"
                            : "Access Denied"}
                        </h3>
                        <p className="text-xs text-[#424245] mt-0.5">
                          {lastVerification.message}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLastVerification(null)}
                      className="text-[#86868b] hover:text-[#1d1d1f] text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {lastVerification.ticket && (
                    <div className="rounded-2xl border border-black/[0.06] bg-[#f5f5f7] p-4 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-[#86868b]">Visitor</span>
                        <span className="font-semibold text-[#1d1d1f] block mt-0.5">{lastVerification.ticket.visitorName}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-[#86868b]">Ticket Ref</span>
                        <span className="font-mono font-bold text-[#1d1d1f] block mt-0.5">{lastVerification.ticket.ticketId}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-[#86868b]">Party Size</span>
                        <span className="font-bold text-[#c1122f] block mt-0.5">{lastVerification.ticket.paxCount} Pax</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-[#86868b]">Payment</span>
                        <span className="text-emerald-700 font-semibold block mt-0.5">✓ Verified Paid</span>
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
                      <Check className="h-4 w-4" />
                      {lastVerification.scanMode === "ENTRY"
                        ? `Admit Visitor(s) [${lastVerification.ticket?.paxCount || 1} Pax]`
                        : `Process Exit [${lastVerification.ticket?.paxCount || 1} Pax]`}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLastVerification(null)}
                      className="w-full py-3 rounded-full border border-black/10 bg-[#f5f5f7] hover:bg-white text-[#1d1d1f] font-semibold text-xs tracking-wider uppercase transition cursor-pointer"
                    >
                      Dismiss Result
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* SCAN HISTORY & LOGS (5 cols) */}
            <div className="lg:col-span-5 space-y-6">

              <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 md:p-8 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                      Scan History
                    </h2>
                    <p className="text-xs text-[#86868b] mt-0.5">
                      Real-time verification log records (Flow 3.0)
                    </p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#86868b]">
                    {filteredLogs.length} events
                  </span>
                </div>

                {/* Filter and Search Bar */}
                <div className="space-y-2 mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search visitor name or ticket code..."
                      className="w-full pl-10 pr-3 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-full text-xs text-[#1d1d1f] outline-none focus:bg-white focus:border-[#c1122f]"
                    />
                    <Search className="h-3.5 w-3.5 text-[#86868b] absolute left-3.5 top-3" />
                  </div>

                  <div className="flex gap-1.5 p-1 rounded-full bg-[#f5f5f7] border border-black/[0.05] text-[11px]">
                    {(["ALL", "ENTRY", "EXIT", "DENIED"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setFilterType(mode)}
                        className={`flex-1 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                          filterType === mode
                            ? "bg-white text-[#1d1d1f] shadow-xs"
                            : "text-[#6e6e73] hover:text-[#1d1d1f]"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Log stream list */}
                <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                  {filteredLogs.length === 0 ? (
                    <div className="py-14 text-center text-[#86868b] text-xs">
                      No scan events found matching criteria
                    </div>
                  ) : (
                    filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-2xl border border-black/[0.05] bg-[#f5f5f7] hover:bg-white transition flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              log.eventType === "ENTRY"
                                ? "bg-emerald-100 text-emerald-800"
                                : log.eventType === "EXIT"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {log.eventType === "ENTRY" ? "✓" : log.eventType === "EXIT" ? "→" : "✕"}
                          </span>
                          <div>
                            <p className="font-semibold text-[#1d1d1f] leading-tight">
                              {log.visitorName}
                            </p>
                            <p className="text-[10px] text-[#86868b] font-mono mt-0.5">
                              {log.ticketId} • {log.statusText}
                            </p>
                            {log.reason && (
                              <p className="text-[10px] text-red-700 font-medium mt-0.5">
                                Reason: {log.reason}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-[#86868b] font-mono block">
                            {log.timestamp}
                          </span>
                          <span className="text-[10px] text-[#424245] font-semibold">
                            {log.pax} pax
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default function QRCodePage() {
  return (
    <StaffAuthGuard>
      <QRCodeContent />
    </StaffAuthGuard>
  );
}
