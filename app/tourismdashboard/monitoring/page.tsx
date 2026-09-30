"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "../AdminNav";

type AttractionType = "Paid" | "Free";

interface AttractionMonitoring {
  id: number;
  name: string;
  location: string;
  type: AttractionType;
  currentVisitors: number;
  capacity: number;
}

const monitoringData: AttractionMonitoring[] = [
  {
    id: 1,
    name: "Mirage Walk",
    location: "East Wing",
    type: "Paid",
    currentVisitors: 8,
    capacity: 20,
  },
  {
    id: 2,
    name: "View Deck",
    location: "Summit",
    type: "Paid",
    currentVisitors: 35,
    capacity: 50,
  },
  {
    id: 3,
    name: "Glass Walk",
    location: "West Wing",
    type: "Paid",
    currentVisitors: 15,
    capacity: 15,
  },
  {
    id: 4,
    name: "Miracle Walk",
    location: "Main Path",
    type: "Free",
    currentVisitors: 12,
    capacity: 30,
  },
  {
    id: 5,
    name: "Gate of the Archangels",
    location: "Entrance",
    type: "Free",
    currentVisitors: 45,
    capacity: 60,
  },
  {
    id: 6,
    name: "Sto. Niño Chapel",
    location: "Central Garden",
    type: "Free",
    currentVisitors: 28,
    capacity: 40,
  },
  {
    id: 7,
    name: "Retreat Facility",
    location: "North Area",
    type: "Free",
    currentVisitors: 55,
    capacity: 80,
  },
  {
    id: 8,
    name: "St. John Paul II Chapel",
    location: "South Wing",
    type: "Free",
    currentVisitors: 62,
    capacity: 70,
  },
];

function getOccupancyStatus(current: number, capacity: number) {
  const percentage = capacity > 0 ? (current / capacity) * 100 : 0;

  if (percentage >= 100) {
    return {
      label: "Full",
      text: "text-red-700",
      dot: "bg-red-500",
      bar: "bg-red-500",
    };
  }

  if (percentage >= 71) {
    return {
      label: "Busy",
      text: "text-orange-700",
      dot: "bg-orange-500",
      bar: "bg-orange-500",
    };
  }

  if (percentage >= 41) {
    return {
      label: "Moderate",
      text: "text-yellow-700",
      dot: "bg-yellow-500",
      bar: "bg-yellow-500",
    };
  }

  return {
    label: "Available",
    text: "text-green-700",
    dot: "bg-green-500",
    bar: "bg-green-500",
  };
}

