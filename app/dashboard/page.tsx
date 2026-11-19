
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

import { auth } from "../lib/firebase";
import { useLiveCollection } from "../lib/firestore";
import type { AttractionRecord } from "../lib/models";
import { getDailyBookingActivity } from "./components/bookingActivity";

// ============================================
// TYPES
// ============================================

type AttractionFilter = "all" | "paid" | "free";

// ============================================
// DASHBOARD PAGE
// ============================================

export default function DashboardPage() {
  const {
    records: attractionRecords,
    loading: attractionsLoading,
    error: attractionsError,
  } = useLiveCollection<AttractionRecord>("attractions");
  const attractions: Attraction[] = attractionRecords.map((record) => ({
    id: record.id,
    name: record.name ?? "",
    tagline: record.tagline,
    description: record.description ?? "",
    fullDescription: record.fullDescription,
    price: typeof record.entranceFee === "number" ? record.entranceFee : null,
    duration: record.duration,
    currentVisitors:
      typeof record.currentVisitors === "number" ? record.currentVisitors : null,
    maxCapacity: typeof record.capacity === "number" ? record.capacity : null,
    timeSlots: Array.isArray(record.timeSlots) ? record.timeSlots : [],
    img: record.img,
    badge: record.badge,
    type: record.type === "Paid" ? "paid" : "free",
    highlights: record.highlights,
  }));
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

    setPaymentError(
      "Secure access-code issuance is not configured. No ticket was created."
    );
  };

  // ==========================================
  // DAILY BOOKING ACTIVITY CALLBACK
  // ==========================================

  const handleGetDailyBookingActivity = useCallback(
    async (
      date: string
    ): Promise<DailyBookingActivity> => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error("Sign in to view your booking activity.");
      }
      return getDailyBookingActivity(date, userId);
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
                fontFamily: "var(--font-montemaria-sans)",
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
                fontFamily: "var(--font-montemaria-sans)",
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

          {attractionsLoading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
              Loading attractions…
            </div>
          ) : attractionsError ? (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center text-sm text-red-700">
              {attractionsError}
            </div>
          ) : filteredAttractions.length > 0 ? (
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
