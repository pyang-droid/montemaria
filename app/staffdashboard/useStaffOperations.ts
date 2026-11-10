"use client";

import { useState, useEffect } from "react";

export type AttractionStatus = "Available" | "Near Capacity" | "Full" | "Closed";

export interface AttractionInfo {
  id: number;
  name: string;
  location: string;
  type: "Paid" | "Free";
  currentVisitors: number;
  capacity: number;
  status: AttractionStatus;
  operatingHours: string;
  stationTerminal: string;
  description: string;
  rules: string[];
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
}

export const INITIAL_ATTRACTIONS: AttractionInfo[] = [
  {
    id: 1,
    name: "Mirage Walk",
    location: "East Wing Elevated Terrace",
    type: "Paid",
    currentVisitors: 8,
    capacity: 20,
    status: "Available",
    operatingHours: "08:00 AM - 05:00 PM",
    stationTerminal: "Gate 01 - East Gate",
    description: "Scenic skywalk overlooking Batangas Bay with optical glass floor reflections.",
    rules: ["Shoe covers required", "Maximum 20 persons at a time", "No running or food"],
  },
  {
    id: 2,
    name: "View Deck",
    location: "Upper Summit Promenade",
    type: "Paid",
    currentVisitors: 35,
    capacity: 50,
    status: "Near Capacity",
    operatingHours: "07:30 AM - 06:00 PM",
    stationTerminal: "Gate 02 - Summit North",
    description: "Panoramic 360-degree observation deck facing Verde Island Passage.",
    rules: ["Stay behind safety rails", "Children must be accompanied", "Stanchion lane strictly 1-way"],
  },
  {
    id: 3,
    name: "Glass Walk",
    location: "West Cliff Bridge",
    type: "Paid",
    currentVisitors: 15,
    capacity: 15,
    status: "Full",
    operatingHours: "08:30 AM - 05:00 PM",
    stationTerminal: "Gate 03 - West Bridge",
    description: "Suspended transparent glass walkway with sheer 100-meter drop view.",
    rules: ["Capacity locked at 15 pax", "No high heels allowed", "Hold onto handrails"],
  },
  {
    id: 4,
    name: "Mirror Walk",
    location: "Pilgrim Garden Path",
    type: "Paid",
    currentVisitors: 12,
    capacity: 25,
    status: "Available",
    operatingHours: "08:00 AM - 05:30 PM",
    stationTerminal: "Gate 04 - Garden Portal",
    description: "Illuminated mirror corridor reflecting spiritual murals and mountain flora.",
    rules: ["Photography allowed without flash", "Maintain solemn silence"],
  },
  {
    id: 5,
    name: "Gate of the Archangels",
    location: "Sanctuary Grand Entrance",
    type: "Free",
    currentVisitors: 42,
    capacity: 60,
    status: "Near Capacity",
    operatingHours: "06:00 AM - 07:00 PM",
    stationTerminal: "Gate 05 - Main Portal",
    description: "Monumental archway and statuary guarding the pilgrimage ascent.",
    rules: ["Open to all pilgrims", "Wheelchair accessible ramp available"],
  },
  {
    id: 6,
    name: "Sto. Niño Chapel",
    location: "Central Chapel Ground",
    type: "Free",
    currentVisitors: 28,
    capacity: 40,
    status: "Near Capacity",
    operatingHours: "06:00 AM - 07:00 PM",
    stationTerminal: "Gate 06 - Chapel Portal",
    description: "Sacred prayer and adoration chapel at the foot of the Mother of All Asia tower.",
    rules: ["Dress code strictly enforced", "Silence mobile devices", "Votive candle station outside"],
  },
];

