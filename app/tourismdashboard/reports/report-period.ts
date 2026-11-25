export type ReportPeriod = "Daily" | "Weekly" | "Monthly";

const manilaDate = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Manila",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function dateKey(date: Date) {
  return manilaDate.format(date);
}

export function addDays(key: string, days: number) {
  const date = new Date(`${key}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function manilaMidnight(key: string) {
  return new Date(`${key}T00:00:00+08:00`);
}

export function reportRange(period: ReportPeriod, key: string) {
  if (period === "Monthly") {
    const start = `${key.slice(0, 7)}-01`;
    const end = addDays(start, 32).slice(0, 7) + "-01";
    const previous = addDays(start, -1).slice(0, 7) + "-01";
    return { start, end, previous };
  }

  const day = new Date(`${key}T00:00:00Z`).getUTCDay();
  const start = period === "Weekly" ? addDays(key, -((day + 6) % 7)) : key;
  return { start, end: addDays(start, period === "Weekly" ? 7 : 1), previous: start };
}
