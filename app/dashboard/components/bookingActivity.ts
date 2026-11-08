import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  DailyBookingActivity,
} from "./BookingModal";

export async function getDailyBookingActivity(
  date: string
): Promise<DailyBookingActivity> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid booking date.");
  }

  const bookingsRef = collection(db, "bookings");

  const bookingsQuery = query(
    bookingsRef,
    where("bookingDate", "==", date),
    where("status", "==", "confirmed")
  );

  const snapshot = await getDocs(bookingsQuery);

  let bookedVisitors = 0;

  snapshot.forEach((document) => {
    const booking = document.data();

    const numberOfVisitors =
      booking.numberOfVisitors;

    if (
      typeof numberOfVisitors === "number" &&
      Number.isInteger(numberOfVisitors) &&
      numberOfVisitors > 0
    ) {
      bookedVisitors += numberOfVisitors;
    }
  });

  return {
    bookedVisitors,
  };
}