export const SAMPLE_TICKET_DATABASE: Record<string, TicketData> = {
  "MM-2026-8812": {
    ticketId: "MM-2026-8812",
    bookingRef: "BK-90214",
    visitorName: "Gabriel Mendoza",
    email: "gabriel.m@example.com",
    attractionName: "Mirage Walk",
    passType: "Single Attraction",
    paxCount: 2,
    status: "active",
    issuedDate: "Nov 10, 2026",
    validDate: "Nov 10, 2026",
    paymentStatus: "Paid",
  },
  "MM-2026-4431": {
    ticketId: "MM-2026-4431",
    bookingRef: "BK-88412",
    visitorName: "Maria Clara Santos",
    email: "clara.santos@example.com",
    attractionName: "All Attractions (All-Access Pass)",
    passType: "All-Access Pass",
    paxCount: 4,
    status: "active",
    issuedDate: "Nov 10, 2026",
    validDate: "Nov 10, 2026",
    paymentStatus: "Paid",
  },
  "MM-2026-1190": {
    ticketId: "MM-2026-1190",
    bookingRef: "BK-76129",
    visitorName: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    attractionName: "View Deck",
    passType: "Single Attraction",
    paxCount: 1,
    status: "active",
    issuedDate: "Nov 10, 2026",
    validDate: "Nov 10, 2026",
    paymentStatus: "Paid",
  },
  "MM-2026-USED1": {
    ticketId: "MM-2026-USED1",
    bookingRef: "BK-55210",
    visitorName: "Antonio Luna",
    email: "antonio.l@example.com",
    attractionName: "Mirage Walk",
    passType: "Single Attraction",
    paxCount: 1,
    status: "used",
    issuedDate: "Nov 10, 2026",
    validDate: "Nov 10, 2026",
    paymentStatus: "Paid",
  },
  "MM-2026-EXPD9": {
    ticketId: "MM-2026-EXPD9",
    bookingRef: "BK-44102",
    visitorName: "Ricardo Dalisay",
    email: "carding@example.com",
    attractionName: "Mirage Walk",
    passType: "Single Attraction",
    paxCount: 1,
    status: "expired",
    issuedDate: "Nov 01, 2026",
    validDate: "Nov 01, 2026",
    paymentStatus: "Paid",
  },
  "MM-2026-WRONG": {
    ticketId: "MM-2026-WRONG",
    bookingRef: "BK-33901",
    visitorName: "Elena Bautista",
    email: "elena.b@example.com",
    attractionName: "Glass Walk",
    passType: "Single Attraction",
    paxCount: 3,
    status: "active",
    issuedDate: "Nov 10, 2026",
    validDate: "Nov 10, 2026",
    paymentStatus: "Paid",
  },
};

export const INITIAL_LOGS: VisitorEntryExitLog[] = [
  {
    id: "LOG-501",
    timestamp: "02:18 PM",
    visitorName: "Sofia Ramirez",
    ticketId: "MM-2026-4431",
    attractionName: "Mirage Walk",
    eventType: "ENTRY",
    pax: 2,
    statusText: "Admitted via QR Entry Scan",
    verifiedBy: "Mark Garcia (Gate 01)",
  },
  {
    id: "LOG-502",
    timestamp: "02:12 PM",
    visitorName: "Carlos Delgado",
    ticketId: "MM-2026-1190",
    attractionName: "Mirage Walk",
    eventType: "EXIT",
    pax: 1,
    statusText: "Exited attraction normally",
    verifiedBy: "Mark Garcia (Gate 01)",
  },
  {
    id: "LOG-503",
    timestamp: "02:05 PM",
    visitorName: "Unknown Visitor",
    ticketId: "MM-INVALID-99",
    attractionName: "Mirage Walk",
    eventType: "DENIED",
    pax: 1,
    statusText: "Denied entry",
    verifiedBy: "Mark Garcia (Gate 01)",
    reason: "Invalid QR Code - Ticket not found in records",
  },
  {
    id: "LOG-504",
    timestamp: "01:54 PM",
    visitorName: "Theresa Aquino",
    ticketId: "MM-2026-8812",
    attractionName: "Mirage Walk",
    eventType: "ENTRY",
    pax: 3,
    statusText: "Admitted via QR Entry Scan",
    verifiedBy: "Mark Garcia (Gate 01)",
  },
  {
    id: "LOG-505",
    timestamp: "01:40 PM",
    visitorName: "Manuel Quezon",
    ticketId: "MM-2026-3101",
    attractionName: "Mirage Walk",
    eventType: "EXIT",
    pax: 2,
    statusText: "Exited attraction normally",
    verifiedBy: "Mark Garcia (Gate 01)",
  },
];

