"use client";

import Link from "next/link";
import AdminNav from "./AdminNav";

const summaryCards = [
  {
    label: "Current Visitors",
    value: "215",
    description: "Across all attractions",
    href: "/tourismdashboard/monitoring",
  },
  {
    label: "Reservations Today",
    value: "42",
    description: "Confirmed reservations",
    href: "/tourismdashboard/reservations",
  },
  {
    label: "Available Slots",
    value: "86",
    description: "Across paid attractions",
    href: "/tourismdashboard/attractions",
  },
  {
    label: "Total Attractions",
    value: "8",
    description: "Monitored attractions",
    href: "/tourismdashboard/attractions",
  },
];

const occupancyData = [
  {
    id: 1,
    name: "Mirage Walk",
    current: 8,
    capacity: 20,
  },
  {
    id: 2,
    name: "View Deck",
    current: 35,
    capacity: 50,
  },
  {
    id: 3,
    name: "Glass Walk",
    current: 15,
    capacity: 15,
  },
  {
    id: 4,
    name: "Miracle Walk",
    current: 12,
    capacity: 30,
  },
];

const recentReservations = [
  {
    id: "RES-1001",
    visitor: "Juan Dela Cruz",
    attraction: "Mirage Walk",
    schedule: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: "RES-1002",
    visitor: "Maria Santos",
    attraction: "View Deck",
    schedule: "11:30 AM",
    status: "Confirmed",
  },
  {
    id: "RES-1003",
    visitor: "Carlo Reyes",
    attraction: "Glass Walk",
    schedule: "1:00 PM",
    status: "Confirmed",
  },
];

function getOccupancyStatus(current: number, capacity: number) {
  const percentage = (current / capacity) * 100;

  if (percentage >= 100) {
    return {
      label: "Full",
      dot: "bg-red-500",
      text: "text-red-600",
      bar: "bg-red-500",
    };
  }

  if (percentage >= 71) {
    return {
      label: "Busy",
      dot: "bg-orange-500",
      text: "text-orange-600",
      bar: "bg-orange-500",
    };
  }

  if (percentage >= 41) {
    return {
      label: "Moderate",
      dot: "bg-yellow-500",
      text: "text-yellow-700",
      bar: "bg-yellow-500",
    };
  }

  return {
    label: "Available",
    dot: "bg-green-500",
    text: "text-green-600",
    bar: "bg-green-500",
  };
}

