
"use client";

import { useState } from "react";
import AdminNav from "../AdminNav";
import { useLiveCollection } from "../../lib/firestore";
import type { BookingRecord, PaymentRecord } from "../../lib/models";
import { Search, X, Eye, CalendarDays, CreditCard } from "lucide-react";

type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "Unknown";
type PaymentStatus = "Paid" | "Pending" | "Refunded" | "Unknown";

interface Booking {
  id: string;
  visitor: string;
  attraction: string;
  date: string;
  slot: string;
  guests: number | null;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  transactionReference: string;
  paymentMethod: string;
  amount: number | null;
}

interface Payment {
  id: string;
  bookingId: string;
  visitor: string;
  amount: number | null;
  paymentMethod: string;
  status: PaymentStatus;
  transactionReference: string;
}

const peso = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

function statusStyle(status: string) {
  switch (status) {
    case "Confirmed":
    case "Paid":
      return "bg-green-50 text-green-700";
    case "Pending":
      return "bg-yellow-50 text-yellow-700";
    case "Cancelled":
      return "bg-red-50 text-red-700";
    case "Refunded":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
}

export default function BookingsPage() {
  const { records, loading, error } =
    useLiveCollection<BookingRecord>("bookings");
  const {
    records: paymentRecords,
    loading: paymentsLoading,
    error: paymentsError,
  } = useLiveCollection<PaymentRecord>("payments");
  const bookingRecords: Booking[] = records.map((record) => ({
    id: record.id,
    visitor: record.visitor ?? record.email ?? "—",
    attraction: record.attractionName ?? "—",
    date: record.bookingDate
      ? new Date(`${record.bookingDate}T00:00:00`).toLocaleDateString("en-PH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "—",
    slot: record.bookingTime ?? "—",
    guests: typeof record.numberOfVisitors === "number" ? record.numberOfVisitors : null,
    bookingStatus: (record.status === "confirmed"
      ? "Confirmed"
      : record.status === "cancelled"
        ? "Cancelled"
        : record.status === "pending"
          ? "Pending"
          : "Unknown"),
    paymentStatus: record.paymentStatus === "paid"
      ? "Paid"
      : record.paymentStatus === "refunded"
        ? "Refunded"
        : record.paymentStatus === "pending"
          ? "Pending"
          : "Unknown",
    transactionReference: record.transactionReference ?? "—",
    paymentMethod: record.paymentMethod ?? "—",
    amount: typeof record.amount === "number" ? record.amount : null,
  }));
  const bookingsById = new Map(bookingRecords.map((booking) => [booking.id, booking]));
  const payments: Payment[] = paymentRecords.map((record) => {
    const booking = record.bookingId ? bookingsById.get(record.bookingId) : undefined;
    const rawStatus = record.status ?? record.paymentStatus;
    return {
      id: record.id,
      bookingId: record.bookingId ?? "—",
      visitor: booking?.visitor ?? "—",
      amount: typeof record.amount === "number" ? record.amount : null,
      paymentMethod: record.paymentMethod ?? "—",
      status: rawStatus === "paid"
        ? "Paid"
        : rawStatus === "pending"
          ? "Pending"
          : rawStatus === "refunded"
            ? "Refunded"
            : "Unknown",
      transactionReference: record.transactionReference ?? "—",
    };
  });
  const [search, setSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"bookings" | "payments">(
    "bookings"
  );
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
    null
  );

  const filteredBookings = bookingRecords.filter((booking) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        booking.id.toLowerCase().includes(query) ||
        booking.visitor.toLowerCase().includes(query) ||
        booking.attraction.toLowerCase().includes(query) ||
        booking.transactionReference.toLowerCase().includes(query);

      const matchesBooking =
        bookingFilter === "All" ||
        booking.bookingStatus === bookingFilter;

      const matchesPayment =
        paymentFilter === "All" ||
        booking.paymentStatus === paymentFilter;

      return matchesSearch && matchesBooking && matchesPayment;
    });
  const filteredPayments = payments.filter((payment) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      payment.id.toLowerCase().includes(query) ||
      payment.bookingId.toLowerCase().includes(query) ||
      payment.visitor.toLowerCase().includes(query) ||
      payment.transactionReference.toLowerCase().includes(query);
    return matchesSearch &&
      (paymentFilter === "All" || payment.status === paymentFilter);
  });

  const confirmedCount = bookingRecords.filter(
    (item) => item.bookingStatus === "Confirmed"
  ).length;

  const pendingPayments = bookingRecords.filter(
    (item) => item.paymentStatus === "Pending"
  ).length;

  const paidCount = payments.filter(
    (payment) => payment.status === "Paid"
  ).length;

  const summaryCards = [
    {
      label: "Total Bookings",
      value: loading ? "—" : bookingRecords.length,
      description: "All recorded bookings",
      color: "text-gray-900",
    },
    {
      label: "Confirmed Bookings",
      value: loading ? "—" : confirmedCount,
      description: "Successfully confirmed",
      color: "text-green-600",
    },
    {
      label: "Pending Payments",
      value: loading ? "—" : pendingPayments,
      description: "Awaiting payment confirmation",
      color: "text-yellow-600",
    },
    {
      label: "Successful Payments",
      value: paymentsLoading ? "—" : paidCount,
      description: "Completed payment transactions",
      color: "text-gray-900",
    },
  ];

  return (
    <>
      <AdminNav />

      <main className="min-h-screen bg-[#f7f7f8] px-5 pb-16 pt-28 sm:px-6 lg:ml-[280px] lg:px-8 lg:pt-12">
        <div className="mx-auto max-w-[1400px]">
          {/* PAGE HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-5 border-b border-gray-200 pb-7 md:flex-row md:items-end">
            <div>
              <p
                className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c1122f]"
                style={{ fontFamily: "var(--font-montemaria-sans)" }}
              >
                Tourism Administration
              </p>

              <h1
                className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
                style={{
                  fontFamily: "var(--font-montemaria-sans)",
                }}
              >
                Bookings & Payments
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 md:text-base">
                View and monitor visitor bookings, payment transactions,
                and booking confirmation status.
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

          {/* SUMMARY CARDS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {card.label}
                </p>

                <p
                  className={`mt-3 text-3xl font-bold ${card.color}`}
                  style={{
                    fontFamily: "var(--font-montemaria-sans)",
                  }}
                >
                  {card.value}
                </p>

                <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* RECORDS SECTION */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* SECTION HEADER */}
            <div className="border-b border-gray-100 px-6 pt-6">
              <h2
                className="text-2xl font-bold text-gray-900"
                style={{
                  fontFamily: "var(--font-montemaria-sans)",
                }}
              >
                Booking & Payment Records
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review visitor bookings and their corresponding payment
                information.
              </p>

              {/* TABS */}
              <div className="mt-6 flex gap-7">
                <button
                  type="button"
                  onClick={() => setActiveTab("bookings")}
                  className={`border-b-[3px] pb-3 text-sm font-bold transition ${
                    activeTab === "bookings"
                      ? "border-[#c1122f] text-[#c1122f]"
                      : "border-transparent text-gray-400 hover:text-gray-700"
                  }`}
                >
                  Booking Records
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("payments")}
                  className={`border-b-[3px] pb-3 text-sm font-bold transition ${
                    activeTab === "payments"
                      ? "border-[#c1122f] text-[#c1122f]"
                      : "border-transparent text-gray-400 hover:text-gray-700"
                  }`}
                >
                  Payment Records
                </button>
              </div>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col gap-3 border-b border-gray-100 p-6 xl:flex-row xl:items-center">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search booking, visitor, attraction, or reference..."
                  className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#c1122f]"
                />
              </div>

              <select
                value={bookingFilter}
                onChange={(event) => setBookingFilter(event.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
              >
                <option value="All">All Booking Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Unknown">Unknown</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
              >
                <option value="All">All Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setBookingFilter("All");
                  setPaymentFilter("All");
                }}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>

            {/* BOOKING RECORDS TABLE */}
            {activeTab === "bookings" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      {[
                        "Booking ID",
                        "Visitor",
                        "Attraction",
                        "Date & Time",
                        "Guests",
                        "Booking Status",
                        "Payment Status",
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
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="transition hover:bg-gray-50/70"
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

                        <td className="px-5 py-5">
                          <p className="text-sm font-medium text-gray-700">
                            {booking.date}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {booking.slot}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-sm font-semibold text-gray-700">
                          {booking.guests ?? "—"}
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge status={booking.bookingStatus} />
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge status={booking.paymentStatus} />
                        </td>

                        <td className="px-5 py-5">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(booking)}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#c1122f] hover:underline"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAYMENT RECORDS TABLE */}
            {activeTab === "payments" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      {[
                        "Transaction Reference",
                        "Booking ID",
                        "Visitor",
                        "Amount",
                        "Payment Method",
                        "Payment Status",
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
                    {filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="transition hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-5 text-sm font-semibold text-gray-600">
                          {payment.transactionReference}
                        </td>

                        <td className="px-5 py-5 text-sm text-gray-600">
                          {payment.bookingId}
                        </td>

                        <td className="px-5 py-5 text-sm font-semibold text-gray-900">
                          {payment.visitor}
                        </td>

                        <td className="px-5 py-5 text-sm font-semibold text-gray-700">
                          {payment.amount === null ? "—" : peso(payment.amount)}
                        </td>

                        <td className="px-5 py-5 text-sm text-gray-600">
                          {payment.paymentMethod}
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge status={payment.status} />
                        </td>

                        <td className="px-5 py-5">
                          {bookingsById.has(payment.bookingId) ? (
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(bookingsById.get(payment.bookingId) ?? null)}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-[#c1122f] hover:underline"
                            >
                              <Eye size={16} />
                              View Booking
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">No linked booking</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* EMPTY STATE */}
            {(activeTab === "bookings" ? loading : paymentsLoading) ? (
              <p className="px-6 py-16 text-center text-sm text-gray-500">
                Loading {activeTab === "bookings" ? "booking" : "payment"} records…
              </p>
            ) : (activeTab === "bookings" ? error : paymentsError) ? (
              <p role="alert" className="px-6 py-16 text-center text-sm text-red-700">
                {activeTab === "bookings" ? error : paymentsError}
              </p>
            ) : (activeTab === "bookings" ? filteredBookings.length === 0 : filteredPayments.length === 0) && (
              <div className="px-6 py-16 text-center">
                <Search size={30} className="mx-auto text-gray-300" />
                <h3
                  className="mt-4 text-lg font-bold text-gray-800"
                  style={{
                    fontFamily: "var(--font-montemaria-sans)",
                  }}
                >
                  No records found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {(activeTab === "bookings" ? bookingRecords.length : paymentRecords.length) === 0
                    ? `No ${activeTab === "bookings" ? "booking" : "payment"} records are available.`
                    : "Try changing your search term or filters."}
                </p>
              </div>
            )}

            {/* TABLE FOOTER */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <p className="text-xs text-gray-400">
                Showing {activeTab === "bookings" ? filteredBookings.length : filteredPayments.length} of{" "}
                {activeTab === "bookings" ? bookingRecords.length : paymentRecords.length} records
              </p>
            </div>
          </section>

          <p className="mt-8 text-center text-xs text-gray-400">
            Montemaria Express · Tourism Administration
          </p>
        </div>
      </main>

      {/* =====================================================
          BOOKING AND PAYMENT DETAILS MODAL
      ====================================================== */}

      {selectedBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBooking(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-details-title"
            className="max-h-[90vh] w-full max-w-[580px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#c1122f]">
                  Booking Information
                </p>
                <h2
                  id="booking-details-title"
                  className="mt-1 text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "var(--font-montemaria-sans)",
                  }}
                >
                  Booking Details
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close details"
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* BOOKING INFORMATION */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <CalendarDays size={18} className="text-[#c1122f]" />
                  <h3 className="font-bold text-gray-900">
                    Booking Information
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-5 rounded-xl bg-gray-50 p-5">
                  <Detail label="Booking ID" value={selectedBooking.id} />
                  <Detail
                    label="Visitor"
                    value={selectedBooking.visitor}
                  />
                  <Detail
                    label="Attraction"
                    value={selectedBooking.attraction}
                  />
                  <Detail
                    label="Number of Guests"
                    value={selectedBooking.guests === null ? "—" : String(selectedBooking.guests)}
                  />
                  <Detail label="Date" value={selectedBooking.date} />
                  <Detail label="Time" value={selectedBooking.slot} />
                  <div className="col-span-2">
                    <p className="mb-2 text-xs text-gray-400">
                      Booking Status
                    </p>
                    <StatusBadge
                      status={selectedBooking.bookingStatus}
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT INFORMATION */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#c1122f]" />
                  <h3 className="font-bold text-gray-900">
                    Payment Information
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-5 rounded-xl bg-gray-50 p-5">
                  <Detail
                    label="Payment Amount"
                    value={selectedBooking.amount === null ? "—" : peso(selectedBooking.amount)}
                  />
                  <Detail
                    label="Payment Method"
                    value={selectedBooking.paymentMethod}
                  />
                  <div className="col-span-2">
                    <Detail
                      label="Transaction Reference"
                      value={selectedBooking.transactionReference}
                    />
                  </div>
                  <div className="col-span-2">
                    <p className="mb-2 text-xs text-gray-400">
                      Payment Status
                    </p>
                    <StatusBadge
                      status={selectedBooking.paymentStatus}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl bg-[#c1122f] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9e0e26]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   REUSABLE DETAIL FIELD
========================================================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}
