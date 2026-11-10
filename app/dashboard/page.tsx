
"use client";

import { useCallback, useState } from "react";

import DashboardNav from "./DashboardNav";

import AttractionCard, {
  type Attraction,
} from "./components/AttractionCard";

import AttractionDetailsModal from "./components/AttractionDetailsModal";

import BookingModal, {
  type BookingDetails,
  type DailyBookingActivity,
} from "./components/BookingModal";

import PaymentModal, {
  type PaymentMethod,
} from "./components/PaymentModal";

import { attractions } from "./components/attractions";

// ============================================
// TYPES
// ============================================

type AttractionFilter = "all" | "paid" | "free";

// ============================================
// TEMPORARY BOOKING DATA
// FRONTEND DEMONSTRATION ONLY
// ============================================

// These numbers represent sample confirmed
// visitors across the whole Montemaria site.
//
// They are NOT actual Firebase records.
//
// Replace this data source with Firebase
// when backend development begins.

const MOCK_DAILY_BOOKINGS: Record<string, number> = {
  "2026-11-15": 85,
  "2026-11-16": 42,
  "2026-11-17": 110,
  "2026-11-18": 65,
  "2026-11-19": 95,
  "2026-11-20": 38,
  "2026-11-21": 120,
  "2026-11-22": 75,
  "2026-11-23": 48,
  "2026-11-24": 105,
};

// ============================================
// MOCK DAILY BOOKING ACTIVITY
// ============================================

async function getMockDailyBookingActivity(
  date: string
): Promise<DailyBookingActivity> {
  // Small delay to simulate loading from backend.
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 350);
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid booking date.");
  }

  // Return sample data only for configured dates.
  // An unconfigured date is NOT assumed to have
  // zero real bookings.

  if (
    !Object.prototype.hasOwnProperty.call(
      MOCK_DAILY_BOOKINGS,
      date
    )
  ) {
    throw new Error(
      "No sample booking activity is configured for this date."
    );
  }

  return {
    bookedVisitors: MOCK_DAILY_BOOKINGS[date],
  };
}

// ============================================
// DASHBOARD PAGE
// ============================================

