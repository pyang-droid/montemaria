
"use client";

import { useMemo, useState } from "react";
import AdminNav from "../AdminNav";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Users,
  MapPin,
} from "lucide-react";

type StaffStatus = "Assigned" | "Unassigned";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  attraction: string | null;
  assignmentDate: string | null;
}

const attractions = [
  "Mirage Walk",
  "View Deck",
  "Glass Walk",
  "Mirror Walk",
];

const initialStaff: StaffMember[] = [
  {
    id: "STF-1001",
    name: "Mark Anthony Reyes",
    email: "mark.reyes@example.com",
    attraction: "Mirage Walk",
    assignmentDate: "2026-09-25",
  },
  {
    id: "STF-1002",
    name: "Jessica Mendoza",
    email: "jessica.mendoza@example.com",
    attraction: "View Deck",
    assignmentDate: "2026-09-26",
  },
  {
    id: "STF-1003",
    name: "Daniel Cruz",
    email: "daniel.cruz@example.com",
    attraction: "Glass Walk",
    assignmentDate: "2026-09-27",
  },
  {
    id: "STF-1004",
    name: "Angela Santos",
    email: "angela.santos@example.com",
    attraction: null,
    assignmentDate: null,
  },
  {
    id: "STF-1005",
    name: "Paolo Garcia",
    email: "paolo.garcia@example.com",
    attraction: null,
    assignmentDate: null,
  },
];

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-PH",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

