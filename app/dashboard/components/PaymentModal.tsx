
"use client";

import { useState } from "react";
import type { BookingDetails } from "./BookingModal";

export type PaymentMethod = "gcash" | "maya";

export interface VerifiedPaymentResult {
  bookingId: string;
  paymentId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: "paid";
}

interface PaymentModalProps {
  booking: BookingDetails;
  onClose: () => void;

  // This callback must create a real payment session
  // using a secure backend/payment gateway.
  onProcessPayment: (
    booking: BookingDetails,
    method: PaymentMethod
  ) => Promise<void>;
}

export default function PaymentModal({
  booking,
  onClose,
  onProcessPayment,
}: PaymentModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const formatCurrency = (amount: number) =>
    `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handlePayment = async () => {
    if (!selectedPaymentMethod || processing) return;

    setError("");
    setProcessing(true);

    try {
      // The parent page is responsible for connecting
      // to the payment gateway through a secure backend.
      await onProcessPayment(booking, selectedPaymentMethod);
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
              Secure Checkout
            </p>

            <h2
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{
                fontFamily: "'Playfair Display', serif",
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
                disabled={processing}
                onClick={() => {
                  setSelectedPaymentMethod("gcash");
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
                disabled={processing}
                onClick={() => {
                  setSelectedPaymentMethod("maya");
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

          {/* PAY BUTTON */}
          <button
            type="button"
            disabled={!selectedPaymentMethod || processing}
            onClick={handlePayment}
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {processing
              ? "Preparing Secure Checkout..."
              : selectedPaymentMethod
              ? `Proceed to Pay ${formatCurrency(
                  booking.totalAmount
                )}`
              : "Select a Payment Method"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-3 leading-5">
            Payment will be completed through a secure
            payment gateway. Your booking will only be
            confirmed after payment verification.
          </p>
        </div>
      </div>
    </div>
  );
}
