
"use client";

import { useMemo, useState } from "react";
import AdminNav from "../AdminNav";
import {
  Search,
  Eye,
  Pencil,
  X,
  MapPin,
  Clock3,
  Users,
  CheckCircle2,
  CircleOff,
  RotateCcw,
} from "lucide-react";

type AttractionType = "Paid" | "Free";
type AttractionStatus = "Open" | "Closed";
type ModalMode = "view" | "edit";

interface Attraction {
  id: number;
  name: string;
  type: AttractionType;
  capacity: number;
  schedule: string;
  status: AttractionStatus;
  description: string;
  entranceFee: number | null;
}

const initialAttractions: Attraction[] = [
  {
    id: 1,
    name: "Mirage Walk",
    type: "Paid",
    capacity: 20,
    schedule: "8:00 AM - 5:00 PM",
    status: "Open",
    description: "",
    entranceFee: null,
  },
  {
    id: 2,
    name: "View Deck",
    type: "Paid",
    capacity: 50,
    schedule: "8:00 AM - 6:00 PM",
    status: "Open",
    description: "",
    entranceFee: null,
  },
  {
    id: 3,
    name: "Glass Walk",
    type: "Paid",
    capacity: 15,
    schedule: "9:00 AM - 5:00 PM",
    status: "Open",
    description: "",
    entranceFee: null,
  },
  {
    id: 4,
    name: "Miracle Walk",
    type: "Free",
    capacity: 30,
    schedule: "6:00 AM - 6:00 PM",
    status: "Open",
    description: "",
    entranceFee: 0,
  },
  {
    id: 5,
    name: "Gate of the Archangels",
    type: "Free",
    capacity: 60,
    schedule: "6:00 AM - 6:00 PM",
    status: "Open",
    description: "",
    entranceFee: 0,
  },
  {
    id: 6,
    name: "Sto. Niño Chapel",
    type: "Free",
    capacity: 40,
    schedule: "6:00 AM - 6:00 PM",
    status: "Open",
    description: "",
    entranceFee: 0,
  },
];

const moneyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

function formatFee(attraction: Attraction) {
  if (attraction.type === "Free") return "Free";

  if (attraction.entranceFee === null) {
    return "Not specified";
  }

  return moneyFormatter.format(attraction.entranceFee);
}

