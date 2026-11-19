
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Attraction } from "./AttractionCard";
import { generateBookingTimeOptions } from "../../lib/bookingSchedule";

// ============================================
// TYPES
// ============================================

export interface BookingDetails {
  attractionId: string;
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
  getDailyBookingActivity?: (
    date: string
  ) => Promise<DailyBookingActivity>;
}

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

  const [activityRequest, setActivityRequest] =
    useState(0);

  const today = getLocalDateString(new Date());

  const pricePerPerson = attraction.price;
  const { slots: availableTimeSlots, issue: timeSlotIssue } = useMemo(
    () => generateBookingTimeOptions(attraction.schedule, attraction.duration ?? ""),
    [attraction.schedule, attraction.duration]
  );

  const totalAmount = pricePerPerson === null
    ? null
    : pricePerPerson * numberOfVisitors;

  // ============================================
  // FETCH DAILY BOOKING ACTIVITY
  // ============================================

  useEffect(() => {
    let cancelled = false;

    if (!bookingDate || !getDailyBookingActivity) return;

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
    bookingDate && getDailyBookingActivity
      ? dailyActivity?.bookedVisitors ?? null
      : null;
  const visibleActivityError =
    bookingDate && !getDailyBookingActivity
      ? "Daily booking activity is unavailable."
      : activityError;

  // ============================================
  // SELECTED TIME SLOT
  // ============================================

  const selectedSlot = availableTimeSlots.find(
    (slot) => slot.time === bookingTime
  );

  // ============================================
  // HANDLE DATE CHANGE
  // ============================================

  const handleDateChange = (date: string) => {
    setBookingDate(date);
    setBookingTime("");
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

    if (pricePerPerson === null || totalAmount === null) {
      alert("The attraction price is not available. Please contact the tourism office.");
      return;
    }

    if (
      !Number.isInteger(numberOfVisitors) ||
      numberOfVisitors < 1
    ) {
      alert("Please enter a valid number of visitors.");
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
                fontFamily: "var(--font-montemaria-sans)",
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
                        fontFamily: "var(--font-montemaria-sans)",
                      }}
                    >
                      {formatDate(bookingDate)}
                    </h3>
                  </div>

                  <div className="p-5">
                    {loadingActivity && getDailyBookingActivity ? (
                      <p
                        className="text-sm text-gray-500"
                        role="status"
                      >
                        Loading booking activity...
                      </p>
                    ) : visibleActivityError ? (
                      <div className="space-y-3">
                        <p
                          className="text-sm text-amber-700"
                          role="status"
                        >
                          {visibleActivityError}
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
                            Visitors in your confirmed bookings for this date
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Booking information is
                        currently unavailable.
                      </p>
                    )}
                  </div>
                </div>

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

                {availableTimeSlots.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {availableTimeSlots.map((slot) => {
                        const selected = bookingTime === slot.time;

                        return (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setBookingTime(slot.time)}
                            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                              selected
                                ? "bg-gray-800 border-gray-800 text-white"
                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-500"
                            }`}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Times are generated from the estimated duration and operating
                      schedule. Each visit must finish before closing.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-amber-700" role="status">
                    {timeSlotIssue === "duration"
                      ? "Booking times are unavailable until an administrator enters a valid estimated duration."
                      : timeSlotIssue === "schedule"
                        ? "Booking times are unavailable until an administrator enters valid operating hours."
                        : "The estimated duration is longer than the available operating hours."}
                  </p>
                )}
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
                    {pricePerPerson === null ? "Unavailable" : `₱${pricePerPerson.toLocaleString("en-PH")}`}
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
                    {totalAmount === null ? "—" : `₱${totalAmount.toLocaleString("en-PH")}`}
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
                pricePerPerson === null ||
                !Number.isInteger(
                  numberOfVisitors
                ) ||
                numberOfVisitors < 1 ||
                loadingActivity ||
                !!visibleActivityError
              }
              className="w-full py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Proceed to Payment
            </button>

            <p className="text-center text-xs text-gray-400">
              Booking activity is for guidance only. It does not guarantee
              availability for a selected time.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
