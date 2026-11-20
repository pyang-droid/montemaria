"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import type { BookingRecord } from "../../lib/models";

export default function MyBookings() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let unsubscribeBookings: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeBookings?.();
      setBookings([]);
      setError(false);
      if (!user) return;

      const ownBookings = query(collection(db, "bookings"), where("userId", "==", user.uid));
      unsubscribeBookings = onSnapshot(ownBookings, (snapshot) => {
        setBookings(snapshot.docs.map((record) => ({
          ...record.data(), id: record.id,
        }) as BookingRecord).sort((first, second) =>
          (second.bookingDate ?? "").localeCompare(first.bookingDate ?? "")
        ));
        setError(false);
      }, () => setError(true));
    });

    return () => {
      unsubscribeAuth();
      unsubscribeBookings?.();
    };
  }, []);

  if (!bookings.length && !error) return null;

  return (
    <section id="my-bookings" className="mt-12">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">My Bookings</h2>
      {error && <p role="alert" className="text-red-700">Unable to load your bookings.</p>}
      <ul className="grid gap-3 md:grid-cols-2">
        {bookings.map((booking) => (
          <li key={booking.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-900">{booking.attractionName}</h3>
            <p className="text-sm text-gray-700">{booking.bookingDate} · {booking.bookingTime} · {booking.numberOfVisitors} visitor(s)</p>
            {booking.transactionReference && (
              <p className="break-all text-sm text-gray-700">Payment reference {booking.transactionReference}</p>
            )}
            {booking.status === "confirmed" && booking.paymentStatus === "paid" && booking.ticketCode ? (
              <p className="mt-2 break-all text-sm font-semibold text-green-800">Ticket code {booking.ticketCode}</p>
            ) : (
              <p className="mt-2 text-sm font-semibold text-gray-800">
                {booking.status === "cancelled" ? "Cancelled" :
                  booking.paymentStatus === "pending" ? "Awaiting payment verification" :
                  booking.paymentStatus === "refunded" ? "Refunded" : "Confirmed"}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
