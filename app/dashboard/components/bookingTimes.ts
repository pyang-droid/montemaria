export function getHourlyBookingTimes(schedule: string) {
  const range = schedule.trim().match(
    /^(?:daily\s*,?\s*)?(\d{1,2}):([0-5]\d)\s*(AM|PM)?\s*[-\u2013\u2014]\s*(\d{1,2}):([0-5]\d)\s*(AM|PM)?$/i
  );
  if (!range) return [];

  const [, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod] = range;
  if (Boolean(openingPeriod) !== Boolean(closingPeriod)) return [];

  function toMinutes(hours: string, minutes: string, period?: string) {
    const hour = Number(hours);
    if (period && (hour < 1 || hour > 12)) return NaN;
    if (!period && hour > 23) return NaN;
    const hour24 = period ? hour % 12 + (period.toUpperCase() === "PM" ? 12 : 0) : hour;
    return hour24 * 60 + Number(minutes);
  }

  const opening = toMinutes(openingHour, openingMinute, openingPeriod);
  const closing = toMinutes(closingHour, closingMinute, closingPeriod);
  const slots = [];
  for (let start = opening; start < closing; start += 60) {
    const hour = Math.floor(start / 60);
    const minute = String(start % 60).padStart(2, "0");
    slots.push({
      time: `${String(hour).padStart(2, "0")}:${minute}`,
      label: `${hour % 12 || 12}:${minute} ${hour < 12 ? "AM" : "PM"}`,
    });
  }
  return slots;
}