export default function MonitoringPage() {
  const [typeFilter, setTypeFilter] =
    useState<"All" | AttractionType>("All");

  const [search, setSearch] = useState("");

  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredAttractions = useMemo(() => {
    return monitoringData.filter((attraction) => {
      const matchesType =
        typeFilter === "All" || attraction.type === typeFilter;

      const matchesSearch = attraction.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [typeFilter, search]);

  const totalVisitors = monitoringData.reduce(
    (total, attraction) => total + attraction.currentVisitors,
    0
  );

  const totalCapacity = monitoringData.reduce(
    (total, attraction) => total + attraction.capacity,
    0
  );

  const availableCapacity = Math.max(
    0,
    totalCapacity - totalVisitors
  );

  const fullAttractions = monitoringData.filter(
    (attraction) =>
      attraction.currentVisitors >= attraction.capacity
  ).length;

  const overallPercentage =
    totalCapacity > 0
      ? Math.round((totalVisitors / totalCapacity) * 100)
      : 0;

  return (
    <>
      <AdminNav />

      <main className="min-h-screen bg-[#f7f7f8] px-6 pb-16 pt-[112px] lg:px-8">
        <div className="mx-auto max-w-[1400px]">

          {/* HEADER */}
          <div className="mb-8 border-b border-gray-200 pb-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <p
                  className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c1122f]"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Visitor Count Monitoring
                </p>

                <h1
                  className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Visitor Monitoring
                </h1>

                <p
                  className="mt-3 max-w-3xl text-sm leading-6 text-gray-500 md:text-base"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Monitor the current visitor count, attraction capacity,
                  and occupancy status across Monte Maria attractions.
                </p>
              </div>

              {/* LIVE STATUS */}
              <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">

                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                    Live
                  </span>
                </div>

                <div className="h-8 w-px bg-gray-200" />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Last Updated
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-gray-700">
                    {currentTime
                      ? currentTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "--:--:--"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Current Visitors
              </p>

              <p
                className="mt-3 text-3xl font-bold text-gray-900"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {totalVisitors}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Across all attractions
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Capacity
              </p>

              <p
                className="mt-3 text-3xl font-bold text-gray-900"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {totalCapacity}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Combined attraction capacity
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Available Capacity
              </p>

              <p
                className="mt-3 text-3xl font-bold text-green-600"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {availableCapacity}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Remaining visitor capacity
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Full Attractions
              </p>

              <p
                className="mt-3 text-3xl font-bold text-red-600"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {fullAttractions}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                At maximum capacity
              </p>
            </div>
          </div>

          {/* OVERALL OCCUPANCY */}
          <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                  Overall Occupancy
                </p>

                <h2
                  className="mt-1 text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {totalVisitors} / {totalCapacity} Visitors
                </h2>
              </div>

              <p className="text-2xl font-bold text-gray-900">
                {overallPercentage}%
              </p>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#c1122f] transition-all duration-500"
                style={{
                  width: `${Math.min(overallPercentage, 100)}%`,
                }}
              />
            </div>
          </section>

          {/* MONITORING */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* SECTION HEADER */}
            <div className="flex flex-col gap-5 border-b border-gray-100 p-6 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2
                  className="text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Attraction Occupancy
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Current visitor count compared with each attraction&apos;s
                  maximum capacity.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search attraction..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#c1122f] sm:w-[240px]"
                />

                <div className="flex rounded-xl bg-gray-100 p-1">
                  {(["All", "Paid", "Free"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTypeFilter(type)}
                      className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                        typeFilter === type
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* LEGEND */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-gray-100 bg-gray-50/50 px-6 py-4">

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Available 0–40%
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                Moderate 41–70%
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                Busy 71–99%
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                Full 100%
              </div>
            </div>

            {/* ATTRACTION CARDS */}
            <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredAttractions.map((attraction) => {
                const percentage =
                  attraction.capacity > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (attraction.currentVisitors /
                            attraction.capacity) *
                            100
                        )
                      )
                    : 0;

                const status = getOccupancyStatus(
                  attraction.currentVisitors,
                  attraction.capacity
                );

                const remaining = Math.max(
                  0,
                  attraction.capacity - attraction.currentVisitors
                );

                return (
                  <div
                    key={attraction.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* CARD HEADER */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${status.dot}`}
                          />

                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${status.text}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <h3
                          className="text-xl font-bold text-gray-900"
                          style={{
                            fontFamily:
                              "'Playfair Display', Georgia, serif",
                          }}
                        >
                          {attraction.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                          {attraction.location}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          attraction.type === "Paid"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {attraction.type}
                      </span>
                    </div>

                    {/* VISITOR COUNT */}
                    <div className="mt-7">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Current Visitors
                      </p>

                      <div className="mt-2 flex items-end justify-between">
                        <div>
                          <span
                            className="text-4xl font-bold text-gray-900"
                            style={{
                              fontFamily:
                                "'Playfair Display', Georgia, serif",
                            }}
                          >
                            {attraction.currentVisitors}
                          </span>

                          <span className="ml-1 text-lg text-gray-400">
                            / {attraction.capacity}
                          </span>
                        </div>

                        <span
                          className={`text-lg font-bold ${status.text}`}
                        >
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* PROGRESS */}
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${status.bar}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Capacity
                        </p>

                        <p className="mt-1 text-sm font-bold text-gray-800">
                          {attraction.capacity}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Remaining
                        </p>

                        <p className="mt-1 text-sm font-bold text-gray-800">
                          {remaining}
                        </p>
                      </div>
                    </div>

                    {/* FULL NOTICE */}
                    {percentage >= 100 && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-xs font-semibold text-red-700">
                          This attraction has reached its maximum capacity.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* NO RESULT */}
            {filteredAttractions.length === 0 && (
              <div className="px-6 py-16 text-center">
                <p
                  className="text-lg font-bold text-gray-800"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  No attractions found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing the search or attraction type.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}