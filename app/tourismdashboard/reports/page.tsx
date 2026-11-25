"use client";

import { useEffect, useState, type ReactNode } from "react";
import { collection, documentId, getDocsFromServer, query, where, type DocumentData } from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { AttractionAccessRequestRecord, BookingRecord, PaymentRecord, VisitorLogRecord } from "../../lib/models";
import AdminNav from "../AdminNav";
import { addDays, dateKey, manilaMidnight, reportRange, type ReportPeriod } from "./report-period";

const pesos = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });
const dates = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" });
const periods: ReportPeriod[] = ["Daily", "Weekly", "Monthly"];

async function readRange<T>(name: string, field: string, start: string, end: string) {
  const snapshot = await getDocsFromServer(query(
    collection(db, name),
    where(field, ">=", manilaMidnight(start)),
    where(field, "<", manilaMidnight(end)),
  ));
  return snapshot.docs.map((record) => record.data() as T);
}

function groupTotals<T>(records: T[], identify: (record: T) => [string, string], value: (record: T) => number) {
  const totals = new Map<string, { id: string; name: string; total: number }>();
  for (const record of records) {
    const [id, name] = identify(record);
    totals.set(id, { id, name, total: (totals.get(id)?.total ?? 0) + value(record) });
  }
  return [...totals.values()].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
}

function recordDate(record: DocumentData) {
  return dateKey(record.createdAt.toDate());
}

async function loadReport(start: string, end: string, previous: string) {
  const [payments, logs, requests] = await Promise.all([
    readRange<PaymentRecord>("payments", "createdAt", previous, end),
    readRange<VisitorLogRecord>("visitorLogs", "createdAt", start, end),
    readRange<AttractionAccessRequestRecord>("attractionAccessRequests", "reviewedAt", start, end),
  ]);
  const verified = payments.flatMap((payment) =>
    (payment.status ?? payment.paymentStatus) === "paid" &&
    typeof payment.amount === "number" && Number.isFinite(payment.amount)
      ? [{ ...payment, date: recordDate(payment), cents: Math.round(payment.amount * 100) }]
      : [],
  );
  const current = verified.filter((payment) => payment.date >= start);
  const bookingIds = [...new Set(current.flatMap(({ bookingId }) => bookingId ? [bookingId] : []))];
  const bookingQueries = [];
  for (let offset = 0; offset < bookingIds.length; offset += 30) {
    bookingQueries.push(getDocsFromServer(query(
      collection(db, "bookings"),
      where(documentId(), "in", bookingIds.slice(offset, offset + 30)),
    )));
  }
  const bookings = new Map((await Promise.all(bookingQueries)).flatMap((snapshot) =>
    snapshot.docs.map((booking) => [booking.id, booking.data() as BookingRecord] as const),
  ));
  const amount = (payment: (typeof current)[number]) => payment.cents;
  const entries = logs.filter((log) => log.eventType === "ENTRY" && Number.isInteger(log.pax) && log.pax > 0);
  const approved = requests.filter((request) => request.status === "approved" && request.requestType === "free_access");

  return {
    income: current.reduce((sum, payment) => sum + payment.cents, 0),
    previousIncome: verified.reduce((sum, payment) => sum + (payment.date < start ? payment.cents : 0), 0),
    days: groupTotals(current, (payment) => [payment.date, payment.date], amount),
    methods: groupTotals(current, ({ paymentMethod }) => {
      if (paymentMethod === "gcash") return ["gcash", "GCash"];
      if (paymentMethod === "maya") return ["maya", "Maya"];
      return ["other", "Other or unspecified"];
    }, amount),
    earnings: groupTotals(current, ({ bookingId }) => {
      const booking = bookingId ? bookings.get(bookingId) : undefined;
      return booking?.attractionId
        ? [booking.attractionId, booking.attractionName || "Unnamed attraction"]
        : ["unattributed", "Unattributed payments"];
    }, amount),
    popularity: groupTotals(entries, (log) => [log.attractionId, log.attractionName], (log) => log.pax)
      .map((row) => {
        const busiest = groupTotals(
          entries.filter((log) => log.attractionId === row.id),
          (log) => {
            const day = recordDate(log);
            return [day, day];
          },
          (log) => log.pax,
        )[0];
        return { ...row, busiest: dates.format(manilaMidnight(busiest.id)) };
      }),
    freeAccess: groupTotals(approved, (request) => [request.attractionId, request.attractionName], () => 1),
  };
}

