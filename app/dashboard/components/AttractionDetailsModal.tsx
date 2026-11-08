
"use client";

import type { Attraction } from "./AttractionCard";

interface AttractionDetailsModalProps {
  attraction: Attraction;
  onClose: () => void;
  onBookNow: () => void;
  onGenerateCode?: () => void;
  generatedCode?: string | null;
}

export default function AttractionDetailsModal({
  attraction,
  onClose,
  onBookNow,
  onGenerateCode,
  generatedCode,
}: AttractionDetailsModalProps) {
  const isPaid = attraction.type === "paid";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="attraction-details-title"
      >
        {/* ============================================
            ATTRACTION IMAGE
        ============================================ */}
        <div className="relative w-full h-[280px] md:h-[340px] overflow-hidden">
          <img
            src={attraction.img}
            alt={attraction.name}
            className="absolute inset-0 block w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />

          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white shadow-lg text-gray-500 hover:text-gray-900 hover:scale-105 flex items-center justify-center transition-all"
            aria-label="Close attraction details"
          >
            <span className="text-2xl leading-none">
              ×
            </span>
          </button>

          {/* ATTRACTION TITLE */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-gray-800/90 text-white text-xs px-3 py-1.5 rounded-full">
                {attraction.badge}
              </span>

              <span
                className={`text-white text-xs px-3 py-1.5 rounded-full ${
                  isPaid
                    ? "bg-orange-500"
                    : "bg-green-600"
                }`}
              >
                {isPaid
                  ? `₱${attraction.price}`
                  : "FREE"}
              </span>
            </div>

            <h2
              id="attraction-details-title"
              className="text-3xl md:text-4xl font-bold text-white"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {attraction.name}
            </h2>

            <p
              className="text-white/85 text-sm mt-2"
              style={{
                fontFamily: "'Lato', sans-serif",
              }}
            >
              {attraction.tagline}
            </p>
          </div>
        </div>

        {/* ============================================
            MODAL CONTENT
        ============================================ */}
        <div className="p-6 md:p-8">

          {/* ABOUT THIS ATTRACTION */}
          <section className="mb-7">
            <h3
              className="text-xl font-bold text-gray-900 mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              About This Attraction
            </h3>

            <p
              className="text-gray-600 text-sm leading-7"
              style={{
                fontFamily: "'Lato', sans-serif",
              }}
            >
              {attraction.fullDescription}
            </p>
          </section>

          {/* ============================================
              HIGHLIGHTS
          ============================================ */}
          <section className="mb-8">
            <h3
              className="text-xl font-bold text-gray-900 mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Highlights
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              {attraction.highlights.map(
                (highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <span className="w-2 h-2 rounded-full bg-gray-700 flex-shrink-0" />

                    <span>{highlight}</span>
                  </div>
                )
              )}
            </div>
          </section>

          {/* ============================================
              ESTIMATED DURATION
          ============================================ */}
          <section className="mb-8">
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                Estimated Duration
              </span>

              <span className="text-sm font-semibold text-gray-900 text-right">
                {attraction.duration}
              </span>
            </div>
          </section>

          {/* ============================================
              ACCESS CODE (BACKEND-VERIFIED ONLY)
          ============================================ */}
          {generatedCode && (
            <section className="bg-green-50 border border-green-300 rounded-2xl p-6 mb-6">
              <h3
                className="text-lg font-bold text-green-900 mb-2"
                style={{
                  fontFamily:
                    "'Playfair Display', serif",
                }}
              >
                Your Access Code
              </h3>

              <p className="text-green-700 text-sm mb-3">
                Present your valid access code
                when entering the attraction.
              </p>

              <div className="bg-white rounded-xl p-4 border border-green-200">
                <p
                  className="text-2xl md:text-3xl font-bold text-center text-gray-700 tracking-wider break-all"
                  style={{
                    fontFamily:
                      "'Courier New', monospace",
                  }}
                >
                  {generatedCode}
                </p>
              </div>
            </section>
          )}

          {/* ============================================
              MAIN ACTION BUTTON
          ============================================ */}
          {!generatedCode && (
            <>
              {isPaid ? (
                <button
                  type="button"
                  onClick={onBookNow}
                  className="w-full py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all"
                >
                  Book Now • ₱{attraction.price}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-green-800 font-semibold text-sm">
                      Free Attraction
                    </p>

                    <p className="text-green-700 text-xs mt-1">
                      No payment is required to visit
                      this attraction.
                    </p>
                  </div>

                  {onGenerateCode && (
                    <button
                      type="button"
                      onClick={onGenerateCode}
                      className="w-full py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all"
                    >
                      Request Access Code
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
