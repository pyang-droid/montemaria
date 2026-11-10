"use client";

import { useState } from "react";
import StaffAuthGuard, { useStaffAuth } from "../StaffAuthGuard";
import StaffNav from "../StaffNav";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  UserCheck,
  MapPin,
  AlertCircle,
  Check,
  X,
} from "lucide-react";

interface VisitorValidationRequest {
  id: string;
  name: string;
  qrCode: string;
  bookingRef: string;
  attraction: string;
  pax: number;
  time: string;
  passType: string;
  status: "pending" | "approved" | "denied";
  denyReason?: string;
}

const INITIAL_REQUESTS: VisitorValidationRequest[] = [
  {
    id: "VAL-101",
    name: "John Patrick Doe",
    qrCode: "MM-2026-8812",
    bookingRef: "BK-90214",
    attraction: "Mirage Walk",
    pax: 2,
    time: "02:30 PM",
    passType: "Single Attraction",
    status: "pending",
  },
  {
    id: "VAL-102",
    name: "Maria Santos-Guanzon",
    qrCode: "MM-2026-4431",
    bookingRef: "BK-88412",
    attraction: "All Attractions (All-Access)",
    pax: 4,
    time: "02:35 PM",
    passType: "All-Access Pass",
    status: "pending",
  },
  {
    id: "VAL-103",
    name: "Carlos Rodriguez",
    qrCode: "MM-2026-1190",
    bookingRef: "BK-76129",
    attraction: "View Deck",
    pax: 1,
    time: "02:25 PM",
    passType: "Single Attraction",
    status: "approved",
  },
  {
    id: "VAL-104",
    name: "Beatrice Alcantara",
    qrCode: "MM-2026-9921",
    bookingRef: "BK-65120",
    attraction: "Glass Walk",
    pax: 3,
    time: "02:15 PM",
    passType: "Single Attraction",
    status: "approved",
  },
  {
    id: "VAL-105",
    name: "Rafael Mercado",
    qrCode: "MM-2026-EXPD9",
    bookingRef: "BK-44102",
    attraction: "Mirage Walk",
    pax: 1,
    time: "02:00 PM",
    passType: "Single Attraction",
    status: "denied",
    denyReason: "Pass expired on Nov 01, 2026",
  },
];

