"use client";

import { useState } from "react";
import AdminNav from "../AdminNav";

interface Attraction {
  id: number;
  name: string;
  type: "Paid" | "Free";
  capacity: number;
  availableSlots: number;
  schedule: string;
  status: "Open" | "Closed";
}

const initialAttractions: Attraction[] = [
  {
    id: 1,
    name: "Mirage Walk",
    type: "Paid",
    capacity: 20,
    availableSlots: 8,
    schedule: "8:00 AM - 5:00 PM",
    status: "Open",
  },
  {
    id: 2,
    name: "View Deck",
    type: "Paid",
    capacity: 50,
    availableSlots: 15,
    schedule: "8:00 AM - 6:00 PM",
    status: "Open",
  },
  {
    id: 3,
    name: "Glass Walk",
    type: "Paid",
    capacity: 15,
    availableSlots: 0,
    schedule: "9:00 AM - 5:00 PM",
    status: "Open",
  },
  {
    id: 4,
    name: "Miracle Walk",
    type: "Free",
    capacity: 30,
    availableSlots: 18,
    schedule: "6:00 AM - 6:00 PM",
    status: "Open",
  },
  {
    id: 5,
    name: "Gate of the Archangels",
    type: "Free",
    capacity: 60,
    availableSlots: 32,
    schedule: "6:00 AM - 6:00 PM",
    status: "Open",
  },
  {
    id: 6,
    name: "Sto. Niño Chapel",
    type: "Free",
    capacity: 40,
    availableSlots: 20,
    schedule: "6:00 AM - 6:00 PM",
    status: "Open",
  },
];

export default function AttractionsPage() {
  const [attractions, setAttractions] =
    useState<Attraction[]>(initialAttractions);

  const [editingAttraction, setEditingAttraction] =
    useState<Attraction | null>(null);

  const [search, setSearch] = useState("");

  const filteredAttractions = attractions.filter((attraction) =>
    attraction.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalCapacity = attractions.reduce(
    (total, attraction) => total + attraction.capacity,
    0
  );

  const totalAvailableSlots = attractions.reduce(
    (total, attraction) => total + attraction.availableSlots,
    0
  );

  const openAttractions = attractions.filter(
    (attraction) => attraction.status === "Open"
  ).length;

  const handleSave = () => {
    if (!editingAttraction) return;

    setAttractions((previous) =>
      previous.map((attraction) =>
        attraction.id === editingAttraction.id
          ? editingAttraction
          : attraction
      )
    );

    setEditingAttraction(null);
  };

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
              Attraction Management
            </p>

            <h1
              className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Attractions & Slots
            </h1>

            <p
              className="mt-3 max-w-3xl text-sm leading-6 text-gray-500 md:text-base"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Manage attraction information, visitor capacity, available
              slots, and operating schedules.
            </p>
          </div>

          {/* SUMMARY CARDS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Attractions
              </p>

              <p
                className="mt-3 text-3xl font-bold text-gray-900"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {attractions.length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Open Attractions
              </p>

              <p
                className="mt-3 text-3xl font-bold text-green-600"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {openAttractions}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Capacity
              </p>

              <p
                className="mt-3 text-3xl font-bold text-gray-900"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {totalCapacity}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Available Slots
              </p>

              <p
                className="mt-3 text-3xl font-bold text-[#c1122f]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {totalAvailableSlots}
              </p>
            </div>
          </div>

          {/* MAIN TABLE */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* TABLE HEADER */}
            <div className="flex flex-col gap-5 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2
                  className="text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Attraction Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Current attraction capacity, slots, and schedules.
                </p>
              </div>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search attraction..."
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#c1122f] md:w-[260px]"
              />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Attraction
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Type
                    </th>

                    <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Capacity
                    </th>

                    <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Available Slots
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Schedule
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredAttractions.map((attraction) => (
                    <tr
                      key={attraction.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-5">
                        <p
                          className="font-bold text-gray-900"
                          style={{
                            fontFamily:
                              "'Playfair Display', Georgia, serif",
                          }}
                        >
                          {attraction.name}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            attraction.type === "Paid"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {attraction.type}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center text-sm font-semibold text-gray-700">
                        {attraction.capacity}
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={`text-sm font-bold ${
                            attraction.availableSlots === 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {attraction.availableSlots}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {attraction.schedule}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            attraction.status === "Open"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {attraction.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingAttraction({ ...attraction })
                          }
                          className="rounded-full border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 transition hover:border-[#c1122f] hover:text-[#c1122f]"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAttractions.length === 0 && (
              <div className="px-6 py-16 text-center">
                <p
                  className="text-lg font-bold text-gray-800"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  No attractions found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Try another attraction name.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* =========================================
          MANAGE ATTRACTION MODAL
      ========================================== */}
      {editingAttraction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-gray-100 px-7 py-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c1122f]">
                  Manage Attraction
                </p>

                <h2
                  className="mt-1 text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {editingAttraction.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditingAttraction(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500 transition hover:bg-gray-200"
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-5 p-7">

              {/* ATTRACTION NAME */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Attraction Name
                </label>

                <input
                  type="text"
                  value={editingAttraction.name}
                  onChange={(event) =>
                    setEditingAttraction({
                      ...editingAttraction,
                      name: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                />
              </div>

              {/* TYPE */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Attraction Type
                </label>

                <select
                  value={editingAttraction.type}
                  onChange={(event) =>
                    setEditingAttraction({
                      ...editingAttraction,
                      type: event.target.value as "Paid" | "Free",
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                >
                  <option value="Paid">Paid</option>
                  <option value="Free">Free</option>
                </select>
              </div>

              {/* CAPACITY + AVAILABLE SLOTS */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Capacity
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={editingAttraction.capacity}
                    onChange={(event) =>
                      setEditingAttraction({
                        ...editingAttraction,
                        capacity: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Available Slots
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={editingAttraction.availableSlots}
                    onChange={(event) =>
                      setEditingAttraction({
                        ...editingAttraction,
                        availableSlots: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                  />
                </div>
              </div>

              {/* SCHEDULE */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Slot Schedule
                </label>

                <input
                  type="text"
                  value={editingAttraction.schedule}
                  onChange={(event) =>
                    setEditingAttraction({
                      ...editingAttraction,
                      schedule: event.target.value,
                    })
                  }
                  placeholder="Example: 8:00 AM - 5:00 PM"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Attraction Status
                </label>

                <select
                  value={editingAttraction.status}
                  onChange={(event) =>
                    setEditingAttraction({
                      ...editingAttraction,
                      status: event.target.value as "Open" | "Closed",
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingAttraction(null)}
                  className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-full bg-[#c1122f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a70f28]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}