function StatusBadge({
  status,
}: {
  status: AttractionStatus;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        status === "Open"
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Open" ? "bg-green-600" : "bg-red-600"
        }`}
      />
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: AttractionType }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        type === "Paid"
          ? "bg-blue-50 text-blue-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {type}
    </span>
  );
}

export default function AttractionsPage() {
  const [attractions, setAttractions] =
    useState<Attraction[]>(initialAttractions);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [selectedAttraction, setSelectedAttraction] =
    useState<Attraction | null>(null);

  const [modalMode, setModalMode] = useState<ModalMode>("view");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const totalAttractions = attractions.length;

  const openAttractions = attractions.filter(
    (attraction) => attraction.status === "Open"
  ).length;

  const closedAttractions = attractions.filter(
    (attraction) => attraction.status === "Closed"
  ).length;

  const totalCapacity = attractions.reduce(
    (total, attraction) => total + attraction.capacity,
    0
  );

  const paidAttractions = attractions.filter(
    (attraction) => attraction.type === "Paid"
  ).length;

  const freeAttractions = attractions.filter(
    (attraction) => attraction.type === "Free"
  ).length;

  const filteredAttractions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attractions.filter((attraction) => {
      const matchesSearch =
        attraction.name.toLowerCase().includes(query) ||
        attraction.schedule.toLowerCase().includes(query) ||
        attraction.description.toLowerCase().includes(query) ||
        attraction.id.toString().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        attraction.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        attraction.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [attractions, search, statusFilter, typeFilter]);

  const summaryCards = [
    {
      title: "Total Attractions",
      value: totalAttractions,
      description: "Attractions in the system",
      icon: MapPin,
      color: "text-gray-900",
    },
    {
      title: "Open Attractions",
      value: openAttractions,
      description: "Available for visitor access",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Closed Attractions",
      value: closedAttractions,
      description: "Currently unavailable",
      icon: CircleOff,
      color: "text-[#c1122f]",
    },
    {
      title: "Total Visitor Capacity",
      value: totalCapacity,
      description: "Combined concurrent capacity",
      icon: Users,
      color: "text-gray-900",
    },
  ];

  function openViewModal(attraction: Attraction) {
    setSelectedAttraction({ ...attraction });
    setModalMode("view");
    setFormError("");
  }

  function openEditModal(attraction: Attraction) {
    setSelectedAttraction({ ...attraction });
    setModalMode("edit");
    setFormError("");
  }

  function closeModal() {
    setSelectedAttraction(null);
    setFormError("");
  }

  function updateField<K extends keyof Attraction>(
    field: K,
    value: Attraction[K]
  ) {
    setSelectedAttraction((previous) => {
      if (!previous) return null;

      return {
        ...previous,
        [field]: value,
      };
    });

    setFormError("");
  }

  function handleTypeChange(type: AttractionType) {
    setSelectedAttraction((previous) => {
      if (!previous) return null;

      return {
        ...previous,
        type,
        entranceFee:
          type === "Free"
            ? 0
            : previous.type === "Free"
              ? null
              : previous.entranceFee,
      };
    });

    setFormError("");
  }

  function handleSave() {
    if (!selectedAttraction) return;

    const name = selectedAttraction.name.trim();
    const schedule = selectedAttraction.schedule.trim();

    if (!name) {
      setFormError("Attraction name is required.");
      return;
    }

    const duplicateName = attractions.some(
      (attraction) =>
        attraction.id !== selectedAttraction.id &&
        attraction.name.trim().toLowerCase() === name.toLowerCase()
    );

    if (duplicateName) {
      setFormError("An attraction with this name already exists.");
      return;
    }

    if (
      !Number.isInteger(selectedAttraction.capacity) ||
      selectedAttraction.capacity < 1
    ) {
      setFormError("Maximum capacity must be a whole number of at least 1.");
      return;
    }

    if (!schedule) {
      setFormError("Operating schedule is required.");
      return;
    }

    if (
      selectedAttraction.type === "Paid" &&
      selectedAttraction.entranceFee !== null &&
      (!Number.isFinite(selectedAttraction.entranceFee) ||
        selectedAttraction.entranceFee < 0)
    ) {
      setFormError("Entrance fee must be a valid non-negative amount.");
      return;
    }

    const updatedAttraction: Attraction = {
      ...selectedAttraction,
      name,
      schedule,
      description: selectedAttraction.description.trim(),
      entranceFee:
        selectedAttraction.type === "Free"
          ? 0
          : selectedAttraction.entranceFee,
    };

    setAttractions((previous) =>
      previous.map((attraction) =>
        attraction.id === updatedAttraction.id
          ? updatedAttraction
          : attraction
      )
    );

    setSuccessMessage(
      `${updatedAttraction.name} has been updated in this preview.`
    );

    closeModal();
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
  }

  return (
    <>
      <AdminNav />

      <main className="min-h-screen bg-[#f7f7f8] px-5 pb-16 pt-28 sm:px-6 lg:ml-[280px] lg:px-8 lg:pt-12">
        <div className="mx-auto max-w-[1400px]">
          {/* HEADER */}
          <div className="mb-8 border-b border-gray-200 pb-7">
            <p
              className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c1122f]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Tourism Administration
            </p>

            <h1
              className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Manage Attractions
            </h1>

            <p
              className="mt-3 max-w-3xl text-sm leading-6 text-gray-500 md:text-base"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Manage attraction information, visitor capacity,
              operating schedules, entrance fees, and availability.
            </p>
          </div>

          {/* SAMPLE DATA NOTICE */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs leading-5 text-gray-500">
            Preview data only. Attraction details, capacities,
            schedules, and statuses are illustrative. Changes are
            temporary and will reset when the page is refreshed.
          </div>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div
              role="status"
              className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
            >
              <span>{successMessage}</span>

              <button
                type="button"
                onClick={() => setSuccessMessage("")}
                aria-label="Dismiss message"
                className="text-green-700 hover:text-green-900"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* SUMMARY CARDS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {card.title}
                    </p>

                    <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500">
                      <Icon size={18} />
                    </div>
                  </div>

                  <p
                    className={`mt-3 text-3xl font-bold ${card.color}`}
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
              );
            })}
          </div>

          {/* ATTRACTION TABLE */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 border-b border-gray-100 p-6 xl:flex-row xl:items-center xl:justify-between">
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
                  {paidAttractions} paid and {freeAttractions} free
                  attractions in the current records.
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
                    placeholder="Search attraction..."
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#c1122f] sm:w-[220px]"
                  />
                </div>

                <select
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>

                <select
                  aria-label="Filter by type"
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(event.target.value)
                  }
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                >
                  <option value="All">All Types</option>
                  <option value="Paid">Paid</option>
                  <option value="Free">Free</option>
                </select>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  <RotateCcw size={15} />
                  Clear
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {[
                      "Attraction",
                      "Type",
                      "Capacity",
                      "Entrance Fee",
                      "Operating Schedule",
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
                  {filteredAttractions.map((attraction) => (
                    <tr
                      key={attraction.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-5">
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

                      <td className="px-5 py-5">
                        <TypeBadge type={attraction.type} />
                      </td>

                      <td className="px-5 py-5 text-sm font-semibold text-gray-700">
                        {attraction.capacity}
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-600">
                        {formatFee(attraction)}
                      </td>

                      <td className="px-5 py-5">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-gray-600">
                          <Clock3 size={15} className="text-gray-400" />
                          {attraction.schedule}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <StatusBadge status={attraction.status} />
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openViewModal(attraction)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#c1122f]"
                          >
                            <Eye size={16} />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(attraction)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c1122f] hover:underline"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAttractions.length === 0 && (
              <div className="px-6 py-16 text-center">
                <MapPin size={30} className="mx-auto text-gray-300" />

                <p className="mt-4 text-lg font-bold text-gray-800">
                  No attractions found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-sm font-semibold text-[#c1122f] hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}

            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <p className="text-xs text-gray-400">
                Showing {filteredAttractions.length} of{" "}
                {attractions.length} attractions
              </p>
            </div>
          </section>

          {/* CAPACITY EXPLANATION */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-gray-100 p-2.5 text-gray-600">
                <Users size={20} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  About Visitor Capacity
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Maximum capacity refers to the number of visitors
                  allowed inside an attraction at the same time.
                  Current occupancy will be determined from verified
                  visitor entry and exit records. This capacity does
                  not represent a daily booking limit.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
            Montemaria Express · Tourism Administration
          </p>
        </div>
      </main>

      {/* VIEW / EDIT MODAL */}
      {selectedAttraction && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="attraction-modal-title"
            className="max-h-[90vh] w-full max-w-[580px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c1122f]">
                  Attraction Management
                </p>

                <h2
                  id="attraction-modal-title"
                  className="mt-1 text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {modalMode === "view"
                    ? "Attraction Details"
                    : "Edit Attraction"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedAttraction.name}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close modal"
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* VIEW DETAILS */}
            {modalMode === "view" ? (
              <div className="space-y-5 p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Attraction Name
                  </p>
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    {selectedAttraction.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Attraction Type
                    </p>
                    <TypeBadge type={selectedAttraction.type} />
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Status
                    </p>
                    <StatusBadge status={selectedAttraction.status} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Maximum Capacity
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedAttraction.capacity} visitors
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Entrance Fee
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {formatFee(selectedAttraction)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Operating Schedule
                  </p>
                  <p className="mt-2 text-sm text-gray-800">
                    {selectedAttraction.schedule}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Description
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {selectedAttraction.description ||
                      "No description provided."}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 px-4 py-3 text-xs leading-5 text-gray-500">
                  Capacity indicates the maximum number of visitors
                  permitted inside this attraction simultaneously.
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setModalMode("edit");
                      setFormError("");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#c1122f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9e0e26]"
                  >
                    <Pencil size={15} />
                    Edit Attraction
                  </button>
                </div>
              </div>
            ) : (
              /* EDIT FORM */
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSave();
                }}
                className="space-y-5 p-6"
              >
                <div>
                  <label
                    htmlFor="attraction-name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Attraction Name
                  </label>

                  <input
                    id="attraction-name"
                    type="text"
                    required
                    value={selectedAttraction.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="attraction-description"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="attraction-description"
                    rows={3}
                    value={selectedAttraction.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Enter attraction description..."
                    className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="attraction-type"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Attraction Type
                    </label>

                    <select
                      id="attraction-type"
                      value={selectedAttraction.type}
                      onChange={(event) =>
                        handleTypeChange(
                          event.target.value as AttractionType
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Free">Free</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="attraction-capacity"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Maximum Capacity
                    </label>

                    <input
                      id="attraction-capacity"
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={selectedAttraction.capacity}
                      onChange={(event) =>
                        updateField(
                          "capacity",
                          Number(event.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="attraction-fee"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Entrance Fee (PHP)
                  </label>

                  <input
                    id="attraction-fee"
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={selectedAttraction.type === "Free"}
                    value={selectedAttraction.entranceFee ?? ""}
                    onChange={(event) =>
                      updateField(
                        "entranceFee",
                        event.target.value === ""
                          ? null
                          : Number(event.target.value)
                      )
                    }
                    placeholder={
                      selectedAttraction.type === "Free"
                        ? "Free"
                        : "Enter entrance fee"
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#c1122f] disabled:bg-gray-100 disabled:text-gray-400"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Enter the confirmed entrance fee. Leave blank
                    if the price has not been provided.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="attraction-schedule"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Operating Schedule
                  </label>

                  <input
                    id="attraction-schedule"
                    type="text"
                    required
                    value={selectedAttraction.schedule}
                    onChange={(event) =>
                      updateField("schedule", event.target.value)
                    }
                    placeholder="Example: 8:00 AM - 5:00 PM"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="attraction-status"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Attraction Status
                  </label>

                  <select
                    id="attraction-status"
                    value={selectedAttraction.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.value as AttractionStatus
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <p className="mt-2 text-xs leading-5 text-gray-400">
                    Open attractions are available for visitor access.
                    Closed attractions are marked unavailable.
                    Booking restrictions will be enforced when the
                    visitor booking flow is connected to these records.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-800">
                    Visitor Capacity Information
                  </p>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Capacity is the maximum number of visitors allowed
                    inside the attraction simultaneously. Occupancy
                    is tracked through verified QR entry and exit
                    records, not through the total number of daily
                    reservations.
                  </p>
                </div>

                {formError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {formError}
                  </p>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-[#c1122f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#9e0e26]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