export default function StaffAssignmentsPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [attractionFilter, setAttractionFilter] = useState("All");

  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedAttraction, setSelectedAttraction] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<StaffMember | null>(
    null
  );

  const selectedStaff = staff.find(
    (member) => member.id === selectedStaffId
  );

  const assignedCount = staff.filter(
    (member) => member.attraction !== null
  ).length;

  const unassignedCount = staff.length - assignedCount;

  const coveredAttractions = new Set(
    staff
      .map((member) => member.attraction)
      .filter((attraction): attraction is string => attraction !== null)
  ).size;

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const query = search.trim().toLowerCase();
      const status: StaffStatus = member.attraction
        ? "Assigned"
        : "Unassigned";

      const matchesSearch =
        member.id.toLowerCase().includes(query) ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        (member.attraction ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || statusFilter === status;

      const matchesAttraction =
        attractionFilter === "All" ||
        member.attraction === attractionFilter;

      return matchesSearch && matchesStatus && matchesAttraction;
    });
  }, [staff, search, statusFilter, attractionFilter]);

  const summaryCards = [
    {
      label: "Total Staff",
      value: staff.length,
      description: "Registered staff members",
    },
    {
      label: "Assigned Staff",
      value: assignedCount,
      description: "Staff with active assignments",
    },
    {
      label: "Unassigned Staff",
      value: unassignedCount,
      description: "Staff awaiting assignment",
    },
    {
      label: "Attractions with Staff",
      value: coveredAttractions,
      description: "Attractions with assigned personnel",
    },
  ];

  function openAssignModal(member?: StaffMember) {
    setSelectedStaffId(member?.id ?? "");
    setSelectedAttraction(member?.attraction ?? "");
    setModalOpen(true);
  }

  function saveAssignment() {
    if (!selectedStaffId || !selectedAttraction) return;

    const today = new Date().toISOString().slice(0, 10);

    setStaff((previous) =>
      previous.map((member) =>
        member.id === selectedStaffId
          ? {
              ...member,
              attraction: selectedAttraction,
              assignmentDate:
                member.attraction === selectedAttraction
                  ? member.assignmentDate ?? today
                  : today,
            }
          : member
      )
    );

    setModalOpen(false);
    setSelectedStaffId("");
    setSelectedAttraction("");
  }

  function removeAssignment() {
    if (!removeTarget) return;

    setStaff((previous) =>
      previous.map((member) =>
        member.id === removeTarget.id
          ? {
              ...member,
              attraction: null,
              assignmentDate: null,
            }
          : member
      )
    );

    setRemoveTarget(null);
  }

  return (
    <>
      <AdminNav />

      <main className="min-h-screen bg-[#f7f7f8] px-5 pb-16 pt-28 sm:px-6 lg:ml-[280px] lg:px-8 lg:pt-12">
        <div className="mx-auto max-w-[1400px]">
          {/* HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-5 border-b border-gray-200 pb-7 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c1122f]">
                Tourism Administration
              </p>

              <h1
                className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                Staff Assignments
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 md:text-base">
                Assign and manage staff members responsible for
                monitoring tourist attractions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openAssignModal()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c1122f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9e0e26]"
            >
              <Plus size={18} />
              Assign Staff
            </button>
          </div>

          {/* PREVIEW NOTICE */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-500">
            Preview data only. Assignment changes are temporary
            and will reset when the page is refreshed.
          </div>

          {/* SUMMARY CARDS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {card.label}
                </p>

                <p
                  className="mt-3 text-3xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {card.value}
                </p>

                <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* STAFF RECORDS */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 border-b border-gray-100 p-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2
                  className="text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Staff Assignment Records
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  View assigned personnel and manage attraction assignments.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search staff..."
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#c1122f] sm:w-[220px]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#c1122f]"
                >
                  <option value="All">All Status</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Unassigned">Unassigned</option>
                </select>

                <select
                  value={attractionFilter}
                  onChange={(event) => setAttractionFilter(event.target.value)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#c1122f]"
                >
                  <option value="All">All Attractions</option>
                  {attractions.map((attraction) => (
                    <option key={attraction} value={attraction}>
                      {attraction}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {[
                      "Staff ID",
                      "Staff Member",
                      "Assigned Attraction",
                      "Assignment Date",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredStaff.map((member) => (
                    <tr
                      key={member.id}
                      className="transition hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-5 text-sm font-semibold text-gray-500">
                        {member.id}
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-semibold text-gray-900">
                          {member.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {member.email}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-600">
                        {member.attraction ? (
                          <span className="inline-flex items-center gap-2">
                            <MapPin size={15} className="text-gray-400" />
                            {member.attraction}
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            Not assigned
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-600">
                        {formatDate(member.assignmentDate)}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            member.attraction
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {member.attraction ? "Assigned" : "Unassigned"}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => openAssignModal(member)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c1122f] hover:underline"
                          >
                            {member.attraction ? (
                              <>
                                <Pencil size={15} />
                                Reassign
                              </>
                            ) : (
                              <>
                                <Plus size={15} />
                                Assign
                              </>
                            )}
                          </button>

                          {member.attraction && (
                            <button
                              type="button"
                              onClick={() => setRemoveTarget(member)}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                              Remove
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStaff.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Users size={30} className="mx-auto text-gray-300" />
                <p className="mt-4 text-lg font-bold text-gray-800">
                  No staff members found
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}

            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <p className="text-xs text-gray-400">
                Showing {filteredStaff.length} of {staff.length} staff
                members
              </p>
            </div>
          </section>

          <p className="mt-8 text-center text-xs text-gray-400">
            Montemaria Express · Tourism Administration
          </p>
        </div>
      </main>

      {/* ASSIGN / REASSIGN MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="assignment-dialog-title"
            className="w-full max-w-[500px] rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#c1122f]">
                  Staff Management
                </p>
                <h2
                  id="assignment-dialog-title"
                  className="mt-1 text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {selectedStaff?.attraction
                    ? "Reassign Staff"
                    : "Assign Staff"}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="staff-member"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Staff Member
                </label>
                <select
                  id="staff-member"
                  value={selectedStaffId}
                  onChange={(event) => {
                    const member = staff.find(
                      (item) => item.id === event.target.value
                    );
                    setSelectedStaffId(event.target.value);
                    setSelectedAttraction(member?.attraction ?? "");
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                >
                  <option value="">Select staff member</option>
                  {staff.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                      {member.attraction
                        ? ` — ${member.attraction}`
                        : " — Unassigned"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="staff-attraction"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Assigned Attraction
                </label>
                <select
                  id="staff-attraction"
                  value={selectedAttraction}
                  onChange={(event) =>
                    setSelectedAttraction(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                >
                  <option value="">Select attraction</option>
                  {attractions.map((attraction) => (
                    <option key={attraction} value={attraction}>
                      {attraction}
                    </option>
                  ))}
                </select>
              </div>

              <p className="rounded-xl bg-gray-50 px-4 py-3 text-xs leading-5 text-gray-500">
                Assigning a staff member to another attraction will
                replace their current assignment.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveAssignment}
                disabled={!selectedStaffId || !selectedAttraction}
                className="rounded-xl bg-[#c1122f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9e0e26] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE CONFIRMATION */}
      {removeTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-assignment-title"
            className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2
              id="remove-assignment-title"
              className="text-2xl font-bold text-gray-900"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Remove Assignment?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Remove <strong>{removeTarget.name}</strong> from{" "}
              <strong>{removeTarget.attraction}</strong>? The staff
              member will become unassigned.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRemoveTarget(null)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={removeAssignment}
                className="rounded-xl bg-[#c1122f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9e0e26]"
              >
                Remove Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