function EntryValidationContent() {
  const { accountData, assignedAttraction } = useStaffAuth();
  const [requests, setRequests] = useState<VisitorValidationRequest[]>(INITIAL_REQUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "denied">("all");
  const [denyModalOpen, setDenyModalOpen] = useState(false);
  const [denyTarget, setDenyTarget] = useState<VisitorValidationRequest | null>(null);
  const [denyReasonInput, setDenyReasonInput] = useState("Capacity limit exceeded or invalid credential");

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
  };

  const openDenyModal = (req: VisitorValidationRequest) => {
    setDenyTarget(req);
    setDenyModalOpen(true);
  };

  const confirmDenial = () => {
    if (!denyTarget) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === denyTarget.id
          ? { ...r, status: "denied", denyReason: denyReasonInput }
          : r
      )
    );
    setDenyModalOpen(false);
    setDenyTarget(null);
  };

  const filteredRequests = requests.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.qrCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.attraction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const deniedCount = requests.filter((r) => r.status === "denied").length;

  return (
    <>
      <StaffNav />
      <div className="min-h-screen bg-[#f5f5f7] pt-26 pb-20 px-5 md:px-8">
        <div className="max-w-[1280px] mx-auto space-y-7">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c1122f]">
                Credential Review • Manage Accounts &amp; Operations
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.045em] text-[#1d1d1f] mt-1">
                Entry <span className="text-[#c1122f]">Validation Desk</span>
              </h1>
              <p className="text-sm text-[#6e6e73] mt-2 max-w-xl">
                Review, verify, and approve incoming visitor entry requests and multi-guest party passes.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-2 text-xs text-[#424245] shadow-xs">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span>Officer on Duty: <strong className="text-[#1d1d1f]">{accountData?.fullName}</strong></span>
            </div>
          </div>

          {/* METRICS SUMMARY IN LANDING PAGE CARD STYLE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#86868b]">
                  Pending Requests
                </p>
                <p className="text-3xl font-bold text-amber-700 mt-1 font-serif">
                  {pendingCount}
                </p>
                <p className="text-xs text-[#86868b] mt-0.5">Awaiting staff confirmation</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#86868b]">
                  Approved Today
                </p>
                <p className="text-3xl font-bold text-emerald-800 mt-1 font-serif">
                  {approvedCount}
                </p>
                <p className="text-xs text-[#86868b] mt-0.5">Admissions verified and logged</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#86868b]">
                  Denied / Rejected
                </p>
                <p className="text-3xl font-bold text-[#c1122f] mt-1 font-serif">
                  {deniedCount}
                </p>
                <p className="text-xs text-[#86868b] mt-0.5">Disallowed passes or limits</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#c1122f]">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="rounded-[28px] md:rounded-[32px] border border-black/[0.06] bg-white shadow-[0_1px_12px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-5 sm:p-7 border-b border-black/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search visitor name or ticket code..."
                  className="w-full pl-11 pr-4 py-2.5 bg-[#f5f5f7] border border-black/[0.08] rounded-full text-xs text-[#1d1d1f] placeholder:text-gray-400 focus:bg-white focus:border-[#c1122f] outline-none transition"
                />
                <Search className="h-4 w-4 text-[#86868b] absolute left-4 top-3" />
              </div>

              {/* Status Filter Tabs in landing pill style */}
              <div className="inline-flex rounded-full border border-black/[0.06] bg-[#f5f5f7] p-1 text-xs">
                {(["all", "pending", "approved", "denied"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`rounded-full px-4 py-1.5 font-semibold capitalize transition-all cursor-pointer ${
                      statusFilter === tab
                        ? "bg-white text-[#1d1d1f] shadow-xs"
                        : "text-[#6e6e73] hover:text-[#1d1d1f]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f5f5f7]/70 border-b border-black/[0.05] text-[#86868b] font-bold uppercase tracking-[0.12em] text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Visitor &amp; Ref</th>
                    <th className="px-6 py-4">Ticket Code</th>
                    <th className="px-6 py-4">Station Target</th>
                    <th className="px-6 py-4">Party Size</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-[#424245]">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-14 text-center text-[#86868b]">
                        No validation requests match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-[#f5f5f7]/60 transition">
                        <td className="px-6 py-4.5">
                          <span className="font-semibold text-[#1d1d1f] text-sm block">
                            {req.name}
                          </span>
                          <span className="text-[10px] text-[#86868b] font-mono mt-0.5 block">
                            {req.bookingRef} • {req.passType}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 font-mono font-bold text-[#1d1d1f]">
                          {req.qrCode}
                        </td>
                        <td className="px-6 py-4.5">
                          <span className="inline-flex items-center gap-1.5 text-[#1d1d1f] font-medium">
                            <MapPin className="h-3.5 w-3.5 text-[#c1122f]" />
                            {req.attraction}
                          </span>
                        </td>
                        <td className="px-6 py-4.5">
                          <span className="rounded-full bg-[#f5f5f7] border border-black/[0.06] px-3 py-1 font-bold text-[#1d1d1f]">
                            {req.pax} {req.pax > 1 ? "Guests" : "Guest"}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-[#86868b] font-mono">
                          {req.time}
                        </td>
                        <td className="px-6 py-4.5">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              req.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : req.status === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {req.status}
                          </span>
                          {req.denyReason && (
                            <span className="block text-[10px] text-[#c1122f] mt-1 font-medium max-w-[160px] truncate">
                              {req.denyReason}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          {req.status === "pending" ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleApprove(req.id)}
                                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-1.5 shadow-xs transition hover:scale-[1.02] flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5" />
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => openDenyModal(req)}
                                className="rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-[#c1122f] font-semibold text-xs px-4 py-1.5 transition flex items-center gap-1 cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" />
                                Deny
                              </button>
                            </div>
                          ) : (
                            <span className="text-[#86868b] text-xs italic font-medium">
                              Logged &amp; Processed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL: Deny Reason */}
      {denyModalOpen && denyTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-8 shadow-[0_4px_30px_rgba(0,0,0,0.08)] border border-black/[0.06]">
            <div className="flex items-center gap-3 mb-3 text-[#c1122f]">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                Deny Admission Request
              </h3>
            </div>
            <p className="text-xs text-[#6e6e73] mb-5 leading-relaxed">
              Select the operational reason for rejecting pass <strong>{denyTarget.qrCode}</strong> ({denyTarget.name}).
            </p>

            <div className="space-y-3 mb-6">
              <label className="block text-[11px] font-bold text-[#424245] uppercase tracking-wider">
                Reason for Denial
              </label>
              <select
                value={denyReasonInput}
                onChange={(e) => setDenyReasonInput(e.target.value)}
                className="w-full px-4 py-3 bg-[#f5f5f7] border border-black/[0.08] rounded-2xl text-xs text-[#1d1d1f] outline-none focus:bg-white focus:border-[#c1122f]"
              >
                <option value="Attraction at maximum capacity limit">Attraction at maximum capacity limit</option>
                <option value="Invalid QR Code / Ticket not found">Invalid QR Code / Ticket not found</option>
                <option value="Ticket pass has already been used">Ticket pass has already been used</option>
                <option value="Ticket expired or invalid date">Ticket expired or invalid date</option>
                <option value="Wrong attraction zone / Incompatible pass">Wrong attraction zone / Incompatible pass</option>
                <option value="Safety violation / Attire non-compliance">Safety violation / Attire non-compliance</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDenyModalOpen(false)}
                className="flex-1 py-3 rounded-full border border-black/10 bg-[#f5f5f7] hover:bg-white text-[#1d1d1f] font-semibold text-xs tracking-wider uppercase transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDenial}
                className="flex-1 py-3 rounded-full bg-[#c1122f] hover:bg-[#a50f28] text-white font-semibold text-xs tracking-wider uppercase shadow-xs transition"
              >
                Confirm Denial
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function EntryValidationPage() {
  return (
    <StaffAuthGuard>
      <EntryValidationContent />
    </StaffAuthGuard>
  );
}
