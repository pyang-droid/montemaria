
"use client";

import { useState } from "react";
import type { BookingDetails } from "./BookingModal";

import Image from "next/image";
import { getPaymentQrCodes, paymentReferencePattern, type PaymentMethod } from "../../lib/qrPayment";

interface PaymentModalProps {
  booking: BookingDetails;
  onClose: () => void;
  onProcessPayment: (booking: BookingDetails, method: PaymentMethod, reference: string) => Promise<void>;
}

export default function PaymentModal({
  booking,
  onClose,
  onProcessPayment,
}: PaymentModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const [reference, setReference] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const paymentQr = getPaymentQrCodes(booking.attractionName);
  const qrCodes = booking.numberOfVisitors === 1 && paymentQr?.amount === booking.totalAmount
    ? paymentQr
    : undefined;
  const qrImage = selectedPaymentMethod ? qrCodes?.[selectedPaymentMethod] : undefined;
  const wallet = selectedPaymentMethod === "gcash" ? "GCash" : "Maya";

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const formatCurrency = (amount: number) =>
    `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !qrImage || processing || submitted) return;
    const normalizedReference = reference.trim().toUpperCase();
    if (!paymentReferencePattern.test(normalizedReference)) {
      setError("Enter the transaction reference from your wallet receipt.");
      return;
    }

    setError("");
    setProcessing(true);

    try {
      await onProcessPayment(booking, selectedPaymentMethod, normalizedReference);
      setSubmitted(true);
    } catch (err) {
      console.error("Payment initialization error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to initialize payment. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      onClick={() => {
        if (!processing) onClose();
      }}
    >
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all disabled:opacity-50"
          aria-label="Close payment"
        >
          <span className="text-2xl leading-none">×</span>
        </button>

        <div className="p-6 md:p-8">
          {/* HEADER */}
          <div className="pr-10 mb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">
              QR Checkout
            </p>

            <h2
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{
                fontFamily: "var(--font-montemaria-sans)",
              }}
            >
              Complete Your Payment
            </h2>

            <p className="text-gray-500 text-sm">
              Review your booking and choose your preferred
              payment method.
            </p>
          </div>

          {/* BOOKING INFORMATION */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                Booking
              </p>

              <h3 className="font-bold text-gray-900">
                {booking.attractionName}
              </h3>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">
                  Date
                </span>

                <span className="font-medium text-gray-900">
                  {booking.bookingDate}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">
                  Time
                </span>

                <span className="font-medium text-gray-900">
                  {booking.bookingTimeLabel}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">
                  Visitors
                </span>

                <span className="font-medium text-gray-900">
                  {booking.numberOfVisitors}
                </span>
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Select Payment Method
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* GCASH */}
              <button
                type="button"
                disabled={processing || submitted || !qrCodes}
                onClick={() => {
                  setSelectedPaymentMethod("gcash");
                  setReference("");
                  setError("");
                }}
                className={`rounded-2xl border-2 p-4 text-left transition-all disabled:opacity-60 ${
                  selectedPaymentMethod === "gcash"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
                  G
                </div>

                <p className="font-bold text-gray-900">
                  GCash
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Pay using your GCash wallet
                </p>
              </button>

              {/* MAYA */}
              <button
                type="button"
                disabled={processing || submitted || !qrCodes}
                onClick={() => {
                  setSelectedPaymentMethod("maya");
                  setReference("");
                  setError("");
                }}
                className={`rounded-2xl border-2 p-4 text-left transition-all disabled:opacity-60 ${
                  selectedPaymentMethod === "maya"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold mb-3">
                  M
                </div>

                <p className="font-bold text-gray-900">
                  Maya
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Pay using your Maya wallet
                </p>
              </button>
            </div>
          </div>

          {/* PAYMENT SUMMARY */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Payment Summary
            </h3>

            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-gray-500">
                {formatCurrency(booking.pricePerPerson)}
                {" × "}
                {booking.numberOfVisitors}
              </span>

              <span className="font-medium text-gray-900">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">
                Total
              </span>

              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5"
            >
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          {submitted ? (
            <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
              Payment reference submitted. Check My Bookings for the verification status and ticket code.
            </p>
          ) : qrImage ? (
            <form className="space-y-4" onSubmit={(event) => {
              event.preventDefault();
              void handlePayment();
            }}>
              <p className="text-sm text-gray-700">
                Scan the QR with {wallet}, pay {formatCurrency(booking.totalAmount)}, then enter the reference from your receipt.
              </p>
              <Image
                src={qrImage}
                alt={`${wallet} payment QR for ${booking.attractionName}`}
                width={320}
                height={320}
                unoptimized
                className="mx-auto h-auto max-w-full bg-white p-3"
              />
              <a href={qrImage} download className="block text-center text-sm font-semibold text-blue-700 underline">
                Download QR code
              </a>
              <label className="block text-sm font-semibold text-gray-900">
                Transaction reference
                <input
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  required
                  maxLength={40}
                  disabled={processing}
                  autoComplete="off"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2"
                />
              </label>
              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-xl bg-gray-900 py-4 font-semibold text-white disabled:opacity-50"
              >
                {processing ? "Submitting..." : "Submit for verification"}
              </button>
            </form>
          ) : !qrCodes ? (
            <p role="status" className="text-sm text-gray-700">
              {paymentQr && booking.numberOfVisitors > 1
                ? "This QR charges for one visitor. Please make a separate booking for each visitor."
                : "QR payment is unavailable for this booking."}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
