import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import type { BookingRecord } from "../../lib/models";
import { paymentReferencePattern } from "../../lib/qrPayment";

export async function verifyQrPayment(bookingId: string) {
  const verifier = auth.currentUser;
  if (!verifier) throw new Error("Sign in to verify this payment.");

  const bookingRef = doc(db, "bookings", bookingId);
  const ticketCode = crypto.randomUUID().toUpperCase();

  await runTransaction(db, async (transaction) => {
    const booking = (await transaction.get(bookingRef)).data() as BookingRecord | undefined;
    if (!booking || booking.status !== "pending" || booking.paymentStatus !== "pending") {
      throw new Error("This booking is no longer awaiting verification.");
    }

    const { paymentMethod, transactionReference } = booking;
    if ((paymentMethod !== "gcash" && paymentMethod !== "maya") ||
        !transactionReference || !paymentReferencePattern.test(transactionReference)) {
      throw new Error("This booking has no valid QR payment reference.");
    }

    const paymentRef = doc(db, "payments", `${paymentMethod}-${transactionReference}`);
    if ((await transaction.get(paymentRef)).exists()) {
      throw new Error("This wallet reference has already been verified.");
    }

    transaction.set(paymentRef, {
      bookingId,
      userId: booking.userId,
      amount: booking.amount,
      status: "paid",
      paymentMethod,
      transactionReference,
      verifiedBy: verifier.uid,
      createdAt: serverTimestamp(),
    });
    transaction.update(bookingRef, {
      status: "confirmed",
      paymentStatus: "paid",
      ticketCode,
      ticketStatus: "active",
      updatedAt: serverTimestamp(),
    });
  });
}