export function useStaffOperations(assignedAttractionName: string = "Mirage Walk", staffName: string = "Staff Officer") {
  const [attractions, setAttractions] = useState<AttractionInfo[]>(INITIAL_ATTRACTIONS);
  const [overrideStation, setOverrideStation] = useState<string | null>(null);
  const activeAttractionName = overrideStation || (assignedAttractionName !== "All Attractions (Supervisor)" ? assignedAttractionName : "Mirage Walk");
  const setActiveAttractionName = (stationName: string) => setOverrideStation(stationName);

  const [scanMode, setScanMode] = useState<ScanMode>("ENTRY");
  const [isQueuePaused, setIsQueuePaused] = useState<boolean>(false);
  const [logs, setLogs] = useState<VisitorEntryExitLog[]>(INITIAL_LOGS);
  const [lastVerification, setLastVerification] = useState<VerificationResult | null>(null);

  const currentAttraction =
    attractions.find((a) => a.name === activeAttractionName) || attractions[0];

  // Helper to re-calculate status based on capacity
  const updateAttractionVisitorCount = (attractionName: string, delta: number) => {
    setAttractions((prev) =>
      prev.map((attraction) => {
        if (attraction.name !== attractionName) return attraction;
        const newCount = Math.max(0, attraction.currentVisitors + delta);
        const ratio = newCount / attraction.capacity;
        let newStatus: AttractionStatus = "Available";
        if (ratio >= 1.0) newStatus = "Full";
        else if (ratio >= 0.75) newStatus = "Near Capacity";
        return {
          ...attraction,
          currentVisitors: newCount,
          status: newStatus,
        };
      })
    );
  };

  // Process a QR code or Manual Ticket Code
  const verifyAndProcessCode = (rawCode: string, overrideMode?: ScanMode): VerificationResult => {
    const code = rawCode.trim().toUpperCase();
    const mode = overrideMode || scanMode;
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // 1. Look up in sample database
    const ticket = SAMPLE_TICKET_DATABASE[code] || null;

    if (!ticket) {
      const result: VerificationResult = {
        status: "INVALID_CODE",
        message: `Ticket code "${code}" could not be verified in D1 User Account Records.`,
        ticket: null,
        scanMode: mode,
        timestamp: timeNow,
      };
      setLastVerification(result);

      // Log denial
      setLogs((prev) => [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          timestamp: timeNow,
          visitorName: "Unregistered Guest",
          ticketId: code,
          attractionName: currentAttraction.name,
          eventType: "DENIED",
          pax: 1,
          statusText: "Invalid ticket scan",
          verifiedBy: staffName,
          reason: "Code not found in registration database",
        },
        ...prev,
      ]);
      return result;
    }

    // 2. Check for expired or canceled status
    if (ticket.status === "expired") {
      const result: VerificationResult = {
        status: "INVALID_CODE",
        message: `This ticket expired on ${ticket.validDate}. Access denied.`,
        ticket,
        scanMode: mode,
        timestamp: timeNow,
      };
      setLastVerification(result);
      setLogs((prev) => [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          timestamp: timeNow,
          visitorName: ticket.visitorName,
          ticketId: ticket.ticketId,
          attractionName: currentAttraction.name,
          eventType: "DENIED",
          pax: ticket.paxCount,
          statusText: "Denied entry",
          verifiedBy: staffName,
          reason: "Ticket pass expired",
        },
        ...prev,
      ]);
      return result;
    }

    // 3. Check for attraction mismatch (unless it's All-Access Pass)
    const isAllAccess = ticket.passType === "All-Access Pass" || ticket.attractionName.includes("All");
    const isAttractionMatch = isAllAccess || ticket.attractionName.toLowerCase() === currentAttraction.name.toLowerCase();

    if (!isAttractionMatch) {
      const result: VerificationResult = {
        status: "WRONG_ATTRACTION",
        message: `Ticket is for "${ticket.attractionName}", but current station is "${currentAttraction.name}".`,
        ticket,
        scanMode: mode,
        timestamp: timeNow,
      };
      setLastVerification(result);
      setLogs((prev) => [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          timestamp: timeNow,
          visitorName: ticket.visitorName,
          ticketId: ticket.ticketId,
          attractionName: currentAttraction.name,
          eventType: "DENIED",
          pax: ticket.paxCount,
          statusText: "Attraction mismatch",
          verifiedBy: staffName,
          reason: `Ticket valid for ${ticket.attractionName} only`,
        },
        ...prev,
      ]);
      return result;
    }

    // 4. Check already scanned or capacity if ENTRY mode
    if (mode === "ENTRY") {
      if (isQueuePaused) {
        const result: VerificationResult = {
          status: "CAPACITY_FULL",
          message: `Station queue is temporarily paused for crowd safety regulation.`,
          ticket,
          scanMode: mode,
          timestamp: timeNow,
        };
        setLastVerification(result);
        return result;
      }

      if (currentAttraction.currentVisitors + ticket.paxCount > currentAttraction.capacity) {
        const result: VerificationResult = {
          status: "CAPACITY_FULL",
          message: `Admitting ${ticket.paxCount} visitors would exceed maximum attraction capacity (${currentAttraction.capacity}). Please queue momentarily.`,
          ticket,
          scanMode: mode,
          timestamp: timeNow,
        };
        setLastVerification(result);
        return result;
      }

      if (ticket.status === "used") {
        const result: VerificationResult = {
          status: "ALREADY_SCANNED",
          message: `Ticket ${ticket.ticketId} has already been marked as used. Check previous entry logs.`,
          ticket,
          scanMode: mode,
          timestamp: timeNow,
        };
        setLastVerification(result);
        return result;
      }

      // Valid entry!
      const result: VerificationResult = {
        status: "VERIFIED_VALID",
        message: `Verified valid for ${ticket.paxCount} visitor(s). Admission approved.`,
        ticket,
        scanMode: mode,
        timestamp: timeNow,
      };
      setLastVerification(result);
      return result;
    } else {
      // EXIT mode
      const result: VerificationResult = {
        status: "VERIFIED_VALID",
        message: `Exit scan confirmed for ${ticket.paxCount} visitor(s). Thank you for visiting.`,
        ticket,
        scanMode: mode,
        timestamp: timeNow,
      };
      setLastVerification(result);
      return result;
    }
  };

  // Commit the admission or exit after verification
  const confirmAdmission = (verification: VerificationResult) => {
    if (!verification.ticket) return;

    const pax = verification.ticket.paxCount;
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (verification.scanMode === "ENTRY") {
      updateAttractionVisitorCount(currentAttraction.name, pax);
      setLogs((prev) => [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          timestamp: timeNow,
          visitorName: verification.ticket!.visitorName,
          ticketId: verification.ticket!.ticketId,
          attractionName: currentAttraction.name,
          eventType: "ENTRY",
          pax: pax,
          statusText: `Admitted ${pax} guest(s)`,
          verifiedBy: staffName,
        },
        ...prev,
      ]);
    } else {
      updateAttractionVisitorCount(currentAttraction.name, -pax);
      setLogs((prev) => [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          timestamp: timeNow,
          visitorName: verification.ticket!.visitorName,
          ticketId: verification.ticket!.ticketId,
          attractionName: currentAttraction.name,
          eventType: "EXIT",
          pax: pax,
          statusText: `Checked out ${pax} guest(s)`,
          verifiedBy: staffName,
        },
        ...prev,
      ]);
    }

    setLastVerification(null);
  };

  const manualAdjustCount = (delta: number) => {
    updateAttractionVisitorCount(currentAttraction.name, delta);
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setLogs((prev) => [
      {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: timeNow,
        visitorName: "Manual Adjustment",
        ticketId: "MANUAL",
        attractionName: currentAttraction.name,
        eventType: delta > 0 ? "ENTRY" : "EXIT",
        pax: Math.abs(delta),
        statusText: `Manual headcount ${delta > 0 ? "+1" : "-1"}`,
        verifiedBy: staffName,
      },
      ...prev,
    ]);
  };

  const totalEntriesToday = logs.filter((l) => l.eventType === "ENTRY").reduce((s, l) => s + l.pax, 0);
  const totalExitsToday = logs.filter((l) => l.eventType === "EXIT").reduce((s, l) => s + l.pax, 0);

  return {
    attractions,
    currentAttraction,
    activeAttractionName,
    setActiveAttractionName,
    scanMode,
    setScanMode,
    isQueuePaused,
    setIsQueuePaused,
    logs,
    lastVerification,
    setLastVerification,
    verifyAndProcessCode,
    confirmAdmission,
    manualAdjustCount,
    totalEntriesToday,
    totalExitsToday,
  };
}

