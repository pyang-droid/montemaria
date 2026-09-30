"use client";

import { useMemo, useState } from "react";
import AdminNav from "../AdminNav";

type ReservationStatus = "Confirmed" | "Pending" | "Cancelled";
type PaymentStatus = "Paid" | "Pending" | "Refunded";

interface Reservation {
  id: string;
  visitor: string;
  attraction: string;
  date: string;
  slot: string;
  guests: number;
  reservationStatus: ReservationStatus;
  paymentStatus: PaymentStatus;
  transactionReference: string;
}

const reservationRecords: Reservation[] = [
  {
    id: "RES-1001",
    visitor: "Juan Dela Cruz",
    attraction: "Mirage Walk",
    date: "September 30, 2026",
    slot: "10:00 AM",
    guests: 2,
    reservationStatus: "Confirmed",
    paymentStatus: "Paid",
    transactionReference: "TXN-847291",
  },
  {
    id: "RES-1002",
    visitor: "Maria Santos",
    attraction: "View Deck",
    date: "September 30, 2026",
    slot: "11:30 AM",
    guests: 3,
    reservationStatus: "Confirmed",
    paymentStatus: "Paid",
    transactionReference: "TXN-847292",
  },
  {
    id: "RES-1003",
    visitor: "Carlo Reyes",
    attraction: "Glass Walk",
    date: "September 30, 2026",
    slot: "1:00 PM",
    guests: 1,
    reservationStatus: "Pending",
    paymentStatus: "Pending",
    transactionReference: "Pending",
  },
  {
    id: "RES-1004",
    visitor: "Angela Cruz",
    attraction: "Mirage Walk",
    date: "October 1, 2026",
    slot: "9:30 AM",
    guests: 4,
    reservationStatus: "Confirmed",
    paymentStatus: "Paid",
    transactionReference: "TXN-847294",
  },
  {
    id: "RES-1005",
    visitor: "Paolo Garcia",
    attraction: "Glass Walk",
    date: "October 1, 2026",
    slot: "2:30 PM",
    guests: 2,
    reservationStatus: "Cancelled",
    paymentStatus: "Refunded",
    transactionReference: "TXN-847295",
  },
];

export default function ReservationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredReservations = useMemo(() => {
    return reservationRecords.filter((reservation) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        reservation.id.toLowerCase().includes(searchValue) ||
        reservation.visitor.toLowerCase().includes(searchValue) ||
        reservation.attraction.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        reservation.reservationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const confirmedCount = reservationRecords.filter(
    (reservation) => reservation.reservationStatus === "Confirmed"
  ).length;

  const pendingCount = reservationRecords.filter(
    (reservation) => reservation.reservationStatus === "Pending"
  ).length;

  const paidCount = reservationRecords.filter(
    (reservation) => reservation.paymentStatus === "Paid"
  ).length;

  const getReservationStyle = (status: ReservationStatus) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-50 text-green-700";
      case "Pending":
        return "bg-yellow-50 text-yellow-700";
      case "Cancelled":
        return "bg-red-50 text-red-700";
    }
  };

  const getPaymentStyle = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return "bg-green-50 text-green-700";
      case "Pending":
        return "bg-yellow-50 text-yellow-700";
      case "Refunded":
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <AdminNav />

      <main className="min-h-screen bg-[#f7f7f8] px-6 pb-16 pt-[112px] lg:px-8">
        <div className="mx-auto max-w-[1400px]">

          {/* HEADER */}
          <div className="mb-8 border-b border-gray-200 pb-7">
            <p
              className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c1122f]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Reservation Management
            </p>

            <h1
              className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Reservations
            </h1>

            <p
              className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 md:text-base"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              View visitor reservation records and their corresponding
              payment information.
            </p>
          </div>

          {/* SUMMARY */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Reservations
              </p>
              <p
                className="mt-3 text-3xl font-bold text-gray-900"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {reservationRecords.length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Confirmed
              </p>
              <p
                className="mt-3 text-3xl font-bold text-green-600"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {confirmedCount}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Pending
              </p>
              <p
                className="mt-3 text-3xl font-bold text-yellow-600"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {pendingCount}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Paid
              </p>
              <p
                className="mt-3 text-3xl font-bold text-gray-900"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {paidCount}
              </p>
            </div>
          </div>

          {/* RECORDS */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* TABLE HEADER / FILTERS */}
            <div className="flex flex-col gap-5 border-b border-gray-100 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2
                  className="text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Reservation Records
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Reservation and payment information from visitor bookings.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* SEARCH */}
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search reservation..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#c1122f] sm:w-[240px]"
                />

                {/* FILTER */}
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#c1122f]"
                >
                  <option value="All">All Status</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Reservation ID
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Visitor
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Attraction
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Date & Slot
                    </th>

                    <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Guests
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Reservation
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Transaction Reference
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-5 text-sm font-semibold text-gray-500">
                        {reservation.id}
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-gray-900">
                          {reservation.visitor}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {reservation.attraction}
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-gray-700">
                          {reservation.date}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {reservation.slot}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-center text-sm font-semibold text-gray-700">
                        {reservation.guests}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getReservationStyle(
                            reservation.reservationStatus
                          )}`}
                        >
                          {reservation.reservationStatus}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getPaymentStyle(
                            reservation.paymentStatus
                          )}`}
                        >
                          {reservation.paymentStatus}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-gray-500">
                        {reservation.transactionReference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* EMPTY SEARCH RESULT */}
            {filteredReservations.length === 0 && (
              <div className="px-6 py-16 text-center">
                <p
                  className="text-lg font-bold text-gray-800"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  No reservation records found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing the search term or reservation status.
                </p>
              </div>
            )}

            {/* FOOTER */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <p className="text-xs text-gray-400">
                Showing {filteredReservations.length} of{" "}
                {reservationRecords.length} reservation records
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}