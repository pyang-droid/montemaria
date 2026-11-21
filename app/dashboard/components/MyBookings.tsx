"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import type { BookingRecord } from "../../lib/models";

export default function MyBookings() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [error, setError] = useState(false);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [qrError, setQrError] = useState(false);
  const [expandedQrBooking, setExpandedQrBooking] =
    useState<BookingRecord | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    const generateCodes = async () => {
      try {
        const { BrowserQRCodeSvgWriter } = await import("@zxing/browser");
        const writer = new BrowserQRCodeSvgWriter();
        const images: Record<string, string> = {};

        for (const booking of bookings) {
          if (
            booking.status !== "confirmed" ||
            (booking.paymentStatus !== "paid" && booking.paymentStatus !== "free") ||
            booking.ticketStatus !== "active" ||
            !booking.ticketCode
          ) {
            continue;
          }

          const svg = writer.write(booking.ticketCode, 192, 192);
          const markup = new XMLSerializer().serializeToString(svg);
          images[booking.id] =
            `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
        }

        if (!cancelled) {
          setQrImages(images);
          setQrError(false);
        }
      } catch (generationError) {
        if (cancelled) return;
        console.error("Unable to generate booking QR codes:", generationError);
        setQrError(true);
      }
    };

    void generateCodes();
    return () => {
      cancelled = true;
    };
  }, [bookings]);

  useEffect(() => {
    if (!expandedQrBooking) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpandedQrBooking(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [expandedQrBooking]);

  return (
    <section id="my-bookings" className="scroll-mt-28">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">My Bookings</h2>
      {error && <p role="alert" className="text-red-700">Unable to load your bookings.</p>}
      {qrError && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          Some booking QR codes could not be generated. Refresh the page and try again.
        </p>
      )}
      {!bookings.length && !error ? (
        <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
          You do not have any bookings yet.
        </p>
      ) : (
      <ul className="grid gap-3 md:grid-cols-2">
        {bookings.map((booking) => (
          <li key={booking.id} className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900">{booking.attractionName}</h3>
              <p className="text-sm text-gray-700">
                {booking.bookingDate} · {booking.bookingTime} · {booking.numberOfVisitors} visitor(s)
              </p>
              {booking.transactionReference && (
                <p className="break-all text-sm text-gray-700">
                  Payment reference {booking.transactionReference}
                </p>
              )}
              {booking.status === "confirmed" &&
              (booking.paymentStatus === "paid" || booking.paymentStatus === "free") &&
              booking.ticketCode ? (
                <>
                  <p className="mt-2 break-all text-sm font-semibold text-green-800">
                    {booking.paymentStatus === "free" ? "Free visit ticket" : "Ticket code"}{" "}
                    {booking.ticketCode}
                  </p>
                  {booking.ticketStatus === "active" && qrImages[booking.id] && (
                    <p className="mt-1 text-xs text-gray-600">
                      Show this QR code to staff at the attraction.
                    </p>
                  )}
                  {booking.visitStatus === "inside" && (
                    <p className="mt-1 text-xs font-medium text-blue-700">
                      You are currently checked in.
                    </p>
                  )}
                  {booking.visitStatus === "exited" && (
                    <p className="mt-1 text-xs font-medium text-gray-600">
                      Visit completed.
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {booking.status === "cancelled" ? "Cancelled" :
                    booking.paymentStatus === "pending" ? "Awaiting payment verification" :
                    booking.paymentStatus === "refunded" ? "Refunded" : "Confirmed"}
                </p>
              )}
            </div>
            {booking.ticketStatus === "active" && qrImages[booking.id] && (
              <button
                type="button"
                onClick={() => setExpandedQrBooking(booking)}
                aria-label={`Expand QR ticket for ${booking.attractionName}`}
                className="group self-center rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 sm:self-auto"
              >
                <img
                  src={qrImages[booking.id]}
                  alt=""
                  width={144}
                  height={144}
                  className="h-36 w-36 rounded-lg border border-gray-200 bg-white p-2 transition-transform group-hover:scale-105"
                />
                <span className="mt-1 block text-center text-xs text-gray-600 underline">
                  Tap to enlarge
                </span>
              </button>
            )}
          </li>
        ))}
      </ul>
      )}
      {expandedQrBooking && qrImages[expandedQrBooking.id] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setExpandedQrBooking(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="expanded-qr-title"
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setExpandedQrBooking(null)}
              aria-label="Close enlarged QR ticket"
              className="absolute right-4 top-3 rounded-full p-2 text-2xl leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              ×
            </button>
            <h3 id="expanded-qr-title" className="pr-8 text-xl font-bold text-gray-900">
              {expandedQrBooking.attractionName}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {expandedQrBooking.bookingDate} · {expandedQrBooking.bookingTime} ·{" "}
              {expandedQrBooking.numberOfVisitors} visitor(s)
            </p>
            <img
              src={qrImages[expandedQrBooking.id]}
              alt={`Enlarged QR ticket for ${expandedQrBooking.attractionName}`}
              width={420}
              height={420}
              className="mx-auto mt-5 block aspect-square h-auto w-full max-w-[420px] rounded-xl border border-gray-200 bg-white p-3"
            />
            <p className="mt-4 text-sm font-medium text-gray-700">
              Show this larger QR code to staff to scan your visit ticket.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