export default function TourismDashboardPage() {
  return (
    <>
      <AdminNav />

      <main className="min-h-screen bg-[#f7f7f8] px-6 pb-16 pt-[112px] lg:px-8">
        <div className="mx-auto max-w-[1400px]">

          {/* =========================================
              PAGE HEADER
          ========================================== */}
          <div className="mb-9 flex flex-col justify-between gap-5 border-b border-gray-200 pb-7 md:flex-row md:items-end">
            <div>
              <p
                className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c1122f]"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Tourism Administration
              </p>

              <h1
                className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                Dashboard Overview
              </h1>

              <p
                className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 md:text-base"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                View the current status of reservations, visitor counts,
                attraction capacity, and tourism operations.
              </p>
            </div>

            <div className="md:text-right">
              <p
                className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Tourism Office
              </p>

              <p
                className="mt-1 text-sm font-medium text-gray-700"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Montemaria
              </p>
            </div>
          </div>

          {/* =========================================
              SUMMARY CARDS
          ========================================== */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400"
                      style={{
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      {card.label}
                    </p>

                    <p
                      className="mt-4 text-4xl font-bold text-gray-900"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                      }}
                    >
                      {card.value}
                    </p>
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500 transition-colors group-hover:bg-[#c1122f] group-hover:text-white">
                    →
                  </span>
                </div>

                <p
                  className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-500"
                  style={{
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  {card.description}
                </p>
              </Link>
            ))}
          </div>

          {/* =========================================
              MAIN DASHBOARD GRID
          ========================================== */}
          <div className="mt-8 grid gap-7 xl:grid-cols-[1.15fr_0.85fr]">

            {/* =========================================
                CURRENT OCCUPANCY
            ========================================== */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c1122f]"
                    style={{
                      fontFamily: "'Lato', sans-serif",
                    }}
                  >
                    Live Status
                  </p>

                  <h2
                    className="mt-1 text-2xl font-bold text-gray-900"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    Current Occupancy
                  </h2>
                </div>

                <Link
                  href="/tourismdashboard/monitoring"
                  className="text-sm font-semibold text-[#c1122f] transition hover:text-[#9e0e26]"
                  style={{
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  View all →
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {occupancyData.map((attraction) => {
                  const percentage = Math.min(
                    100,
                    Math.round(
                      (attraction.current / attraction.capacity) * 100
                    )
                  );

                  const status = getOccupancyStatus(
                    attraction.current,
                    attraction.capacity
                  );

                  return (
                    <div key={attraction.id} className="px-6 py-5">
                      <div className="mb-3 flex items-center justify-between gap-5">
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${status.dot}`}
                          />

                          <div>
                            <h3
                              className="font-bold text-gray-900"
                              style={{
                                fontFamily:
                                  "'Playfair Display', Georgia, serif",
                              }}
                            >
                              {attraction.name}
                            </h3>

                            <p
                              className="mt-0.5 text-xs text-gray-400"
                              style={{
                                fontFamily: "'Lato', sans-serif",
                              }}
                            >
                              {attraction.current} of {attraction.capacity}{" "}
                              visitors
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p
                            className={`text-sm font-bold ${status.text}`}
                            style={{
                              fontFamily: "'Lato', sans-serif",
                            }}
                          >
                            {status.label}
                          </p>

                          <p
                            className="mt-0.5 text-xs text-gray-400"
                            style={{
                              fontFamily: "'Lato', sans-serif",
                            }}
                          >
                            {percentage}%
                          </p>
                        </div>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${status.bar}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* =========================================
                QUICK ACCESS
            ========================================== */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400"
                  style={{
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  Administration
                </p>

                <h2
                  className="mt-1 text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Quick Access
                </h2>
              </div>

              <div className="space-y-3">
                <Link
                  href="/tourismdashboard/reservations"
                  className="group flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-[#c1122f]/40 hover:bg-red-50/30"
                >
                  <div>
                    <p
                      className="font-bold text-gray-900"
                      style={{
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      Reservation Records
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      View reservations and payment information
                    </p>
                  </div>

                  <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#c1122f]">
                    →
                  </span>
                </Link>

                <Link
                  href="/tourismdashboard/records"
                  className="group flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-[#c1122f]/40 hover:bg-red-50/30"
                >
                  <div>
                    <p
                      className="font-bold text-gray-900"
                      style={{
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      Visitor Records
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Review QR verification and entry/exit records
                    </p>
                  </div>

                  <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#c1122f]">
                    →
                  </span>
                </Link>

                <Link
                  href="/tourismdashboard/attractions"
                  className="group flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-[#c1122f]/40 hover:bg-red-50/30"
                >
                  <div>
                    <p
                      className="font-bold text-gray-900"
                      style={{
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      Attractions & Slots
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Manage attraction information, schedules, and capacity
                    </p>
                  </div>

                  <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#c1122f]">
                    →
                  </span>
                </Link>

                <Link
                  href="/tourismdashboard/users"
                  className="group flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-[#c1122f]/40 hover:bg-red-50/30"
                >
                  <div>
                    <p
                      className="font-bold text-gray-900"
                      style={{
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      User Management
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      View and manage system user information
                    </p>
                  </div>

                  <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#c1122f]">
                    →
                  </span>
                </Link>
              </div>
            </section>
          </div>

          {/* =========================================
              RECENT RESERVATIONS
          ========================================== */}
          <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400"
                  style={{
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  Reservation Records
                </p>

                <h2
                  className="mt-1 text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Recent Reservations
                </h2>
              </div>

              <Link
                href="/tourismdashboard/reservations"
                className="text-sm font-semibold text-[#c1122f] transition hover:text-[#9e0e26]"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                View all →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">
                      Reservation ID
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">
                      Visitor
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">
                      Attraction
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">
                      Schedule
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="transition-colors hover:bg-gray-50/60"
                    >
                      <td className="px-6 py-5 text-sm font-semibold text-gray-500">
                        {reservation.id}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                        {reservation.visitor}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {reservation.attraction}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {reservation.schedule}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                          {reservation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}