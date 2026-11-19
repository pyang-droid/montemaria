"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  UserCheck,
  XCircle,
} from "lucide-react";
import StaffAuthGuard, { useStaffAuth } from "../StaffAuthGuard";
import StaffNav from "../StaffNav";
import { db } from "../../lib/firebase";
import { useStaffOperations } from "../useStaffOperations";
import type { BookingRecord } from "../../lib/models";

interface AdmissionRecord {
  id: string;
  attractionId: string;
  visitor: string;
  ticketCode: string;
  bookingDate: string;
  bookingTime: string;
  attractionName: string;
  partySize: number;
  status: "pending" | "approved";
}

function currentDateKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function EntryValidationContent() {
  const { accountData, assignedAttraction, isAdmin } = useStaffAuth();
  const operations = useStaffOperations(
    assignedAttraction ?? "",
    accountData?.fullName ?? ""
  );
  const [bookingState, setBookingState] = useState<{
    attractionId: string;
    records: AdmissionRecord[];
    loading: boolean;
    error: string;
  }>({ attractionId: "", records: [], loading: true, error: "" });
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved">("all");

  const currentAttraction = operations.currentAttraction;
  const currentAttractionId = currentAttraction?.id;

  useEffect(() => {
    if (!currentAttractionId) return;
    const bookingsRef = collection(db, "bookings");
    const activeBookingsQuery = isAdmin
      ? query(
          bookingsRef,
          where("status", "==", "confirmed"),
          where("paymentStatus", "==", "paid"),
          where("ticketStatus", "==", "active")
        )
      : query(
          bookingsRef,
          where("attractionId", "==", currentAttractionId),
          where("status", "==", "confirmed"),
          where("paymentStatus", "==", "paid"),
          where("ticketStatus", "==", "active")
        );

    return onSnapshot(
      activeBookingsQuery,
      (snapshot) => {
        const records = snapshot.docs
          .map((item) => {
            const booking = item.data() as BookingRecord;
            return {
              id: item.id,
              attractionId: booking.attractionId,
              visitor: booking.visitor || booking.email || "—",
              ticketCode: booking.ticketCode ?? "",
              bookingDate: booking.bookingDate ?? "",
              bookingTime: booking.bookingTime ?? "",
              attractionName: booking.attractionName ?? "—",
              partySize: booking.numberOfVisitors,
              status:
                booking.visitStatus === "inside" || booking.visitStatus === "exited"
                  ? "approved" as const
                  : "pending" as const,
            };
          })
          .filter((record) => record.attractionId === currentAttractionId);
        setBookingState({
          attractionId: currentAttractionId,
          records,
          loading: false,
          error: "",
        });
      },
      (error) => {
        console.error("Unable to load active admission bookings:", error);
        setBookingState({
          attractionId: currentAttractionId,
          records: [],
          loading: false,
          error: "Unable to load admission records. Check your access and try again.",
        });
      }
    );
  }, [
    currentAttractionId,
    isAdmin,
  ]);

  const loading = currentAttractionId
    ? bookingState.attractionId !== currentAttractionId || bookingState.loading
    : operations.attractionsLoading;
  const bookings =
    currentAttractionId && bookingState.attractionId === currentAttractionId
      ? bookingState.records
      : [];
  const loadError = currentAttractionId
    ? bookingState.attractionId === currentAttractionId
      ? bookingState.error
      : ""
    : operations.attractionsLoading
      ? ""
      : operations.attractionsError ??
        "No attraction is available for this staff assignment.";
  const search = searchQuery.toLowerCase();
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch =
      booking.visitor.toLowerCase().includes(search) ||
      booking.ticketCode.toLowerCase().includes(search) ||
      booking.attractionName.toLowerCase().includes(search);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  const deniedTodayCount = operations.logs.filter(
    (log) => log.eventType === "DENIED" && log.dateKey === currentDateKey()
  ).length;

  const handleAdmit = async (booking: AdmissionRecord) => {
    if (!booking.ticketCode) {
      setActionError("This booking has no issued ticket code and cannot be admitted.");
      return;
    }

    setSavingId(booking.id);
    setActionError("");
    setSuccessMessage("");
    try {
      const verification = await operations.verifyAndProcessCode(
        booking.ticketCode,
        "ENTRY"
      );
      if (verification.status !== "VERIFIED_VALID") {
        setActionError(verification.message);
        return;
      }
      if (!(await operations.confirmAdmission(verification))) {
        setActionError("Unable to record admission. Check the latest ticket and capacity.");
        return;
      }
      setSuccessMessage(`Admission recorded for ${booking.visitor}.`);
    } finally {
      setSavingId(null);
    }
  };

  const handleAttractionChange = (attractionId: string) => {
    const attraction = operations.attractions.find((item) => item.id === attractionId);
    if (attraction) operations.setActiveAttractionName(attraction.name);
  };

  return (
    <>
      <StaffNav />
      <div className="min-h-screen bg-[#f5f5f7] pt-26 pb-20 px-5 md:px-8">
        <div className="max-w-[1280px] mx-auto space-y-7">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c1122f]">
                Admission Operations
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.045em] text-[#1d1d1f] mt-1">
                Entry <span className="text-[#c1122f]">Validation Desk</span>
              </h1>
              <p className="text-sm text-[#6e6e73] mt-2 max-w-xl">
                Validate paid, active bookings and record visitor admission against live capacity.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-2 text-xs text-[#424245] shadow-xs">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span>
                Officer on Duty: <strong className="text-[#1d1d1f]">{accountData?.fullName ?? "—"}</strong>
              </span>
            </div>
          </div>

          {isAdmin && operations.attractions.length > 0 && (
            <label className="block max-w-sm text-xs font-semibold text-[#6e6e73]">
              Attraction
              <select
                value={currentAttraction?.id ?? ""}
                onChange={(event) => handleAttractionChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#1d1d1f]"
              >
                {operations.attractions.map((attraction) => (
                  <option key={attraction.id} value={attraction.id}>
                    {attraction.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          {(loadError || actionError || successMessage || operations.logsError) && (
            <p
              role={loadError || actionError || operations.logsError ? "alert" : "status"}
              className={`rounded-2xl border p-4 text-sm ${
                loadError || actionError || operations.logsError
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {loadError || actionError || operations.logsError || successMessage}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#86868b]">Pending Admissions</p>
                <p className="text-3xl font-bold text-amber-700 mt-1 font-serif">{loading ? "—" : pendingCount}</p>
                <p className="text-xs text-[#86868b] mt-0.5">Active tickets awaiting entry</p>
              </div>
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#86868b]">Visitors Admitted Today</p>
                <p className="text-3xl font-bold text-emerald-800 mt-1 font-serif">{operations.logsLoading ? "—" : operations.totalEntriesToday}</p>
                <p className="text-xs text-[#86868b] mt-0.5">From recorded entry events</p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#86868b]">Denied Attempts Today</p>
                <p className="text-3xl font-bold text-[#c1122f] mt-1 font-serif">{operations.logsLoading ? "—" : deniedTodayCount}</p>
                <p className="text-xs text-[#86868b] mt-0.5">Recorded unsuccessful scans</p>
              </div>
              <XCircle className="h-6 w-6 text-[#c1122f]" />
            </div>
          </div>

          <div className="rounded-[28px] md:rounded-[32px] border border-black/[0.06] bg-white shadow-[0_1px_12px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="p-5 sm:p-7 border-b border-black/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search visitor or ticket code..."
                  className="w-full pl-11 pr-4 py-2.5 bg-[#f5f5f7] border border-black/[0.08] rounded-full text-xs text-[#1d1d1f] placeholder:text-gray-400 focus:bg-white focus:border-[#c1122f] outline-none transition"
                />
                <Search className="h-4 w-4 text-[#86868b] absolute left-4 top-3" />
              </div>
              <div className="inline-flex rounded-full border border-black/[0.06] bg-[#f5f5f7] p-1 text-xs">
                {(["all", "pending", "approved"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`rounded-full px-4 py-1.5 font-semibold capitalize transition-all ${
                      statusFilter === filter
                        ? "bg-white text-[#1d1d1f] shadow-xs"
                        : "text-[#6e6e73] hover:text-[#1d1d1f]"
                    }`}
                  >
                    {filter === "approved" ? "admitted" : filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f5f5f7]/70 border-b border-black/[0.05] text-[#86868b] font-bold uppercase tracking-[0.12em] text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Visitor &amp; Ref</th>
                    <th className="px-6 py-4">Ticket Code</th>
                    <th className="px-6 py-4">Attraction</th>
                    <th className="px-6 py-4">Party Size</th>
                    <th className="px-6 py-4">Booking Time</th>
                    <th className="px-6 py-4">Admission Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-[#424245]">
                  {loading ? (
                    <tr><td colSpan={7} className="px-6 py-14 text-center text-[#86868b]">Loading admission records…</td></tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-14 text-center text-[#86868b]">No active bookings match the selected criteria.</td></tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-[#f5f5f7]/60 transition">
                        <td className="px-6 py-4.5">
                          <span className="font-semibold text-[#1d1d1f] text-sm block">{booking.visitor}</span>
                          <span className="text-[10px] text-[#86868b] font-mono mt-0.5 block">{booking.id}</span>
                        </td>
                        <td className="px-6 py-4.5 font-mono font-bold text-[#1d1d1f]">{booking.ticketCode || "Not issued"}</td>
                        <td className="px-6 py-4.5">
                          <span className="inline-flex items-center gap-1.5 text-[#1d1d1f] font-medium">
                            <MapPin className="h-3.5 w-3.5 text-[#c1122f]" />{booking.attractionName}
                          </span>
                        </td>
                        <td className="px-6 py-4.5">{booking.partySize} {booking.partySize === 1 ? "Guest" : "Guests"}</td>
                        <td className="px-6 py-4.5 text-[#86868b] font-mono">{[booking.bookingDate, booking.bookingTime].filter(Boolean).join(" ") || "—"}</td>
                        <td className="px-6 py-4.5">
                          <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${booking.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                            {booking.status === "pending" ? "Pending" : "Admitted"}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          {booking.status === "pending" ? (
                            <button
                              type="button"
                              onClick={() => void handleAdmit(booking)}
                              disabled={savingId !== null || !booking.ticketCode}
                              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-1.5 shadow-xs transition disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {savingId === booking.id ? "Validating…" : "Verify & Admit"}
                            </button>
                          ) : (
                            <span className="text-[#86868b] text-xs italic font-medium">Entry recorded</span>
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
