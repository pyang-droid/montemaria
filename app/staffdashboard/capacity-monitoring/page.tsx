"use client";

import StaffAuthGuard, { useStaffAuth } from "../StaffAuthGuard";
import StaffNav from "../StaffNav";
import {
  type AttractionStatus,
  useStaffOperations,
} from "../useStaffOperations";
import {
  MapPin,
} from "lucide-react";

function CapacityMonitoringContent() {
  const { assignedAttraction } = useStaffAuth();
  const {
    attractions,
    attractionsLoading,
    attractionsError,
    manualAdjustCount,
  } = useStaffOperations(assignedAttraction);

  const occupancyAvailable = attractions.length > 0 && attractions.every(
    (attraction) =>
      attraction.currentVisitors !== null &&
      attraction.capacity !== null &&
      attraction.capacity > 0
  );
  const totalCurrent = attractions.reduce((sum, attraction) => sum + (attraction.currentVisitors ?? 0), 0);
  const totalMax = attractions.reduce((sum, attraction) => sum + (attraction.capacity ?? 0), 0);
  const overallPercentage = occupancyAvailable
    ? Math.round((totalCurrent / totalMax) * 100)
    : null;

  const adjustVisitorCount = (id: string, delta: number) => {
    void manualAdjustCount(delta, id);
  };

  const getCapacityColor = (current: number | null, max: number | null) => {
    if (current === null || max === null || max <= 0) return "bg-gray-300";
    const percentage = (current / max) * 100;
    if (percentage >= 95) return "bg-red-500";
    if (percentage >= 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStatusBadge = (status: AttractionStatus) => {
    switch (status) {
      case "Available":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Near Capacity":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Full":
        return "bg-red-50 text-red-800 border-red-200";
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "Unavailable":
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <>
      <StaffNav />
      <div className="min-h-screen bg-[#f5f5f7] pt-26 pb-20 px-5 md:px-8">
        <div className="max-w-[1280px] mx-auto space-y-7">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c1122f]">
                Crowd Regulation • Visitor Monitoring
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.045em] text-[#1d1d1f] mt-1">
                Capacity &amp; <span className="text-[#c1122f]">Crowd Monitoring</span>
              </h1>
              <p className="text-sm text-[#6e6e73] mt-2 max-w-xl">
                Real-time headcounts and capacity regulation. Temporary preview limits are labeled until verified by an administrator.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-2 text-xs font-semibold text-[#1d1d1f] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{attractionsLoading ? "Loading attraction records…" : attractionsError ? "Live data unavailable" : "Live Firestore records"}</span>
            </div>
          </div>

          {/* OVERALL CAPACITY METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] md:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase text-[#86868b] tracking-[0.14em]">
                    Total Sanctuary Load
                  </span>
                  <span className="text-xs font-mono font-bold text-[#1d1d1f]">
                    {overallPercentage === null ? "—" : `${overallPercentage}% Total Capacity`}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold font-serif text-[#1d1d1f]">
                    {occupancyAvailable ? totalCurrent : "—"}
                  </span>
                  <span className="text-sm text-[#86868b]">
                    / {occupancyAvailable ? totalMax : "—"} Max Permitted Capacity
                  </span>
                </div>
                {attractions.some((attraction) => attraction.capacityIsPreview) && (
                  <p className="mb-3 text-xs font-medium text-amber-700">
                    Total uses temporary preview capacities.
                  </p>
                )}
              </div>

              <div className="w-full bg-black/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#c1122f] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, overallPercentage ?? 0)}%` }}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.14em] mb-1">
                  Available Zones
                </p>
                <p className="text-3xl font-bold text-emerald-800 font-serif mt-1">
                  {attractionsLoading ? "—" : attractions.filter((a) => a.status === "Available").length}
                </p>
              </div>
              <p className="text-xs text-[#86868b] mt-3">Normal visitor flow</p>
            </div>

            <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.14em] mb-1">
                  High Occupancy Zones
                </p>
                <p className="text-3xl font-bold text-amber-700 font-serif mt-1">
                  {attractionsLoading ? "—" : attractions.filter((a) => a.status === "Near Capacity" || a.status === "Full").length}
                </p>
              </div>
              <p className="text-xs text-[#86868b] mt-3">Queue regulation required</p>
            </div>
          </div>

          {/* ATTRACTION CARDS GRID */}
          {attractionsError ? (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">{attractionsError}</p>
          ) : attractionsLoading ? (
            <p className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center text-sm text-[#6e6e73]">Loading attraction records…</p>
          ) : attractions.length === 0 ? (
            <p className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center text-sm text-[#6e6e73]">No attraction records are available.</p>
          ) : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction) => {
              const ratio =
                attraction.currentVisitors !== null &&
                attraction.capacity !== null &&
                attraction.capacity > 0
                  ? (attraction.currentVisitors / attraction.capacity) * 100
                  : null;
              const isAssigned = attraction.name === assignedAttraction;

              return (
                <div
                  key={attraction.id}
                  className={`rounded-[28px] border bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between ${
                    isAssigned
                      ? "ring-2 ring-[#c1122f] border-transparent"
                      : "border-black/[0.06]"
                  }`}
                >
                  <div>
                    {/* Header with Assigned indicator */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        {isAssigned && (
                          <span className="inline-block rounded-full bg-[#c1122f]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#c1122f] mb-1.5">
                            Your Assigned Post ★
                          </span>
                        )}
                        <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f] leading-tight">
                          {attraction.name}
                        </h3>
                        <p className="text-xs text-[#86868b] flex items-center gap-1.5 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-[#c1122f]" />
                          {attraction.location}
                        </p>
                        {attraction.capacityIsPreview && (
                          <span className="mt-1 inline-block rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                            Preview capacity
                          </span>
                        )}
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold border ${getStatusBadge(
                          attraction.status
                        )}`}
                      >
                        {attraction.status}
                      </span>
                    </div>

                    {/* Capacity numbers and gauge in landing page card style */}
                    <div className="my-5 p-4 rounded-2xl border border-black/[0.05] bg-[#f5f5f7]">
                      <div className="flex justify-between items-center mb-1.5 text-xs">
                        <span className="font-semibold text-[#1d1d1f]">
                          {attraction.currentVisitors ?? "—"} / {attraction.capacity ?? "—"} visitors
                        </span>
                        <span className="font-mono font-bold text-[#424245]">
                          {ratio === null ? "—" : `${Math.round(ratio)}%`}
                        </span>
                      </div>
                      <div className="bg-black/10 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getCapacityColor(
                            ratio,
                            100
                          )}`}
                          style={{ width: `${Math.min(100, ratio ?? 0)}%` }}
                        />
                      </div>
                    </div>

                    {/* Headcount adjustment buttons */}
                    <div className="flex items-center justify-between text-xs mb-5">
                      <span className="text-[#86868b] font-medium">Headcount:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustVisitorCount(attraction.id, -1)}
                          disabled={attraction.currentVisitors === null || attraction.capacity === null || attraction.currentVisitors <= 0}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] font-bold disabled:opacity-30 transition cursor-pointer"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustVisitorCount(attraction.id, 1)}
                          disabled={attraction.currentVisitors === null || attraction.capacity === null || attraction.currentVisitors >= attraction.capacity}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] font-bold transition cursor-pointer"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustVisitorCount(attraction.id, 5)}
                          disabled={attraction.currentVisitors === null || attraction.capacity === null || attraction.currentVisitors + 5 > attraction.capacity}
                          className="px-3 py-1 rounded-full border border-black/10 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] font-semibold transition cursor-pointer text-xs"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Status reflects current capacity data and is not manually simulated. */}
                  <div className="pt-4 border-t border-black/[0.05]">
                    <p className="text-[10px] text-[#86868b] uppercase font-bold tracking-[0.12em] mb-2">
                      Current Status:
                    </p>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(attraction.status)}`}>
                      {attraction.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>}

        </div>
      </div>
    </>
  );
}

export default function CapacityMonitoringPage() {
  return (
    <StaffAuthGuard>
      <CapacityMonitoringContent />
    </StaffAuthGuard>
  );
}
