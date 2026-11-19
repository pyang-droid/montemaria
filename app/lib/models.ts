import type { DocumentData } from "firebase/firestore";

export interface AttractionRecord extends DocumentData {
  id: string;
  name: string;
  type: "Paid" | "Free";
  capacity: number;
  currentVisitors: number;
  schedule: string;
  status: "Open" | "Closed";
  description: string;
  entranceFee: number | null;
  location?: string;
  tagline?: string;
  fullDescription?: string;
  duration?: string;
  img?: string;
  badge?: string;
  highlights?: string[];
  timeSlots?: { time: string; label: string }[];
}

export interface BookingRecord extends DocumentData {
  id: string;
  userId: string;
  visitor: string;
  email: string;
  attractionId: string;
  attractionName: string;
  bookingDate: string;
  bookingTime: string;
  numberOfVisitors: number;
  amount: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: string;
  transactionReference?: string;
  ticketCode?: string;
  ticketStatus?: "active" | "used" | "expired" | "cancelled";
  visitStatus?: "outside" | "inside" | "exited";
  createdAt?: unknown;
}

export interface PaymentRecord extends DocumentData {
  id: string;
  bookingId?: string;
  userId: string;
  status?: string;
  paymentStatus?: string;
  amount?: number;
  transactionReference?: string;
  paymentMethod?: string;
  createdAt?: unknown;
}

export interface VisitorLogRecord extends DocumentData {
  id: string;
  bookingId?: string;
  ticketId: string;
  visitorName: string;
  attractionId: string;
  attractionName: string;
  eventType: "ENTRY" | "EXIT" | "DENIED";
  pax: number;
  verifiedBy: string;
  reason?: string;
  createdAt?: unknown;
}

export interface UserRecord extends DocumentData {
  id: string;
  email: string;
  role: "visitor" | "staff" | "tourism" | "admin";
  status?: "Active" | "Inactive";
  firstName?: string;
  lastName?: string;
  username?: string;
  mobileNumber?: string;
  photoURL?: string;
  createdAt?: unknown;
}

export interface StaffAssignmentRecord extends DocumentData {
  id: string;
  userId: string;
  attractionId: string;
  attractionName: string;
  active: boolean;
  assignedAt?: unknown;
  shift?: string;
}
