"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useLiveCollection } from "../lib/firestore";
import type { AttractionRecord, BookingRecord, VisitorLogRecord } from "../lib/models";

export type AttractionStatus =
  | "Available"
  | "Near Capacity"
  | "Full"
  | "Closed"
  | "Unavailable";

export interface AttractionInfo {
  id: string;
  name: string;
  location: string;
  type: "Paid" | "Free";
  currentVisitors: number | null;
  capacity: number | null;
  status: AttractionStatus;
  operatingHours: string;
  stationTerminal: string;
  description: string;
  rules: string[];
  queuePaused: boolean;
}

export type ScanMode = "ENTRY" | "EXIT";

export type VerificationStatus =
  | "VERIFIED_VALID"
  | "INVALID_CODE"
  | "ALREADY_SCANNED"
  | "WRONG_ATTRACTION"
  | "CAPACITY_FULL";

export interface TicketData {
  ticketId: string;
  bookingRef: string;
  visitorName: string;
  email: string;
  attractionName: string;
  passType: "Single Attraction" | "All-Access Pass" | "Pilgrim General Admission";
  paxCount: number;
  status: "active" | "used" | "expired" | "cancelled";
  issuedDate: string;
  validDate: string;
  paymentStatus: "Paid" | "Pending";
  visitStatus?: "outside" | "inside" | "exited";
}

export interface VerificationResult {
  status: VerificationStatus;
  message: string;
  ticket: TicketData | null;
  scanMode: ScanMode;
  timestamp: string;
}

export interface VisitorEntryExitLog {
  id: string;
  timestamp: string;
  visitorName: string;
  ticketId: string;
  attractionName: string;
  eventType: "ENTRY" | "EXIT" | "DENIED";
  pax: number;
  statusText: string;
  verifiedBy: string;
  reason?: string;
  dateKey?: string;
}

function recordTime(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate();
  }
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function localDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function statusFromCapacity(
  current: number | null,
  capacity: number | null,
  closed: boolean
): AttractionStatus {
  if (closed) return "Closed";
  if (current === null || capacity === null || capacity <= 0) return "Unavailable";
  if (current >= capacity) return "Full";
  if (capacity > 0 && current / capacity >= 0.75) return "Near Capacity";
  return "Available";
}

function toAttraction(record: AttractionRecord): AttractionInfo {
  const currentVisitors =
    typeof record.currentVisitors === "number" ? record.currentVisitors : null;
  const capacity = typeof record.capacity === "number" ? record.capacity : null;
  const extra = record as AttractionRecord & DocumentData;
  return {
    id: record.id,
    name: record.name ?? "",
    location: record.location ?? "—",
    type: record.type,
    currentVisitors,
    capacity,
    status: statusFromCapacity(currentVisitors, capacity, record.status === "Closed"),
    operatingHours: record.schedule ?? "—",
    stationTerminal:
      typeof extra.stationTerminal === "string" ? extra.stationTerminal : record.location ?? "—",
    description: record.description ?? "",
    rules: Array.isArray(extra.rules) ? extra.rules : [],
    queuePaused: extra.queuePaused === true,
  };
}

function toLog(record: VisitorLogRecord): VisitorEntryExitLog {
  const created = recordTime(record.createdAt);
  return {
    id: record.id,
    timestamp: created
      ? created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "—",
    visitorName: record.visitorName ?? "—",
    ticketId: record.ticketId ?? "—",
    attractionName: record.attractionName ?? "—",
    eventType: record.eventType,
    pax: record.pax,
    statusText:
      record.eventType === "DENIED"
        ? "Entry denied"
        : record.eventType === "ENTRY"
          ? "Visitor entry recorded"
          : "Visitor exit recorded",
    verifiedBy: record.verifiedBy ?? "—",
    reason: record.reason,
    dateKey: created ? localDate(created) : undefined,
  };
}

