"use client";

import { useState } from "react";
import StaffAuthGuard, { useStaffAuth } from "../StaffAuthGuard";
import StaffNav from "../StaffNav";
import {
  INITIAL_ATTRACTIONS,
  AttractionInfo,
  AttractionStatus,
} from "../useStaffOperations";
import {
  MapPin,
} from "lucide-react";

function CapacityMonitoringContent() {
  const { assignedAttraction } = useStaffAuth();
  const [attractions, setAttractions] = useState<AttractionInfo[]>(INITIAL_ATTRACTIONS);

  const totalCurrent = attractions.reduce((sum, a) => sum + a.currentVisitors, 0);
  const totalMax = attractions.reduce((sum, a) => sum + a.capacity, 0);
  const overallPercentage = totalMax > 0 ? Math.round((totalCurrent / totalMax) * 100) : 0;

  const handleUpdateStatus = (id: number, newStatus: AttractionStatus) => {
    setAttractions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const adjustVisitorCount = (id: number, delta: number) => {
    setAttractions((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const newCount = Math.max(0, a.currentVisitors + delta);
        const ratio = newCount / a.capacity;
        let newStatus: AttractionStatus = "Available";
        if (ratio >= 1.0) newStatus = "Full";
        else if (ratio >= 0.75) newStatus = "Near Capacity";
        return {
          ...a,
          currentVisitors: newCount,
          status: newStatus,
        };
      })
    );
  };

  const getCapacityColor = (current: number, max: number) => {
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
                Crowd Regulation • Visitor Monitoring Information (Flow 3.0)
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.045em] text-[#1d1d1f] mt-1">
                Capacity &amp; <span className="text-[#c1122f]">Crowd Monitoring</span>
              </h1>
              <p className="text-sm text-[#6e6e73] mt-2 max-w-xl">
                Real-time headcounts, capacity regulation, and multi-zone safety thresholds across Monte Maria sanctuary grounds.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-2 text-xs font-semibold text-[#1d1d1f] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Telemetry: Active Sensors Connected</span>
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
                    {overallPercentage}% Total Capacity
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold font-serif text-[#1d1d1f]">
                    {totalCurrent}
                  </span>
                  <span className="text-sm text-[#86868b]">
                    / {totalMax} Max Permitted Capacity
                  </span>
                </div>
              </div>

              <div className="w-full bg-black/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#c1122f] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, overallPercentage)}%` }}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.14em] mb-1">
                  Available Zones
                </p>
                <p className="text-3xl font-bold text-emerald-800 font-serif mt-1">
                  {attractions.filter((a) => a.status === "Available").length}
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
                  {attractions.filter((a) => a.status === "Near Capacity" || a.status === "Full").length}
                </p>
              </div>
              <p className="text-xs text-[#86868b] mt-3">Queue regulation required</p>
            </div>
          </div>

          {/* ATTRACTION CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction) => {
              const ratio = (attraction.currentVisitors / attraction.capacity) * 100;
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
                          {attraction.currentVisitors} / {attraction.capacity} visitors
                        </span>
                        <span className="font-mono font-bold text-[#424245]">
                          {Math.round(ratio)}%
                        </span>
                      </div>
                      <div className="bg-black/10 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getCapacityColor(
                            attraction.currentVisitors,
                            attraction.capacity
                          )}`}
                          style={{ width: `${Math.min(100, ratio)}%` }}
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
                          disabled={attraction.currentVisitors <= 0}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] font-bold disabled:opacity-30 transition cursor-pointer"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustVisitorCount(attraction.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] font-bold transition cursor-pointer"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustVisitorCount(attraction.id, 5)}
                          className="px-3 py-1 rounded-full border border-black/10 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] font-semibold transition cursor-pointer text-xs"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Status buttons in landing pill style */}
                  <div className="pt-4 border-t border-black/[0.05]">
                    <p className="text-[10px] text-[#86868b] uppercase font-bold tracking-[0.12em] mb-2">
                      Operating Status:
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(attraction.id, "Available")}
                        className={`py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                          attraction.status === "Available"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "border border-black/10 bg-[#f5f5f7] text-[#424245] hover:bg-white"
                        }`}
                      >
                        Available
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(attraction.id, "Near Capacity")}
                        className={`py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                          attraction.status === "Near Capacity"
                            ? "bg-amber-500 text-white shadow-xs"
                            : "border border-black/10 bg-[#f5f5f7] text-[#424245] hover:bg-white"
                        }`}
                      >
                        Warning
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(attraction.id, "Full")}
                        className={`py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                          attraction.status === "Full"
                            ? "bg-[#c1122f] text-white shadow-xs"
                            : "border border-black/10 bg-[#f5f5f7] text-[#424245] hover:bg-white"
                        }`}
                      >
                        Full
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
