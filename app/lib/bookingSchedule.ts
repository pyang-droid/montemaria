export interface BookingTimeSlot {
  time: string;
  label: string;
}

export type BookingTimeIssue = "duration" | "schedule" | "no-slot";

export interface BookingTimeOptions {
  slots: BookingTimeSlot[];
  issue: BookingTimeIssue | null;
}

interface OperatingWindow {
  opensAt: number;
  closesAt: number;
}

function parseDurationMinutes(value: string): number | null {
  const durationPattern =
    /(\d+(?:\.\d+)?)\s*(hours?|hrs?|h|minutes?|mins?|m)\b/gi;
  const matches: RegExpExecArray[] = [];
  let match: RegExpExecArray | null;

  while ((match = durationPattern.exec(value)) !== null) {
    matches.push(match);
  }

  if (matches.length === 0) return null;

  let totalMinutes = 0;
  matches.forEach((duration, index) => {
    const quantity = Number(duration[1]);
    const unit = duration[2].toLowerCase();
    const minutes = quantity * (unit.startsWith("h") ? 60 : 1);

    if (!Number.isFinite(minutes) || minutes <= 0) return;

    if (index === 0) {
      totalMinutes = minutes;
      return;
    }

    const previous = matches[index - 1];
    const separator = value.slice(
      previous.index + previous[0].length,
      duration.index
    );

    if (/^\s*(?:-|–|—|to)\s*$/i.test(separator)) {
      totalMinutes = Math.max(totalMinutes, minutes);
    } else {
      totalMinutes += minutes;
    }
  });

  if (totalMinutes <= 0 || totalMinutes > 24 * 60) return null;
  return Math.ceil(totalMinutes);
}

function parseClockTime(
  hourValue: string,
  minuteValue: string | undefined,
  meridiemValue: string | undefined,
  inferredMeridiem?: string
): number | null {
  const hour = Number(hourValue);
  const minute = minuteValue ? Number(minuteValue) : 0;
  const meridiem = (meridiemValue ?? inferredMeridiem ?? "")
    .replace(/\./g, "")
    .toLowerCase();

  if (minute < 0 || minute > 59) return null;

  if (meridiem) {
    if ((meridiem !== "am" && meridiem !== "pm") || hour < 1 || hour > 12) {
      return null;
    }
    return (hour % 12) * 60 + minute + (meridiem === "pm" ? 12 * 60 : 0);
  }

  if (hour < 0 || hour > 23) return null;
  return hour * 60 + minute;
}

function parseOperatingWindows(schedule: string): OperatingWindow[] {
  const rangePattern =
    /(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?\s*(?:-|–|—|to|until)\s*(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?/gi;
  const windows: OperatingWindow[] = [];
  let match: RegExpExecArray | null;

  while ((match = rangePattern.exec(schedule)) !== null) {
    const startMeridiem = match[3];
    const endMeridiem = match[6];
    const hasMeridiem = Boolean(startMeridiem || endMeridiem);
    const opensAt = parseClockTime(
      match[1],
      match[2],
      startMeridiem,
      hasMeridiem ? endMeridiem : undefined
    );
    const closesAt = parseClockTime(
      match[4],
      match[5],
      endMeridiem,
      hasMeridiem ? startMeridiem : undefined
    );

    if (opensAt === null || closesAt === null || closesAt <= opensAt) {
      continue;
    }

    windows.push({ opensAt, closesAt });
  }

  return windows.sort((a, b) => a.opensAt - b.opensAt);
}

function formatTime(minutes: number): string {
  const normalizedMinutes = minutes % (24 * 60);
  const hour = Math.floor(normalizedMinutes / 60);
  const minute = normalizedMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function formatTimeLabel(minutes: number): string {
  const normalizedMinutes = minutes % (24 * 60);
  const hour = Math.floor(normalizedMinutes / 60);
  const minute = normalizedMinutes % 60;
  const meridiem = hour < 12 ? "AM" : "PM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${String(minute).padStart(2, "0")} ${meridiem}`;
}

export function generateBookingTimeOptions(
  schedule: string,
  duration: string
): BookingTimeOptions {
  const durationMinutes = parseDurationMinutes(duration);
  if (durationMinutes === null) {
    return { slots: [], issue: "duration" };
  }

  const windows = parseOperatingWindows(schedule);
  if (windows.length === 0) {
    return { slots: [], issue: "schedule" };
  }

  const slots = new Map<number, BookingTimeSlot>();
  for (const window of windows) {
    for (
      let start = window.opensAt;
      start + durationMinutes <= window.closesAt;
      start += durationMinutes
    ) {
      slots.set(start, {
        time: formatTime(start),
        label: `${formatTimeLabel(start)} – ${formatTimeLabel(start + durationMinutes)}`,
      });
    }
  }

  const options = [...slots.values()];
  return options.length > 0
    ? { slots: options, issue: null }
    : { slots: [], issue: "no-slot" };
}