export default function DashboardPage() {
  // ==========================================
  // STATES
  // ==========================================

  const [filter, setFilter] =
    useState<AttractionFilter>("all");

  const [selectedAttraction, setSelectedAttraction] =
    useState<Attraction | null>(null);

  const [showBookingModal, setShowBookingModal] =
    useState(false);

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [currentBooking, setCurrentBooking] =
    useState<BookingDetails | null>(null);

  const [paymentError, setPaymentError] =
    useState<string | null>(null);

  const [generatedCode, setGeneratedCode] =
    useState<string | null>(null);

  // ==========================================
  // FILTER ATTRACTIONS
  // ==========================================

  const filteredAttractions = attractions.filter(
    (attraction) => {
      if (filter === "all") {
        return true;
      }

      return attraction.type === filter;
    }
  );

  // ==========================================
  // OPEN ATTRACTION DETAILS
  // ==========================================

  const handleViewDetails = (
    attraction: Attraction
  ) => {
    setSelectedAttraction(attraction);

    setShowBookingModal(false);
    setShowPaymentModal(false);

    setCurrentBooking(null);
    setPaymentError(null);
    setGeneratedCode(null);
  };

  // ==========================================
  // CLOSE ATTRACTION DETAILS
  // ==========================================

  const handleCloseDetails = () => {
    setSelectedAttraction(null);

    setShowBookingModal(false);
    setShowPaymentModal(false);

    setCurrentBooking(null);
    setPaymentError(null);
    setGeneratedCode(null);
  };

  // ==========================================
  // OPEN BOOKING MODAL
  // ==========================================

  const handleBookNow = () => {
    if (!selectedAttraction) {
      return;
    }

    if (selectedAttraction.type !== "paid") {
      return;
    }

    setCurrentBooking(null);
    setPaymentError(null);

    setShowBookingModal(true);
    setShowPaymentModal(false);
  };

  // ==========================================
  // CLOSE BOOKING MODAL
  // ==========================================

  const handleCloseBooking = () => {
    setShowBookingModal(false);
  };

  // ==========================================
  // PROCEED TO PAYMENT
  // ==========================================

  const handleProceedToPayment = (
    booking: BookingDetails
  ) => {
    if (!selectedAttraction) {
      return;
    }

    if (
      booking.attractionId !== selectedAttraction.id
    ) {
      return;
    }

    setCurrentBooking(booking);

    setPaymentError(null);

    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  // ==========================================
  // CLOSE PAYMENT MODAL
  // ==========================================

  const handleClosePayment = () => {
    setShowPaymentModal(false);
    setPaymentError(null);
  };

  // ==========================================
  // PROCESS PAYMENT
  // FRONTEND ONLY
  // ==========================================

  const handleProcessPayment = async (
    booking: BookingDetails,
    method: PaymentMethod
  ): Promise<void> => {
    if (!booking || !method) {
      throw new Error(
        "Please complete your booking and select a payment method."
      );
    }

    const message =
      "Payment processing is not yet available. " +
      "GCash and Maya integration will be added " +
      "during backend development.";

    setPaymentError(message);
    throw new Error(message);
  };

  // ==========================================
  // FREE ATTRACTION ACCESS
  // ==========================================

  const handleGenerateCode = () => {
    // A valid access code must be issued
    // by the backend and associated with
    // an actual visitor or booking record.
    //
    // Do not create a fake valid QR ticket.

    setGeneratedCode(null);

    alert(
      "Access code generation will be available " +
      "after the backend is connected."
    );
  };

  // ==========================================
  // DAILY BOOKING ACTIVITY CALLBACK
  // ==========================================

  const handleGetDailyBookingActivity = useCallback(
    async (
      date: string
    ): Promise<DailyBookingActivity> => {
      return getMockDailyBookingActivity(date);
    },
    []
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      {/* ======================================
          DASHBOARD NAVIGATION
      ====================================== */}

      <DashboardNav />

      {/* ======================================
          MAIN DASHBOARD
      ====================================== */}

      <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* ==================================
              HEADER
          ================================== */}

          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-gray-900 mb-3"
              style={{
                fontFamily:
                  "'Playfair Display', serif",
              }}
            >
              Monte Maria{" "}
              <span className="text-brand-red italic">
                Attractions
              </span>
            </h1>

            <p
              className="text-gray-600 text-lg"
              style={{
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Explore our sacred sites and
              unforgettable experiences
            </p>
          </div>

          {/* ==================================
              FILTER BUTTONS
          ================================== */}

          <div className="flex flex-wrap gap-3 mb-8">

            {/* ALL ATTRACTIONS */}

            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-500"
              }`}
            >
              All Attractions
            </button>

            {/* PAID ATTRACTIONS */}

            <button
              type="button"
              onClick={() => setFilter("paid")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === "paid"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-500"
              }`}
            >
              Paid Attractions
            </button>

            {/* FREE ATTRACTIONS */}

            <button
              type="button"
              onClick={() => setFilter("free")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === "free"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-500"
              }`}
            >
              Free Attractions
            </button>
          </div>

          {/* ==================================
              ATTRACTION CARDS
          ================================== */}

          {filteredAttractions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {filteredAttractions.map(
                (attraction) => (
                  <AttractionCard
                    key={attraction.id}
                    attraction={attraction}
                    onClick={() =>
                      handleViewDetails(
                        attraction
                      )
                    }
                  />
                )
              )}

            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No Attractions Found
              </h2>

              <p className="text-sm text-gray-500">
                There are currently no
                attractions in this category.
              </p>
            </div>
          )}

          {/* ==================================
              FOOTER NOTE
          ================================== */}

          <div className="mt-12 text-center">
            <p className="text-xs text-gray-400">
              Discover the beauty, faith,
              and unforgettable experiences
              of Monte Maria.
            </p>
          </div>

        </div>
      </main>

      {/* ======================================
          ATTRACTION DETAILS MODAL
      ====================================== */}

      {selectedAttraction &&
        !showBookingModal &&
        !showPaymentModal && (
          <AttractionDetailsModal
            attraction={selectedAttraction}
            onClose={handleCloseDetails}
            onBookNow={handleBookNow}
            onGenerateCode={
              selectedAttraction.type === "free"
                ? handleGenerateCode
                : undefined
            }
            generatedCode={generatedCode}
          />
        )}

      {/* ======================================
          BOOKING MODAL
      ====================================== */}

      {selectedAttraction &&
        showBookingModal &&
        !showPaymentModal && (
          <BookingModal
            attraction={selectedAttraction}
            onClose={handleCloseBooking}
            onProceedToPayment={
              handleProceedToPayment
            }
            getDailyBookingActivity={
              handleGetDailyBookingActivity
            }
          />
        )}

      {/* ======================================
          PAYMENT MODAL
      ====================================== */}

      {currentBooking &&
        showPaymentModal && (
          <PaymentModal
            booking={currentBooking}
            onClose={handleClosePayment}
            onProcessPayment={
              handleProcessPayment
            }
          />
        )}

      {/* ======================================
          PAYMENT ERROR NOTICE
      ====================================== */}

      {paymentError &&
        !showPaymentModal && (
          <div
            className="fixed bottom-5 right-5 z-[70] max-w-sm rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-lg"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <p className="flex-1 text-sm text-amber-900">
                {paymentError}
              </p>

              <button
                type="button"
                onClick={() =>
                  setPaymentError(null)
                }
                className="text-amber-800 hover:text-amber-950"
                aria-label="Dismiss notice"
              >
                ×
              </button>
            </div>
          </div>
        )}
    </>
  );
}
