
"use client";

import { useMemo, useState } from "react";
import AdminNav from "../AdminNav";
import {
  Users,
  MapPin,
  Search,
  Eye,
  X,
  Clock3,
  TicketCheck,
  LogIn,
  LogOut,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

type AttractionType = "Paid" | "Free";
type VerificationStatus = "Verified" | "Invalid";
type VisitStatus = "Inside" | "Exited" | "Denied";

interface AttractionMonitoring {
  id: number;
  name: string;
  location: string;
  type: AttractionType;
  currentVisitors: number;
  capacity: number;
}

interface VisitorRecord {
  id: string;
  visitorName: string;
  bookingId: string;
  ticketId: string;
  attractionId: number;
  verification: VerificationStatus;
  visitStatus: VisitStatus;
  entryTime: string | null;
  exitTime: string | null;
  verifiedBy: string | null;
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
];

const visitorRecords: VisitorRecord[] = [
  {
    id: "VIS-1001",
    visitorName: "Juan Dela Cruz",
    bookingId: "BK-1001",
    ticketId: "QR-1001",
    attractionId: 1,
    verification: "Verified",
    visitStatus: "Exited",
    entryTime: "2026-11-08T08:30:00",
    exitTime: "2026-11-08T09:15:00",
    verifiedBy: "Mark Anthony Reyes",
  },
  {
    id: "VIS-1002",
    visitorName: "Maria Santos",
    bookingId: "BK-1002",
    ticketId: "QR-1002",
    attractionId: 2,
    verification: "Verified",
    visitStatus: "Inside",
    entryTime: "2026-11-08T09:10:00",
    exitTime: null,
    verifiedBy: "Jessica Mendoza",
  },
  {
    id: "VIS-1003",
    visitorName: "Carlo Reyes",
    bookingId: "BK-1003",
    ticketId: "QR-1003",
    attractionId: 3,
    verification: "Verified",
    visitStatus: "Inside",
    entryTime: "2026-11-08T09:35:00",
    exitTime: null,
    verifiedBy: "Daniel Cruz",
  },
  {
    id: "VIS-1004",
    visitorName: "Angela Cruz",
    bookingId: "BK-1004",
    ticketId: "QR-1004",
    attractionId: 1,
    verification: "Invalid",
    visitStatus: "Denied",
    entryTime: null,
    exitTime: null,
    verifiedBy: "Mark Anthony Reyes",
  },
  {
    id: "VIS-1005",
    visitorName: "Paolo Garcia",
    bookingId: "BK-1005",
    ticketId: "QR-1005",
    attractionId: 4,
    verification: "Verified",
    visitStatus: "Exited",
    entryTime: "2026-11-08T10:00:00",
    exitTime: "2026-11-08T10:40:00",
    verifiedBy: "Mark Anthony Reyes",
  },
  {
    id: "VIS-1006",
    visitorName: "Sofia Mendoza",
    bookingId: "BK-1006",
    ticketId: "QR-1006",
    attractionId: 5,
    verification: "Verified",
    visitStatus: "Inside",
    entryTime: "2026-11-08T10:15:00",
    exitTime: null,
    verifiedBy: "Jessica Mendoza",
  },
  {
    id: "VIS-1007",
    visitorName: "Gabriel Torres",
    bookingId: "BK-1007",
    ticketId: "QR-1007",
    attractionId: 6,
    verification: "Verified",
    visitStatus: "Exited",
    entryTime: "2026-11-08T08:45:00",
    exitTime: "2026-11-08T09:30:00",
    verifiedBy: "Daniel Cruz",
  },
];

const occupancyLegend = [
  {
    label: "Available",
    range: "0–40%",
    dot: "bg-[#6B9B83]",
  },
  {
    label: "Moderate",
    range: "41–70%",
    dot: "bg-[#C4A35A]",
  },
  {
    label: "Busy",
    range: "71–99%",
    dot: "bg-[#C88968]",
  },
  {
    label: "Full",
    range: "100%",
    dot: "bg-[#B76B73]",
  },
];

function getOccupancyStatus(current: number, capacity: number) {
  const percentage =
    capacity > 0 ? Math.round((current / capacity) * 100) : 0;

  if (percentage >= 100) {
    return {
      label: "Full",
      text: "text-[#A45460]",
      dot: "bg-[#B76B73]",
      bar: "bg-[#B76B73]",
    };
  }

  if (percentage >= 71) {
    return {
      label: "Busy",
      text: "text-[#A56849]",
      dot: "bg-[#C88968]",
      bar: "bg-[#C88968]",
    };
  }

  if (percentage >= 41) {
    return {
      label: "Moderate",
      text: "text-[#92732F]",
      dot: "bg-[#C4A35A]",
      bar: "bg-[#C4A35A]",
    };
  }

  return {
    label: "Available",
    text: "text-[#4D8067]",
    dot: "bg-[#6B9B83]",
    bar: "bg-[#6B9B83]",
  };
}

function formatDateTime(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function VerificationBadge({
  status,
}: {
  status: VerificationStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        status === "Verified"
          ? "bg-[#E9F3ED] text-[#4D8067]"
          : "bg-[#F8EBED] text-[#A45460]"
      }`}
    >
      {status}
    </span>
  );
}

function VisitBadge({ status }: { status: VisitStatus }) {
  const colors: Record<VisitStatus, string> = {
    Inside: "bg-[#E9F0F5] text-[#58788F]",
    Exited: "bg-gray-100 text-gray-600",
    Denied: "bg-[#F8EBED] text-[#A45460]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${colors[status]}`}
    >
      {status}
    </span>
  );
}

