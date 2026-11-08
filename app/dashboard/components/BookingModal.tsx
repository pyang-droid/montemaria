
"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Attraction } from "./AttractionCard";

// ============================================
// TYPES
// ============================================

export interface BookingDetails {
  attractionId: number;
  attractionName: string;
  bookingDate: string;
  bookingTime: string;
  bookingTimeLabel: string;
  numberOfVisitors: number;
  pricePerPerson: number;
  totalAmount: number;
}

export interface DailyBookingActivity {
  bookedVisitors: number;
}

interface BookingModalProps {
  attraction: Attraction;
  onClose: () => void;
  onProceedToPayment: (booking: BookingDetails) => void;

  // Connect this to Firebase when the
  // booking database is ready.
  getDailyBookingActivity?: (
    date: string
  ) => Promise<DailyBookingActivity>;
}

// Advisory threshold only.
// This is NOT a booking limit.
const HIGH_BOOKING_THRESHOLD = 80;

// ============================================
// DATE HELPER
// ============================================

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0"
  );
  const day = String(date.getDate()).padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
}

function formatDate(dateString: string): string {
  if (!dateString) return "";

  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day
  ).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ============================================
// BOOKING MODAL
// ============================================

export default function BookingModal({
  attraction,
  onClose,
  onProceedToPayment,
  getDailyBookingActivity,
}: BookingModalProps) {
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [numberOfVisitors, setNumberOfVisitors] =
    useState(1);

  const [dailyActivity, setDailyActivity] =
    useState<DailyBookingActivity | null>(null);

  const [loadingActivity, setLoadingActivity] =
    useState(false);

  const [activityError, setActivityError] =
    useState("");

  const [advisoryChoice, setAdvisoryChoice] =
    useState<"continue" | "change" | null>(null);

  const [activityRequest, setActivityRequest] =
    useState(0);

  const today = getLocalDateString(new Date());

  const pricePerPerson = attraction.price ?? 0;

  const totalAmount =
    pricePerPerson * numberOfVisitors;

  // ============================================
  // FETCH DAILY BOOKING ACTIVITY
  // ============================================

  useEffect(() => {
    let cancelled = false;

    if (!bookingDate) {
      setDailyActivity(null);
      setLoadingActivity(false);
      setActivityError("");
      return;
    }

    if (!getDailyBookingActivity) {
      setDailyActivity(null);
      setLoadingActivity(false);
      setActivityError(
        "Daily booking activity is not yet connected to Firebase."
      );
      return;
    }

    const loadActivity = async () => {
      setLoadingActivity(true);
      setDailyActivity(null);
      setActivityError("");

      try {
        const result =
          await getDailyBookingActivity(bookingDate);

        if (cancelled) return;

        if (
          !Number.isFinite(result.bookedVisitors) ||
          result.bookedVisitors < 0
        ) {
          throw new Error(
            "Invalid booking activity data."
          );
        }

        setDailyActivity(result);
      } catch (error) {
        if (cancelled) return;

        setActivityError(
          error instanceof Error
            ? error.message
            : "Unable to load booking activity."
        );
      } finally {
        if (!cancelled) {
          setLoadingActivity(false);
        }
      }
    };

    void loadActivity();

    return () => {
      cancelled = true;
    };
  }, [
    bookingDate,
    getDailyBookingActivity,
    activityRequest,
  ]);

  // ============================================
  // BOOKING ADVISORY
  // ============================================

  const bookedVisitors =
    dailyActivity?.bookedVisitors ?? null;

  const isHighBookingActivity =
    bookedVisitors !== null &&
    bookedVisitors >= HIGH_BOOKING_THRESHOLD;

  // ============================================
  // SELECTED TIME SLOT
  // ============================================

  const selectedSlot = attraction.timeSlots.find(
    (slot) => slot.time === bookingTime
  );

  // ============================================
  // HANDLE DATE CHANGE
  // ============================================

  const handleDateChange = (date: string) => {
    setBookingDate(date);
    setBookingTime("");
    setAdvisoryChoice(null);
    setDailyActivity(null);
  };

  // ============================================
  // HANDLE SUBMIT
  // ============================================

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!bookingDate) {
      alert("Please select a booking date.");
      return;
    }

    if (bookingDate < today) {
      alert("Please select a valid future date.");
      return;
    }

    if (!selectedSlot) {
      alert("Please select your preferred time.");
      return;
    }

    if (
      !Number.isInteger(numberOfVisitors) ||
      numberOfVisitors < 1
    ) {
      alert("Please enter a valid number of visitors.");
      return;
    }

    if (
      isHighBookingActivity &&
      advisoryChoice !== "continue"
    ) {
      alert(
        "Please choose whether to continue with your selected date or change your booking date."
      );
      return;
    }

    onProceedToPayment({
      attractionId: attraction.id,
      attractionName: attraction.name,
      bookingDate,
      bookingTime: selectedSlot.time,
      bookingTimeLabel: selectedSlot.label,
      numberOfVisitors,
      pricePerPerson,
      totalAmount,
    });
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all"
          aria-label="Close booking"
        >
          <span className="text-2xl leading-none">
            ×
          </span>
        </button>

        <div className="p-6 md:p-8">

          {/* ====================================
              HEADER
          ==================================== */}
          <div className="pr-10 mb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">
              Attraction Booking
            </p>

            <h2
              id="booking-modal-title"
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{
                fontFamily:
                  "'Playfair Display', serif",
              }}
            >
              Book {attraction.name}
            </h2>

            <p className="text-gray-500 text-sm">
              Select your preferred date, review
              booking activity, and complete
              your reservation.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* ====================================
                BOOKING DATE
            ==================================== */}
            <div>
              <label
                htmlFor="booking-date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Booking Date
              </label>

              <input
                id="booking-date"
                type="date"
                value={bookingDate}
                min={today}
                onChange={(e) =>
                  handleDateChange(e.target.value)
                }
                required
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
              />
            </div>

            {/* ====================================
                DAILY BOOKING ACTIVITY
            ==================================== */}
            {bookingDate && (
              <section className="space-y-4">
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-1">
                      Daily Booking Activity
                    </p>

                    <h3
                      className="text-lg font-bold text-gray-900"
                      style={{
                        fontFamily:
                          "'Playfair Display', serif",
                      }}
                    >
                      {formatDate(bookingDate)}
                    </h3>
                  </div>

                  <div className="p-5">
                    {loadingActivity ? (
                      <p
                        className="text-sm text-gray-500"
                        role="status"
                      >
                        Loading booking activity...
                      </p>
                    ) : activityError ? (
                      <div className="space-y-3">
                        <p
                          className="text-sm text-amber-700"
                          role="status"
                        >
                          {activityError}
                        </p>

                        {getDailyBookingActivity && (
                          <button
                            type="button"
                            onClick={() =>
                              setActivityRequest(
                                (value) => value + 1
                              )
                            }
                            className="text-sm font-semibold text-gray-800 underline"
                          >
                            Try Again
                          </button>
                        )}
                      </div>
                    ) : bookedVisitors !== null ? (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-3xl font-bold text-gray-900">
                            {bookedVisitors.toLocaleString(
                              "en-PH"
                            )}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            Confirmed visitors booked
                            for this date
                          </p>
                        </div>

                        {isHighBookingActivity ? (
                          <span className="shrink-0 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-2">
                            High Activity
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-green-100 text-green-800 text-xs font-semibold px-3 py-2">
                            Normal Activity
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Booking information is
                        currently unavailable.
                      </p>
                    )}
                  </div>
                </div>

                {/* ====================================
                    BOOKING ADVISORY
                ==================================== */}
                {isHighBookingActivity && (
                  <div className="border border-amber-200 bg-amber-50 rounded-2xl p-5">
                    <div className="flex gap-3">
                      <span className="text-amber-700 text-xl">
                        !
                      </span>

                      <div className="flex-1">
                        <h4 className="font-bold text-amber-900 mb-2">
                          Booking Advisory
                        </h4>

                        <p className="text-sm text-amber-800 leading-6">
                          A high number of visitors
                          have already booked for{" "}
                          {formatDate(bookingDate)}.
                          You may continue with your
                          reservation or choose
                          another date for a
                          potentially less busy
                          experience.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <label className="flex items-center gap-3 text-sm text-gray-800 cursor-pointer">
                        <input
                          type="radio"
                          name="advisory-choice"
                          checked={
                            advisoryChoice ===
                            "continue"
                          }
                          onChange={() =>
                            setAdvisoryChoice(
                              "continue"
                            )
                          }
                          className="accent-gray-800"
                        />

                        Continue with selected date
                      </label>

                      <label className="flex items-center gap-3 text-sm text-gray-800 cursor-pointer">
                        <input
                          type="radio"
                          name="advisory-choice"
                          checked={
                            advisoryChoice ===
                            "change"
                          }
                          onChange={() =>
                            setAdvisoryChoice(
                              "change"
                            )
                          }
                          className="accent-gray-800"
                        />

                        Choose another date
                      </label>
                    </div>

                    {advisoryChoice === "change" && (
                      <div className="mt-4 rounded-xl bg-white border border-amber-200 p-4">
                        <p className="text-sm text-gray-700 mb-3">
                          Select another date above
                          to view its booking
                          activity.
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            handleDateChange("");
                            document
                              .getElementById(
                                "booking-date"
                              )
                              ?.focus();
                          }}
                          className="text-sm font-semibold text-gray-900 underline"
                        >
                          Change Booking Date
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* ====================================
                SELECT TIME
            ==================================== */}
            {bookingDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Time
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {attraction.timeSlots.map(
                    (slot) => {
                      const selected =
                        bookingTime === slot.time;

                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() =>
                            setBookingTime(
                              slot.time
                            )
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                            selected
                              ? "bg-gray-800 border-gray-800 text-white"
                              : "bg-white border-gray-200 text-gray-700 hover:border-gray-500"
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    }
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Select your preferred visit time.
                  Times shown are scheduling
                  options, not confirmed
                  availability.
                </p>
              </div>
            )}

            {/* ====================================
                NUMBER OF VISITORS
            ==================================== */}
            {bookingDate && (
              <div>
                <label
                  htmlFor="number-of-visitors"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Number of Visitors
                </label>

                <input
                  id="number-of-visitors"
                  type="number"
                  min={1}
                  step={1}
                  value={numberOfVisitors}
                  onChange={(e) =>
                    setNumberOfVisitors(
                      Number(e.target.value)
                    )
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
                />
              </div>
            )}

            {/* ====================================
                BOOKING SUMMARY
            ==================================== */}
            {bookingDate && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-gray-900 mb-4">
                  Booking Summary
                </h3>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">
                    Attraction
                  </span>

                  <span className="font-medium text-gray-900 text-right">
                    {attraction.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">
                    Date
                  </span>

                  <span className="font-medium text-gray-900 text-right">
                    {formatDate(bookingDate)}
                  </span>
                </div>

                {selectedSlot && (
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Time
                    </span>

                    <span className="font-medium text-gray-900">
                      {selectedSlot.label}
                    </span>
                  </div>
                )}

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">
                    Price per Person
                  </span>

                  <span className="font-medium text-gray-900">
                    ₱{pricePerPerson.toLocaleString(
                      "en-PH"
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">
                    Number of Visitors
                  </span>

                  <span className="font-medium text-gray-900">
                    {numberOfVisitors}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="font-bold text-gray-900">
                    Total Amount
                  </span>

                  <span className="text-xl font-bold text-gray-900">
                    ₱{totalAmount.toLocaleString(
                      "en-PH"
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* ====================================
                PROCEED TO PAYMENT
            ==================================== */}
            <button
              type="submit"
              disabled={
                !bookingDate ||
                !selectedSlot ||
                !Number.isInteger(
                  numberOfVisitors
                ) ||
                numberOfVisitors < 1 ||
                loadingActivity ||
                (
                  isHighBookingActivity &&
                  advisoryChoice !== "continue"
                )
              }
              className="w-full py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Proceed to Payment
            </button>

            <p className="text-center text-xs text-gray-400">
              Booking activity is provided
              for visitor guidance only.
              It does not impose a daily
              booking limit.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