function ReportTable({ title, headers, rows, empty }: {
  title: string;
  headers: string[];
  rows: { id: string; cells: ReactNode[] }[];
  empty: string;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {rows.length ? (
        <div className="mt-3 overflow-x-auto">
          <table aria-label={title} className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-600">
              <tr>{headers.map((header) => <th key={header} scope="col" className="px-2 py-2">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {rows.map(({ id, cells }) => (
                <tr key={id}>{cells.map((cell, index) => <td key={headers[index]} className="px-2 py-2">{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="mt-3 text-sm text-gray-600">{empty}</p>}
    </section>
  );
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("Daily");
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
  const [attempt, setAttempt] = useState(0);
  const { start, end, previous } = reportRange(period, selectedDate);
  const key = [start, end, previous, attempt].join("/");
  const [result, setResult] = useState<{ key: string; data: Awaited<ReturnType<typeof loadReport>> | null }>();

  useEffect(() => {
    let active = true;
    void loadReport(start, end, previous).then(
      (data) => { if (active) setResult({ key, data }); },
      (error: unknown) => {
        if (!active) return;
        console.error("Could not load reports:", error);
        setResult({ key, data: null });
      },
    );
    return () => { active = false; };
  }, [key, start, end, previous]);

  const report = result?.key === key ? result.data : undefined;
  const lastDay = addDays(end, -1);
  const rangeLabel = start === lastDay
    ? dates.format(manilaMidnight(start))
    : [start, lastDay].map((day) => dates.format(manilaMidnight(day))).join(" – ");
  const money = (cents: number) => pesos.format(cents / 100);
  const today = dateKey(new Date());

  return (
    <>
      <AdminNav />
      <main className="min-h-screen bg-[#f7f7f8] px-5 pb-16 pt-28 sm:px-6 lg:ml-[280px] lg:px-8 lg:pt-12">
        <div className="mx-auto max-w-6xl space-y-5">
          <header>
            <h1 className="text-3xl font-bold text-[#344054]">Income and Attraction Popularity</h1>
            <p className="mt-2 text-gray-600">Income uses payment verification dates. Popularity counts recorded admissions. All dates use Philippine time.</p>
          </header>
          <div className="flex flex-wrap items-end gap-4">
            <label className="grid gap-1 text-sm font-semibold text-gray-700">
              Reporting period
              <select className="rounded-lg border border-gray-300 bg-white px-3 py-2" value={period} onChange={(event) => setPeriod(event.target.value as ReportPeriod)}>
                {periods.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold text-gray-700">
              Date within period
              <input type="date" className="rounded-lg border border-gray-300 bg-white px-3 py-2" value={selectedDate} min="1900-01-01" max={today}
                onChange={(event) => { if (event.target.validity.valid && event.target.value) setSelectedDate(event.target.value); }} />
            </label>
            <p className="pb-2 text-sm text-gray-600">{rangeLabel}</p>
          </div>
          {report === undefined && <p role="status">Loading report…</p>}
          {report === null && (
            <div role="alert" className="rounded-xl border border-red-200 bg-white p-4 text-red-800">
              <p>Could not load the report.</p>
              <button type="button" className="mt-2 font-semibold underline" onClick={() => setAttempt((value) => value + 1)}>Try again</button>
            </div>
          )}
          {report && (
            <>
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="font-semibold text-gray-700">{period} verified income</h2>
                <p className="mt-1 text-3xl font-bold text-[#c1122f]">{money(report.income)}</p>
                {period === "Monthly" && <p className="mt-2 text-sm text-gray-600">Previous calendar month ({dates.format(manilaMidnight(previous))} to {dates.format(manilaMidnight(addDays(start, -1)))}) collected {money(report.previousIncome)}.</p>}
              </section>
              <div className="grid items-start gap-5 xl:grid-cols-2">
                <ReportTable title="Most popular attractions" headers={["Rank", "Attraction", "Admissions", "Busiest day"]}
                  rows={report.popularity.map(({ id, name, total, busiest }, index) => ({ id, cells: [index + 1, name, total.toLocaleString("en-PH"), busiest] }))}
                  empty="No admissions were recorded for this period." />
                <ReportTable title="Income by attraction" headers={["Attraction", "Verified income"]}
                  rows={report.earnings.map(({ id, name, total }) => ({ id, cells: [name, money(total)] }))}
                  empty="No verified payments for this period." />
                <ReportTable title="Income by payment method" headers={["Method", "Verified income"]}
                  rows={report.methods.map(({ id, name, total }) => ({ id, cells: [name, money(total)] }))}
                  empty="No verified payments for this period." />
                <ReportTable title="Approved free-access requests" headers={["Attraction", "Approved requests"]}
                  rows={report.freeAccess.map(({ id, name, total }) => ({ id, cells: [name, total] }))}
                  empty="No free-access requests were approved for this period." />
                {period !== "Daily" && (
                  <ReportTable title="Income by day" headers={["Date", "Verified income"]}
                    rows={Array.from({ length: Math.round((manilaMidnight(end).getTime() - manilaMidnight(start).getTime()) / 86_400_000) }, (_, index) => {
                      const day = addDays(start, index);
                      const total = report.days.find(({ id }) => id === day)?.total ?? 0;
                      return { id: day, cells: [dates.format(manilaMidnight(day)), day > today ? "Upcoming" : money(total)] };
                    })}
                    empty="No days in this period." />
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
