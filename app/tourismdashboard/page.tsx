
"use client";

import Link from "next/link";
import AdminNav from "./AdminNav";
import { useLiveCollection } from "../lib/firestore";
import type { AttractionRecord, BookingRecord, PaymentRecord } from "../lib/models";

/* =========================================================
   QUICK ACCESS
========================================================= */

const quickAccess = [
  {
    title: "Bookings & Payments",
    description: "View visitor bookings and payment transactions",
    href: "/tourismdashboard/bookings",
  },
  {
    title: "Staff Assignments",
    description: "View and manage staff assigned to attractions",
    href: "/tourismdashboard/staff-assignments",
  },
  {
    title: "Manage Attractions",
    description: "Manage attraction details and visitor capacity",
    href: "/tourismdashboard/attractions",
  },
  {
    title: "Manage Accounts",
    description: "View and manage visitor and staff accounts",
    href: "/tourismdashboard/accounts",
  },
];

/* =========================================================
   OCCUPANCY STATUS
   Soft / muted colors
========================================================= */

function getOccupancyStatus(
  current: number | null,
  capacity: number | null
) {
  if (current === null || capacity === null || capacity <= 0) {
    return {
      label: "Unavailable",
      dot: "bg-gray-300",
      text: "text-gray-500",
      bar: "bg-gray-300",
    };
  }
  const percentage =
    capacity > 0
      ? Math.round((current / capacity) * 100)
      : 0;

  if (percentage >= 100) {
    return {
      label: "Full",
      dot: "bg-[#B76B73]",
      text: "text-[#A45460]",
      bar: "bg-[#B76B73]",
    };
  }

  if (percentage >= 71) {
    return {
      label: "Busy",
      dot: "bg-[#C88968]",
      text: "text-[#A56849]",
      bar: "bg-[#C88968]",
    };
  }

  if (percentage >= 41) {
    return {
      label: "Moderate",
      dot: "bg-[#C4A35A]",
      text: "text-[#92732F]",
      bar: "bg-[#C4A35A]",
    };
  }

  return {
    label: "Available",
    dot: "bg-[#6B9B83]",
    text: "text-[#4D8067]",
    bar: "bg-[#6B9B83]",
  };
}

/* =========================================================
   BOOKING AND PAYMENT STATUS STYLES
========================================================= */

function getStatusStyle(status: string) {
  if (status === "Paid" || status === "Confirmed") {
    return "bg-[#E9F3ED] text-[#4D8067]";
  }

  if (status === "Pending") {
    return "bg-[#F7F0E0] text-[#92732F]";
  }

  return "bg-gray-100 text-gray-600";
}

/* =========================================================
   TOURISM DASHBOARD OVERVIEW
========================================================= */

