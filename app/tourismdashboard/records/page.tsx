"use client";

import { useMemo, useState } from "react";
import AdminNav from "../AdminNav";

type VerificationStatus = "Verified" | "Invalid";
type VisitStatus = "Inside" | "Exited";

interface VisitorRecord {
  id: string;
  visitor: string;
  attraction: string;
  qrCode: string;
  verification: VerificationStatus;
  entryTime: string;
  exitTime: string | null;
  visitStatus: VisitStatus;
}

const visitorRecords: VisitorRecord[] = [
  {
    id: "VIS-1001",
    visitor: "Juan Dela Cruz",
    attraction: "Mirage Walk",
    qrCode: "MM-ABC123-5678",
    verification: "Verified",
    entryTime: "9:15 AM",
    exitTime: "10:05 AM",
    visitStatus: "Exited",
  },
  {
    id: "VIS-1002",
    visitor: "Maria Santos",
    attraction: "View Deck",
    qrCode: "MM-DEF456-9012",
    verification: "Verified",
    entryTime: "10:20 AM",
    exitTime: null,
    visitStatus: "Inside",
  },
  {
    id: "VIS-1003",
    visitor: "Carlo Reyes",
    attraction: "Glass Walk",
    qrCode: "MM-GHI789-3456",
    verification: "Verified",
    entryTime: "10:45 AM",
    exitTime: null,
    visitStatus: "Inside",
  },
  {
    id: "VIS-1004",
    visitor: "Angela Cruz",
    attraction: "Mirage Walk",
    qrCode: "MM-JKL321-7890",
    verification: "Verified",
    entryTime: "8:40 AM",
    exitTime: "9:35 AM",
    visitStatus: "Exited",
  },
  {
    id: "VIS-1005",
    visitor: "Paolo Garcia",
    attraction: "Glass Walk",
    qrCode: "MM-INVALID-1023",
    verification: "Invalid",
    entryTime: "-",
    exitTime: null,
    visitStatus: "Exited",
  },
];

export default function VisitorRecordsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredRecords = useMemo(() => {
    return visitorRecords.filter((record) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        record.id.toLowerCase().includes(searchValue) ||
        record.visitor.toLowerCase().includes(searchValue) ||
        record.attraction.toLowerCase().includes(searchValue) ||
        record.qrCode.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || record.visitStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const insideCount = visitorRecords.filter(
    (record) =>
      record.visitStatus === "Inside" &&
      record.verification === "Verified"
  ).length;

  const exitedCount = visitorRecords.filter(
    (record) =>
      record.visitStatus === "Exited" &&
      record.verification === "Verified"
  ).length;

  const verifiedCount = visitorRecords.filter(
    (record) => record.verification === "Verified"
  ).length;

  const invalidCount = visitorRecords.filter(
    (record) => record.verification === "Invalid"
  ).length;

  return (
    <>
      <AdminNav />

      <main className="min-h-screen bg-[#f7f7f8] px-6 pb-16 pt-[112px] lg:px-8">
        <div className="mx-auto max-w-[1400px]">

          {/* HEADER */}
          <div className="mb-8 border-b border-gray-200 pb-7">
            <p
              className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c1122f]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Visitor Access Records
            </p>

            <h1
              className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Visitor Records
            </h1>

            <p
              className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 md:text-base"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              View QR code verification results and visitor entry and exit
              records for monitored attractions.
            </p>
          </div>

          {/* SUMMARY CARDS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Currently Inside
              </p>

              <p
                className="mt-3 text-3xl font-bold text-green-600"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {insideCount}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Visitors currently inside
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Exited
              </p>

              <p
                className="mt-3 text-3xl font-bold text-gray-900"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {exitedCount}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Completed visits
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Verified QR
              </p>

              <p
                className="mt-3 text-3xl font-bold text-gray-900"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {verifiedCount}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Successful verifications
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Invalid QR
              </p>

              <p
                className="mt-3 text-3xl font-bold text-red-600"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {invalidCount}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Failed verifications
              </p>
            </div>
          </div>

          {/* RECORD TABLE */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* TABLE HEADER */}
            <div className="flex flex-col gap-5 border-b border-gray-100 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2
                  className="text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Entry and Exit Records
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Recorded visitor access based on QR code verification.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* SEARCH */}
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search visitor or QR code..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#c1122f] sm:w-[260px]"
                />

                {/* STATUS FILTER */}
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#c1122f]"
                >
                  <option value="All">All Visitors</option>
                  <option value="Inside">Inside</option>
                  <option value="Exited">Exited</option>
                </select>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Record ID
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Visitor
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Attraction
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      QR Code
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Verification
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Entry
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Exit
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Visit Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-5 text-sm font-semibold text-gray-500">
                        {record.id}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                        {record.visitor}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {record.attraction}
                      </td>

                      <td className="px-6 py-5 font-mono text-xs text-gray-500">
                        {record.qrCode}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            record.verification === "Verified"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {record.verification}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {record.entryTime}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {record.exitTime ?? "Still inside"}
                      </td>

                      <td className="px-6 py-5">
                        {record.verification === "Invalid" ? (
                          <span className="text-xs font-medium text-gray-400">
                            No Entry
                          </span>
                        ) : (
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              record.visitStatus === "Inside"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {record.visitStatus}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* NO RESULTS */}
            {filteredRecords.length === 0 && (
              <div className="px-6 py-16 text-center">
                <p
                  className="text-lg font-bold text-gray-800"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  No visitor records found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing the search term or visitor status.
                </p>
              </div>
            )}

            {/* TABLE FOOTER */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <p className="text-xs text-gray-400">
                Showing {filteredRecords.length} of {visitorRecords.length}{" "}
                visitor records
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}