export default function MonitoringPage() {
  const [attractionSearch, setAttractionSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState<"All" | AttractionType>("All");
  const [occupancyFilter, setOccupancyFilter] = useState("All");

  const [visitorSearch, setVisitorSearch] = useState("");
  const [visitFilter, setVisitFilter] = useState("All");
  const [attractionFilter, setAttractionFilter] = useState("All");

  const [selectedVisitor, setSelectedVisitor] =
    useState<VisitorRecord | null>(null);

  const totalVisitors = monitoringData.reduce(
    (total, attraction) => total + attraction.currentVisitors,
    0
  );

  const totalCapacity = monitoringData.reduce(
    (total, attraction) => total + attraction.capacity,
    0
  );

  const availableCapacity = monitoringData.reduce(
    (total, attraction) =>
      total +
      Math.max(0, attraction.capacity - attraction.currentVisitors),
    0
  );

  const fullAttractions = monitoringData.filter(
    (attraction) =>
      attraction.currentVisitors >= attraction.capacity
  ).length;

  const overallPercentage =
    totalCapacity > 0
      ? Math.round((totalVisitors / totalCapacity) * 100)
      : 0;

  const totalEntries = visitorRecords.filter(
    (record) => record.entryTime !== null
  ).length;

  const totalExits = visitorRecords.filter(
    (record) => record.exitTime !== null
  ).length;

  const deniedEntries = visitorRecords.filter(
    (record) => record.visitStatus === "Denied"
  ).length;

  const filteredAttractions = useMemo(() => {
    const query = attractionSearch.trim().toLowerCase();

    return monitoringData.filter((attraction) => {
      const matchesSearch =
        attraction.name.toLowerCase().includes(query) ||
        attraction.location.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All" || attraction.type === typeFilter;

      const occupancy = getOccupancyStatus(
        attraction.currentVisitors,
        attraction.capacity
      ).label;

      const matchesOccupancy =
        occupancyFilter === "All" ||
        occupancyFilter === occupancy;

      return matchesSearch && matchesType && matchesOccupancy;
    });
  }, [attractionSearch, typeFilter, occupancyFilter]);

  const filteredVisitorRecords = useMemo(() => {
    const query = visitorSearch.trim().toLowerCase();

    return visitorRecords.filter((record) => {
      const attraction = monitoringData.find(
        (item) => item.id === record.attractionId
      );

      const matchesSearch = [
        record.id,
        record.visitorName,
        record.bookingId,
        record.ticketId,
        record.verifiedBy ?? "",
        attraction?.name ?? "",
      ].some((value) => value.toLowerCase().includes(query));

      const matchesVisit =
        visitFilter === "All" ||
        record.visitStatus === visitFilter;

      const matchesAttraction =
        attractionFilter === "All" ||
        record.attractionId.toString() === attractionFilter;

      return matchesSearch && matchesVisit && matchesAttraction;
    });
  }, [visitorSearch, visitFilter, attractionFilter]);

  const summaryCards = [
    {
      title: "Current Visitors",
      value: totalVisitors,
      description: "Visitors currently inside attractions",
      icon: Users,
      color: "text-gray-900",
    },
    {
      title: "Total Capacity",
      value: totalCapacity,
      description: "Combined attraction capacity",
      icon: MapPin,
      color: "text-gray-900",
    },
    {
      title: "Available Capacity",
      value: availableCapacity,
      description: "Remaining simultaneous visitor capacity",
      icon: LogIn,
      color: "text-[#4D8067]",
    },
    {
      title: "Full Attractions",
      value: fullAttractions,
      description: "Attractions at maximum capacity",
      icon: AlertTriangle,
      color: "text-[#A45460]",
    },
  ];

  function clearAttractionFilters() {
    setAttractionSearch("");
    setTypeFilter("All");
    setOccupancyFilter("All");
  }

  function clearVisitorFilters() {
    setVisitorSearch("");
    setVisitFilter("All");
    setAttractionFilter("All");
  }

  function getAttractionName(id: number) {
    return (
      monitoringData.find((attraction) => attraction.id === id)
        ?.name ?? "Unknown Attraction"
    );
  }

  return (
    <>
      <AdminNav />

      <main className="min-h-screen bg-[#f7f7f8] px-5 pb-16 pt-28 sm:px-6 lg:ml-[280px] lg:px-8 lg:pt-12">
        <div className="mx-auto max-w-[1400px]">
          {/* HEADER */}
          <div className="mb-8 border-b border-gray-200 pb-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p
                  className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c1122f]"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Tourism Administration
                </p>

                <h1
                  className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
                  style={{
                    fontFamily:
                      "'Playfair Display', Georgia, serif",
                  }}
                >
                  Visitor Monitoring
                </h1>

                <p
                  className="mt-3 max-w-3xl text-sm leading-6 text-gray-500 md:text-base"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Monitor attraction occupancy, visitor capacity,
                  QR ticket verification results, and recorded
                  visitor entries and exits.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />

                <div>
                  <p className="text-xs font-bold text-gray-800">
                    Sample Data
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Not connected to live records
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SAMPLE DATA NOTICE */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs leading-5 text-gray-500">
            Demonstration data only. Occupancy counts are sample
            totals, while the visitor records below are
            illustrative entries and do not represent the
            complete set of visitors included in those totals.
          </div>

          {/* SUMMARY CARDS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {card.title}
                    </p>

                    <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500">
                      <Icon size={18} />
                    </div>
                  </div>

                  <p
                    className={`mt-3 text-3xl font-bold ${card.color}`}
                    style={{
                      fontFamily:
                        "'Playfair Display', Georgia, serif",
                    }}
                  >
                    {card.value}
                  </p>

                  <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                    {card.description}
                  </p>
                </div>
              );
            })}
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
                    fontFamily:
                      "'Playfair Display', Georgia, serif",
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
                className="h-full rounded-full bg-[#6B9B83] transition-all duration-500"
                style={{
                  width: `${Math.min(overallPercentage, 100)}%`,
                }}
              />
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Percentage of combined attraction capacity currently
              occupied in this sample dataset.
            </p>
          </section>

          {/* ATTRACTION OCCUPANCY */}
          <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 border-b border-gray-100 p-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2
                  className="text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily:
                      "'Playfair Display', Georgia, serif",
                  }}
                >
                  Attraction Occupancy
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Current visitor count compared with each
                  attraction&apos;s maximum capacity.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={attractionSearch}
                    onChange={(event) =>
                      setAttractionSearch(event.target.value)
                    }
                    placeholder="Search attraction..."
                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#c1122f] sm:w-[200px]"
                  />
                </div>

                <select
                  aria-label="Filter attraction type"
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(
                      event.target.value as
                        | "All"
                        | AttractionType
                    )
                  }
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#c1122f]"
                >
                  <option value="All">All Types</option>
                  <option value="Paid">Paid</option>
                  <option value="Free">Free</option>
                </select>

                <select
                  aria-label="Filter occupancy status"
                  value={occupancyFilter}
                  onChange={(event) =>
                    setOccupancyFilter(event.target.value)
                  }
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#c1122f]"
                >
                  <option value="All">All Occupancy</option>
                  <option value="Available">Available</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Busy">Busy</option>
                  <option value="Full">Full</option>
                </select>

                <button
                  type="button"
                  onClick={clearAttractionFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  <RotateCcw size={15} />
                  Clear
                </button>
              </div>
            </div>

            {/* SOFT OCCUPANCY LEGEND */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              {occupancyLegend.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-xs text-gray-500"
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${item.dot}`}
                  />

                  <span>
                    {item.label} ({item.range})
                  </span>
                </div>
              ))}
            </div>

            {/* ATTRACTION CARDS */}
            <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredAttractions.map((attraction) => {
                const rawPercentage =
                  attraction.capacity > 0
                    ? (attraction.currentVisitors /
                        attraction.capacity) *
                      100
                    : 0;

                const percentage = Math.round(rawPercentage);

                const status = getOccupancyStatus(
                  attraction.currentVisitors,
                  attraction.capacity
                );

                const remaining = Math.max(
                  0,
                  attraction.capacity -
                    attraction.currentVisitors
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

                    {/* OCCUPANCY PROGRESS */}
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${status.bar}`}
                        style={{
                          width: `${Math.min(rawPercentage, 100)}%`,
                        }}
                      />
                    </div>

                    {/* CAPACITY DETAILS */}
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

                    {rawPercentage >= 100 && (
                      <div className="mt-4 rounded-xl border border-[#EACBD0] bg-[#F8EBED] px-4 py-3">
                        <p className="text-xs font-semibold text-[#A45460]">
                          This attraction has reached its maximum
                          capacity.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredAttractions.length === 0 && (
              <div className="px-6 py-16 text-center">
                <p className="text-lg font-bold text-gray-800">
                  No attractions found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </section>

          {/* VISITOR RECORD SUMMARY */}
          <div className="mb-5">
            <h2
              className="text-2xl font-bold text-gray-900"
              style={{
                fontFamily:
                  "'Playfair Display', Georgia, serif",
              }}
            >
              Visitor Entry & Exit Records
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Review QR verification outcomes and staff-recorded
              visitor movements.
            </p>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Recorded Entries",
                value: totalEntries,
                icon: LogIn,
                color: "text-gray-900",
              },
              {
                title: "Recorded Exits",
                value: totalExits,
                icon: LogOut,
                color: "text-[#4D8067]",
              },
              {
                title: "Denied Entries",
                value: deniedEntries,
                icon: TicketCheck,
                color: "text-[#A45460]",
              },
            ].map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {card.title}
                    </p>

                    <Icon size={19} className="text-gray-400" />
                  </div>

                  <p
                    className={`mt-3 text-3xl font-bold ${card.color}`}
                    style={{
                      fontFamily:
                        "'Playfair Display', Georgia, serif",
                    }}
                  >
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* VISITOR RECORDS TABLE */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 border-b border-gray-100 p-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h3
                  className="text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily:
                      "'Playfair Display', Georgia, serif",
                  }}
                >
                  Visitor Records
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Verification results and entry/exit information.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={visitorSearch}
                    onChange={(event) =>
                      setVisitorSearch(event.target.value)
                    }
                    placeholder="Search visitor or ticket..."
                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#c1122f] sm:w-[220px]"
                  />
                </div>

                <select
                  aria-label="Filter visitor status"
                  value={visitFilter}
                  onChange={(event) =>
                    setVisitFilter(event.target.value)
                  }
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#c1122f]"
                >
                  <option value="All">All Visit Status</option>
                  <option value="Inside">Inside</option>
                  <option value="Exited">Exited</option>
                  <option value="Denied">Denied</option>
                </select>

                <select
                  aria-label="Filter visitor attraction"
                  value={attractionFilter}
                  onChange={(event) =>
                    setAttractionFilter(event.target.value)
                  }
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#c1122f]"
                >
                  <option value="All">All Attractions</option>

                  {monitoringData.map((attraction) => (
                    <option
                      key={attraction.id}
                      value={attraction.id.toString()}
                    >
                      {attraction.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={clearVisitorFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  <RotateCcw size={15} />
                  Clear
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {[
                      "Visitor",
                      "QR Ticket",
                      "Attraction",
                      "Verification",
                      "Visit Status",
                      "Entry Time",
                      "Exit Time",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredVisitorRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-5">
                        <p className="text-sm font-bold text-gray-900">
                          {record.visitorName}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {record.id}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-sm font-semibold text-gray-600">
                        {record.ticketId}
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-600">
                        {getAttractionName(record.attractionId)}
                      </td>

                      <td className="px-5 py-5">
                        <VerificationBadge
                          status={record.verification}
                        />
                      </td>

                      <td className="px-5 py-5">
                        <VisitBadge status={record.visitStatus} />
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-xs text-gray-600">
                        {formatDateTime(record.entryTime)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-xs text-gray-600">
                        {formatDateTime(record.exitTime)}
                      </td>

                      <td className="px-5 py-5">
                        <button
                          type="button"
                          onClick={() => setSelectedVisitor(record)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c1122f] hover:underline"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredVisitorRecords.length === 0 && (
              <div className="px-6 py-16 text-center">
                <p className="text-lg font-bold text-gray-800">
                  No visitor records found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}

            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <p className="text-xs text-gray-400">
                Showing {filteredVisitorRecords.length} of{" "}
                {visitorRecords.length} sample visitor records
              </p>
            </div>
          </section>

          <p className="mt-8 text-center text-xs text-gray-400">
            Montemaria Express · Tourism Administration
          </p>
        </div>
      </main>

      {/* VISITOR DETAILS MODAL */}
      {selectedVisitor && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedVisitor(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="visitor-details-title"
            className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c1122f]">
                  Visitor Monitoring
                </p>

                <h2
                  id="visitor-details-title"
                  className="mt-1 text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily:
                      "'Playfair Display', Georgia, serif",
                  }}
                >
                  Visitor Details
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close visitor details"
                onClick={() => setSelectedVisitor(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Visitor Name
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {selectedVisitor.visitorName}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {selectedVisitor.id}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Booking ID
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {selectedVisitor.bookingId}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    QR Ticket ID
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {selectedVisitor.ticketId}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Attraction
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {getAttractionName(
                      selectedVisitor.attractionId
                    )}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    QR Verification
                  </p>

                  <VerificationBadge
                    status={selectedVisitor.verification}
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Visit Status
                  </p>

                  <VisitBadge status={selectedVisitor.visitStatus} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Verified By
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {selectedVisitor.verifiedBy ?? "—"}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 border-t border-gray-100 pt-5 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <LogIn size={16} />

                    <p className="text-xs font-bold uppercase tracking-wider">
                      Entry Time
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {formatDateTime(
                      selectedVisitor.entryTime
                    )}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <LogOut size={16} />

                    <p className="text-xs font-bold uppercase tracking-wider">
                      Exit Time
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {formatDateTime(
                      selectedVisitor.exitTime
                    )}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <Clock3
                    size={18}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />

                  <p className="text-xs leading-5 text-gray-500">
                    These are demonstration records. Actual QR
                    verification and visitor entry/exit updates
                    must be recorded through the Staff module
                    and stored in the database.
                  </p>
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => setSelectedVisitor(null)}
                  className="rounded-xl bg-[#c1122f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#9e0e26]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