export default function TourismDashboardPage() {
  const { records: attractionRecords, loading: attractionsLoading, error: attractionsError } =
    useLiveCollection<AttractionRecord>("attractions");
  const { records: bookings, loading: bookingsLoading, error: bookingsError } =
    useLiveCollection<BookingRecord>("bookings");
  const { records: payments, loading: paymentsLoading, error: paymentsError } =
    useLiveCollection<PaymentRecord>("payments");
  const occupancyData = attractionRecords.map((attraction) => ({
    id: attraction.id,
    name: attraction.name,
    current: typeof attraction.currentVisitors === "number" ? attraction.currentVisitors : null,
    capacity: typeof attraction.capacity === "number" ? attraction.capacity : null,
    capacityIsPreview: attraction.capacityIsPreview !== false,
  }));
  const occupancyAvailable = occupancyData.length > 0 && occupancyData.every(
    (attraction) =>
      attraction.current !== null &&
      attraction.capacity !== null &&
      attraction.capacity > 0 &&
      !attraction.capacityIsPreview
  );
  const recentBookings = [...bookings]
    .sort((a, b) => {
      const getTime = (value: unknown) => {
        if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
          return value.toDate().getTime();
        }
        if (value instanceof Date) return value.getTime();
        if (typeof value === "string") {
          const date = new Date(value);
          return Number.isNaN(date.getTime()) ? 0 : date.getTime();
        }
        return 0;
      };
      return getTime(b.createdAt) - getTime(a.createdAt);
    })
    .slice(0, 5)
    .map((booking) => ({
    id: booking.id,
    visitor: booking.visitor || booking.email || "—",
    attraction: booking.attractionName || "—",
    schedule: `${booking.bookingDate || "—"} ${booking.bookingTime || ""}`.trim(),
    bookingStatus: booking.status === "confirmed" ? "Confirmed" : booking.status === "cancelled" ? "Cancelled" : booking.status === "pending" ? "Pending" : "Unknown",
    paymentStatus: booking.paymentStatus === "paid" ? "Paid" : booking.paymentStatus === "refunded" ? "Refunded" : booking.paymentStatus === "pending" ? "Pending" : "Unknown",
  }));
  const summaryCards = [
    {
      label: "Total Bookings",
      value: bookingsError ? "Unavailable" : bookingsLoading ? "—" : String(bookings.length),
      description: "Total visitor bookings",
      href: "/tourismdashboard/bookings",
    },
    {
      label: "Payment Records",
      value: paymentsError
        ? "Unavailable"
        : paymentsLoading
        ? "—"
        : String(payments.filter((payment) => (payment.status ?? payment.paymentStatus) === "paid").length),
      description: "Recorded successful payments",
      href: "/tourismdashboard/bookings",
    },
    {
      label: "Total Attractions",
      value: attractionsError ? "Unavailable" : attractionsLoading ? "—" : String(attractionRecords.length),
      description: "Registered tourist attractions",
      href: "/tourismdashboard/attractions",
    },
    {
      label: "Visitors Currently Inside",
      value: attractionsLoading || attractionsError || !occupancyAvailable
        ? "—"
        : String(occupancyData.reduce((total, attraction) => total + (attraction.current ?? 0), 0)),
      description: "Visitors inside monitored attractions",
      href: "/tourismdashboard/monitoring",
    },
  ];

  return (
    <>
      <AdminNav />

      <main className="min-h-screen bg-[#f7f7f8] px-5 pb-16 pt-28 sm:px-6 lg:ml-[280px] lg:px-8 lg:pt-12">
        <div className="mx-auto max-w-[1400px]">
          {/* PAGE HEADER */}
          <div className="mb-9 flex flex-col justify-between gap-5 border-b border-gray-200 pb-7 md:flex-row md:items-end">
            <div>
              <p
                className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c1122f]"
                style={{
                  fontFamily: "var(--font-montemaria-sans)",
                }}
              >
                Tourism Administration
              </p>

              <h1
                className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
                style={{
                  fontFamily: "var(--font-montemaria-sans)",
                }}
              >
                Dashboard Overview
              </h1>

              <p
                className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 md:text-base"
                style={{
                  fontFamily: "var(--font-montemaria-sans)",
                }}
              >
                Monitor visitor bookings, payment transactions,
                attraction capacity, and visitor activity
                across Montemaria.
              </p>
            </div>

            <div className="md:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                Tourism Office
              </p>

              <p className="mt-1 text-sm font-medium text-gray-700">
                Montemaria
              </p>
            </div>
          </div>

          {(attractionsError || bookingsError || paymentsError) && (
            <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {attractionsError || bookingsError || paymentsError}
            </p>
          )}

          {/* SUMMARY CARDS */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
                      {card.label}
                    </p>

                    <p
                      className="mt-4 text-4xl font-bold text-gray-900"
                      style={{
                        fontFamily: "var(--font-montemaria-sans)",
                      }}
                    >
                      {card.value}
                    </p>
                  </div>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500 transition-colors group-hover:bg-[#c1122f] group-hover:text-white">
                    →
                  </span>
                </div>

                <p className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-500">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>

          {/* MAIN DASHBOARD GRID */}
          <div className="mt-8 grid gap-7 2xl:grid-cols-[1.15fr_0.85fr]">
            {/* ATTRACTION VISITOR MONITORING */}
            <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c1122f]"
                    style={{
                      fontFamily: "var(--font-montemaria-sans)",
                    }}
                  >
                    Visitor Monitoring
                  </p>

                  <h2
                    className="mt-1 text-2xl font-bold text-gray-900"
                    style={{
                      fontFamily: "var(--font-montemaria-sans)",
                    }}
                  >
                    Attraction Visitor Monitoring
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Current visitor counts and capacity. Temporary preview limits are excluded from occupancy calculations.
                  </p>
                </div>

                <Link
                  href="/tourismdashboard/monitoring"
                  className="shrink-0 text-sm font-semibold text-[#c1122f] transition hover:text-[#9e0e26]"
                >
                  View all →
                </Link>
              </div>

              {/* OCCUPANCY LEGEND */}
              <div className="flex flex-wrap gap-x-5 gap-y-3 border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                {[
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
                  {
                    label: "Unavailable",
                    range: "Data unavailable",
                    dot: "bg-gray-300",
                  },
                ].map((item) => (
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

              {/* ATTRACTION OCCUPANCY LIST */}
              <div className="divide-y divide-gray-100">
                {attractionsLoading ? (
                  <p className="px-6 py-10 text-center text-sm text-gray-500">Loading attraction records…</p>
                ) : attractionsError ? (
                  <p role="alert" className="px-6 py-10 text-center text-sm text-red-700">{attractionsError}</p>
                ) : occupancyData.length === 0 ? (
                  <p className="px-6 py-10 text-center text-sm text-gray-500">No attractions have been added.</p>
                ) : occupancyData.map((attraction) => {
                  const percentage =
                    attraction.capacity !== null &&
                    attraction.capacity > 0 &&
                    attraction.current !== null &&
                    !attraction.capacityIsPreview
                      ? Math.min(
                          100,
                          Math.round(
                            (attraction.current /
                              attraction.capacity) *
                              100
                          )
                        )
                      : null;

                  const status = getOccupancyStatus(
                    attraction.current,
                    attraction.capacityIsPreview ? null : attraction.capacity
                  );

                  return (
                    <div
                      key={attraction.id}
                      className="px-6 py-5"
                    >
                      <div className="mb-3 flex items-center justify-between gap-5">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${status.dot}`}
                          />

                          <div className="min-w-0">
                            <h3
                              className="font-bold text-gray-900"
                              style={{
                                fontFamily: "var(--font-montemaria-sans)",
                              }}
                            >
                              {attraction.name}
                            </h3>

                            <p className="mt-0.5 text-xs text-gray-400">
                              {attraction.current ?? "—"} of {attraction.capacity ?? "—"} visitors
                              {attraction.capacityIsPreview ? " · temporary capacity" : ""}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p
                            className={`text-sm font-bold ${status.text}`}
                          >
                            {status.label}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {percentage === null ? "—" : `${percentage}%`}
                          </p>
                        </div>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${status.bar}`}
                          style={{
                            width: `${percentage ?? 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* QUICK ACCESS */}
            <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  Administration
                </p>

                <h2
                  className="mt-1 text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "var(--font-montemaria-sans)",
                  }}
                >
                  Quick Access
                </h2>
              </div>

              <div className="space-y-3">
                {quickAccess.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-[#c1122f]/40 hover:bg-red-50/30"
                  >
                    <div>
                      <p className="font-bold text-gray-900">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {item.description}
                      </p>
                    </div>

                    <span className="shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#c1122f]">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* RECENT BOOKINGS AND PAYMENTS */}
          <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  Booking & Payment Records
                </p>

                <h2
                  className="mt-1 text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "var(--font-montemaria-sans)",
                  }}
                >
                  Recent Bookings & Payments
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Recent visitor booking and payment information
                </p>
              </div>

              <Link
                href="/tourismdashboard/bookings"
                className="shrink-0 text-sm font-semibold text-[#c1122f] transition hover:text-[#9e0e26]"
              >
                View all →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {[
                      "Booking ID",
                      "Visitor",
                      "Attraction",
                      "Schedule",
                      "Booking Status",
                      "Payment Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {bookingsLoading ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">Loading booking records…</td></tr>
                  ) : bookingsError ? (
                    <tr><td colSpan={6} role="alert" className="px-5 py-8 text-center text-sm text-red-700">{bookingsError}</td></tr>
                  ) : recentBookings.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">No booking records are available.</td></tr>
                  ) : recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="transition-colors hover:bg-gray-50/60"
                    >
                      <td className="px-5 py-5 text-sm font-semibold text-gray-500">
                        {booking.id}
                      </td>

                      <td className="px-5 py-5 text-sm font-semibold text-gray-900">
                        {booking.visitor}
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-600">
                        {booking.attraction}
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-600">
                        {booking.schedule}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                            booking.bookingStatus
                          )}`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                            booking.paymentStatus
                          )}`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FOOTER */}
          <div className="mt-8 text-center text-xs text-gray-400">
            Montemaria Express · Tourism Administration
          </div>
        </div>
      </main>
    </>
  );
}