export function useStaffOperations(
  assignedAttractionName = "",
  staffName = ""
) {
  const { records: attractionRecords, loading: attractionsLoading, error: attractionsError } =
    useLiveCollection<AttractionRecord>("attractions");
  const attractions = useMemo(
    () => attractionRecords.map(toAttraction),
    [attractionRecords]
  );
  const [overrideStation, setOverrideStation] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>("ENTRY");
  const [lastVerification, setLastVerification] =
    useState<VerificationResult | null>(null);
  const [logsState, setLogsState] = useState<{
    attractionId: string;
    records: VisitorEntryExitLog[];
    loading: boolean;
    error: string | null;
  }>({ attractionId: "", records: [], loading: true, error: null });

  const activeAttractionName =
    overrideStation ??
    (assignedAttractionName === "All Attractions (Supervisor)"
      ? attractions[0]?.name ?? ""
      : assignedAttractionName);
  const currentAttraction =
    attractions.find((attraction) => attraction.name === activeAttractionName) ?? null;

  const currentAttractionId = currentAttraction?.id;

  useEffect(() => {
    if (!currentAttractionId) return;
    const logsQuery = query(
      collection(db, "visitorLogs"),
      where("attractionId", "==", currentAttractionId)
    );
    return onSnapshot(
      logsQuery,
      (snapshot) => {
        setLogsState({
          attractionId: currentAttractionId,
          records: snapshot.docs
            .map((item) =>
              toLog({ ...item.data(), id: item.id } as VisitorLogRecord)
            ),
          loading: false,
          error: null,
        });
      },
      (reason) => {
        console.error("Unable to subscribe to visitor logs:", reason);
        setLogsState({
          attractionId: currentAttractionId,
          records: [],
          loading: false,
          error: "Unable to load visitor activity. Check your access and try again.",
        });
      }
    );
  }, [currentAttractionId]);

  const logsAreCurrent =
    !!currentAttractionId && logsState.attractionId === currentAttractionId;
  const logs = logsAreCurrent ? logsState.records : [];
  const logsLoading = currentAttractionId
    ? !logsAreCurrent || logsState.loading
    : false;
  const logsError = logsAreCurrent ? logsState.error : null;

  const setActiveAttractionName = useCallback((name: string) => {
    setOverrideStation(name);
  }, []);

  const setIsQueuePaused = useCallback(
    (paused: boolean) => {
      if (!currentAttraction) return;
      void updateDoc(doc(db, "attractions", currentAttraction.id), {
        queuePaused: paused,
        updatedAt: serverTimestamp(),
      }).catch((error: unknown) => {
        console.error("Unable to update the queue state:", error);
        setLastVerification({
          status: "CAPACITY_FULL",
          message: "Unable to update the queue state. Check your access and try again.",
          ticket: null,
          scanMode,
          timestamp: new Date().toLocaleTimeString(),
        });
      });
    },
    [currentAttraction, scanMode]
  );

  const isQueuePaused = currentAttraction?.queuePaused ?? false;

  const addDeniedLog = useCallback(
    async (ticketId: string, reason: string, visitorName = "Unknown visitor") => {
      if (!currentAttraction) return;
      await addDoc(collection(db, "visitorLogs"), {
        ticketId,
        visitorName,
        attractionId: currentAttraction.id,
        attractionName: currentAttraction.name,
        eventType: "DENIED",
        pax: 1,
        verifiedBy: staffName || "—",
        reason,
        createdAt: serverTimestamp(),
      });
    },
    [currentAttraction, staffName]
  );

  const verifyAndProcessCode = useCallback(
    async (rawCode: string, overrideMode?: ScanMode): Promise<VerificationResult> => {
      const code = rawCode.trim().toUpperCase();
      const mode = overrideMode || scanMode;
      const timestamp = new Date().toLocaleTimeString();
      const fail = async (
        status: VerificationStatus,
        message: string,
        ticket: TicketData | null = null
      ) => {
        const result = { status, message, ticket, scanMode: mode, timestamp };
        setLastVerification(result);
        try {
          await addDeniedLog(code || "—", message, ticket?.visitorName);
        } catch (error) {
          console.error("Unable to record denied entry:", error);
          setLogsState((previous) => ({
            ...previous,
            attractionId: currentAttraction?.id ?? previous.attractionId,
            error: "The scan was denied, but its audit record could not be saved.",
          }));
        }
        return result;
      };

      if (!currentAttraction) {
        return fail("INVALID_CODE", "No attraction is assigned to this station.");
      }
      if (!code) {
        return fail("INVALID_CODE", "Enter or scan a ticket code.");
      }

      try {
        const ticketQuery = query(
          collection(db, "bookings"),
          where("ticketCode", "==", code),
          where("attractionId", "==", currentAttraction.id)
        );
        const result = await getDocs(ticketQuery);
        if (result.empty) {
          return fail("INVALID_CODE", "This ticket could not be verified for this attraction.");
        }

        const bookingDoc = result.docs[0];
        const booking = bookingDoc.data() as BookingRecord;
        const ticket: TicketData = {
          ticketId: code,
          bookingRef: bookingDoc.id,
          visitorName: booking.visitor ?? booking.email ?? "—",
          email: booking.email ?? "",
          attractionName: booking.attractionName ?? currentAttraction.name,
          passType: "Single Attraction",
          paxCount: booking.numberOfVisitors,
          status: booking.ticketStatus ?? "cancelled",
          issuedDate: recordTime(booking.createdAt)?.toLocaleDateString() ?? "—",
          validDate: booking.bookingDate ?? "",
          paymentStatus: booking.paymentStatus === "paid" ? "Paid" : "Pending",
          visitStatus: booking.visitStatus,
        };

        if (
          booking.status !== "confirmed" ||
          booking.paymentStatus !== "paid" ||
          ticket.status !== "active"
        ) {
          return fail("INVALID_CODE", "This booking is not confirmed and paid.", ticket);
        }
        if (booking.bookingDate && booking.bookingDate < localDate(new Date())) {
          return fail("INVALID_CODE", "This ticket has expired.", ticket);
        }
        if (
          booking.attractionId !== currentAttraction.id ||
          booking.attractionName?.toLowerCase() !== currentAttraction.name.toLowerCase()
        ) {
          return fail("WRONG_ATTRACTION", "This ticket is not valid for the selected attraction.", ticket);
        }
        if (
          currentAttraction.currentVisitors === null ||
          currentAttraction.capacity === null
        ) {
          return fail("CAPACITY_FULL", "Occupancy data is unavailable for this attraction.", ticket);
        }
        if (mode === "ENTRY") {
          if (isQueuePaused) {
            return fail("CAPACITY_FULL", "Entry is paused at this station.", ticket);
          }
          if (ticket.visitStatus === "inside" || ticket.visitStatus === "exited") {
            return fail("ALREADY_SCANNED", "This ticket has already been used for entry.", ticket);
          }
          if (currentAttraction.currentVisitors + ticket.paxCount > currentAttraction.capacity) {
            return fail("CAPACITY_FULL", "Admitting this group would exceed attraction capacity.", ticket);
          }
        } else if (ticket.visitStatus !== "inside") {
          return fail("ALREADY_SCANNED", "This ticket does not have an active entry to exit.", ticket);
        }

        const verification: VerificationResult = {
          status: "VERIFIED_VALID",
          message:
            mode === "ENTRY"
              ? `Verified for ${ticket.paxCount} visitor(s). Admission approved.`
              : `Exit scan confirmed for ${ticket.paxCount} visitor(s).`,
          ticket,
          scanMode: mode,
          timestamp,
        };
        setLastVerification(verification);
        return verification;
      } catch (error) {
        console.error("Unable to verify ticket:", error);
        return fail(
          "INVALID_CODE",
          "Ticket verification is unavailable. Check your connection and permissions."
        );
      }
    },
    [addDeniedLog, currentAttraction, isQueuePaused, scanMode]
  );

  const confirmAdmission = useCallback(
    async (verification: VerificationResult): Promise<boolean> => {
      if (!verification.ticket || !currentAttraction) return false;
      const ticket = verification.ticket;
      const bookingRef = doc(db, "bookings", ticket.bookingRef);
      const attractionRef = doc(db, "attractions", currentAttraction.id);
      const logRef = doc(collection(db, "visitorLogs"));

      try {
        await runTransaction(db, async (transaction) => {
          const [bookingSnapshot, attractionSnapshot] = await Promise.all([
            transaction.get(bookingRef),
            transaction.get(attractionRef),
          ]);
          if (!bookingSnapshot.exists() || !attractionSnapshot.exists()) {
            throw new Error("The booking or attraction no longer exists.");
          }
          const booking = bookingSnapshot.data();
          const attraction = attractionSnapshot.data();
          const currentVisitors = attraction.currentVisitors;
          const capacity = attraction.capacity;
          const pax = booking.numberOfVisitors;
          if (typeof currentVisitors !== "number" || typeof capacity !== "number") {
            throw new Error("Occupancy data is unavailable for this attraction.");
          }
          if (
            booking.paymentStatus !== "paid" ||
            booking.status !== "confirmed" ||
            booking.ticketStatus !== "active"
          ) {
            throw new Error("This ticket is no longer active.");
          }

          const isEntry = verification.scanMode === "ENTRY";
          if (isEntry) {
            if (booking.visitStatus === "inside" || booking.visitStatus === "exited") {
              throw new Error("This ticket has already been used.");
            }
            if (attraction.queuePaused === true) {
              throw new Error("Entry is paused at this station.");
            }
            if (currentVisitors + pax > capacity) {
              throw new Error("There is not enough remaining capacity.");
            }
          } else {
            if (booking.visitStatus !== "inside" || currentVisitors < pax) {
              throw new Error("This ticket does not have an active entry.");
            }
          }

          const eventType = isEntry ? "ENTRY" : "EXIT";
          transaction.update(bookingRef, {
            visitStatus: isEntry ? "inside" : "exited",
            updatedAt: serverTimestamp(),
          });
          transaction.update(attractionRef, {
            currentVisitors: currentVisitors + (isEntry ? pax : -pax),
            updatedAt: serverTimestamp(),
          });
          transaction.set(logRef, {
            bookingId: ticket.bookingRef,
            ticketId: ticket.ticketId,
            visitorName: ticket.visitorName,
            attractionId: currentAttraction.id,
            attractionName: currentAttraction.name,
            eventType,
            pax,
            verifiedBy: staffName || "—",
            createdAt: serverTimestamp(),
          });
        });
        setLastVerification(null);
        return true;
      } catch (error) {
        console.error("Unable to record visitor movement:", error);
        setLastVerification({
          status: "INVALID_CODE",
          message:
            error instanceof Error
              ? error.message
              : "Unable to record this visitor movement.",
          ticket,
          scanMode: verification.scanMode,
          timestamp: new Date().toLocaleTimeString(),
        });
        return false;
      }
    },
    [currentAttraction, staffName]
  );

  const manualAdjustCount = useCallback(
    async (delta: number, attractionId?: string) => {
      const target = attractions.find((attraction) => attraction.id === attractionId) ?? currentAttraction;
      if (!target || !Number.isInteger(delta) || delta === 0) return;
      const attractionRef = doc(db, "attractions", target.id);
      const logRef = doc(collection(db, "visitorLogs"));
      try {
        await runTransaction(db, async (transaction) => {
          const snapshot = await transaction.get(attractionRef);
          if (!snapshot.exists()) throw new Error("The attraction record no longer exists.");
          const attraction = snapshot.data();
          if (
            typeof attraction.currentVisitors !== "number" ||
            typeof attraction.capacity !== "number"
          ) {
            throw new Error("Occupancy data is unavailable for this attraction.");
          }
          const nextCount = attraction.currentVisitors + delta;
          if (nextCount < 0 || nextCount > attraction.capacity) {
            throw new Error("The headcount adjustment is outside the attraction capacity.");
          }
          transaction.update(attractionRef, {
            currentVisitors: nextCount,
            updatedAt: serverTimestamp(),
          });
          transaction.set(logRef, {
            ticketId: "MANUAL",
            visitorName: "Manual headcount adjustment",
            attractionId: target.id,
            attractionName: target.name,
            eventType: delta > 0 ? "ENTRY" : "EXIT",
            pax: Math.abs(delta),
            verifiedBy: staffName || "—",
            createdAt: serverTimestamp(),
          });
        });
      } catch (error) {
        console.error("Unable to adjust visitor count:", error);
        setLastVerification({
          status: "CAPACITY_FULL",
          message: error instanceof Error ? error.message : "Unable to adjust the visitor count.",
          ticket: null,
          scanMode,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    },
    [attractions, currentAttraction, scanMode, staffName]
  );

  const today = localDate(new Date());
  const totalEntriesToday = logs
    .filter((log) => log.eventType === "ENTRY" && log.dateKey === today)
    .reduce((sum, log) => sum + log.pax, 0);
  const totalExitsToday = logs
    .filter((log) => log.eventType === "EXIT" && log.dateKey === today)
    .reduce((sum, log) => sum + log.pax, 0);

  return {
    attractions,
    currentAttraction,
    activeAttractionName: currentAttraction?.name ?? "",
    setActiveAttractionName,
    scanMode,
    setScanMode,
    isQueuePaused,
    setIsQueuePaused,
    logs,
    logsLoading,
    logsError,
    attractionsLoading,
    attractionsError,
    lastVerification,
    setLastVerification,
    verifyAndProcessCode,
    confirmAdmission,
    manualAdjustCount,
    totalEntriesToday,
    totalExitsToday,
  };
}
