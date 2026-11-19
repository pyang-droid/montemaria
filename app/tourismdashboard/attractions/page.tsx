
"use client";

import { useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import AdminNav from "../AdminNav";
import { auth, db, storage } from "../../lib/firebase";
import { useLiveCollection } from "../../lib/firestore";
import { generateBookingTimeOptions } from "../../lib/bookingSchedule";
import type {
  AttractionAccessRequestRecord,
  AttractionRecord,
} from "../../lib/models";
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
type ModalMode = "view" | "edit" | "create";

interface Attraction {
  id: string;
  name: string;
  type: AttractionType;
  capacity: number | null;
  capacityIsPreview: boolean;
  currentVisitors: number | null;
  schedule: string;
  status: AttractionStatus;
  description: string;
  entranceFee: number | null;
  tagline: string;
  fullDescription: string;
  duration: string;
  img: string;
  imagePath: string;
  imageFile: File | null;
  badge: string;
  highlights: string[];
  isActive: boolean;
  isPublished: boolean;
  displayOrder: number;
}

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

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
  const { records, loading, error } =
    useLiveCollection<AttractionRecord>("attractions");
  const {
    records: accessRequests,
    loading: requestsLoading,
    error: requestsError,
  } = useLiveCollection<AttractionAccessRequestRecord>("attractionAccessRequests");
  const attractions: Attraction[] = records.map((record, index) => ({
    id: record.id,
    name: record.name,
    type: record.type,
    capacity: typeof record.capacity === "number" ? record.capacity : null,
    capacityIsPreview: record.capacityIsPreview !== false,
    currentVisitors:
      typeof record.currentVisitors === "number" ? record.currentVisitors : null,
    schedule: record.schedule,
    status: record.status,
    description: record.description ?? "",
    entranceFee: record.entranceFee ?? null,
    tagline: record.tagline ?? "",
    fullDescription: record.fullDescription ?? "",
    duration: record.duration ?? "",
    img: record.img ?? "",
    imagePath: record.imagePath ?? "",
    imageFile: null,
    badge: record.badge ?? "",
    highlights: Array.isArray(record.highlights) ? record.highlights : [],
    isActive: record.isActive === true,
    isPublished: record.isPublished === true,
    displayOrder: typeof record.displayOrder === "number" ? record.displayOrder : index + 1,
  })).sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [selectedAttraction, setSelectedAttraction] =
    useState<Attraction | null>(null);

  const [modalMode, setModalMode] = useState<ModalMode>("view");
  const [formError, setFormError] = useState("");
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [reviewingRequestId, setReviewingRequestId] = useState<string | null>(null);

  const totalAttractions = attractions.length;

  const openAttractions = attractions.filter(
    (attraction) => attraction.status === "Open"
  ).length;

  const closedAttractions = attractions.filter(
    (attraction) => attraction.status === "Closed"
  ).length;

  const totalCapacity = attractions.reduce(
    (total, attraction) => total + (attraction.capacity ?? 0),
    0
  );
  const attractionsWithCapacity = attractions.filter(
    (attraction) => attraction.capacity !== null
  ).length;
  const previewCapacityCount = attractions.filter(
    (attraction) => attraction.capacityIsPreview && attraction.capacity !== null
  ).length;

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
        attraction.tagline.toLowerCase().includes(query) ||
        attraction.fullDescription.toLowerCase().includes(query) ||
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
      title: "Total Listed Capacity",
      value: attractionsWithCapacity ? totalCapacity : "—",
      description: `${attractionsWithCapacity - previewCapacityCount} confirmed; ${previewCapacityCount} temporary preview values`,
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

  async function handleSave() {
    if (!selectedAttraction) return;

    const name = selectedAttraction.name.trim();
    const schedule = selectedAttraction.schedule.trim();
    const slug = slugify(name);

    if (!name) {
      setFormError("Attraction name is required.");
      return;
    }
    if (!slug) {
      setFormError("Enter a name that can be used as an attraction URL.");
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

    const duplicateSlug = attractions.some(
      (attraction) =>
        attraction.id !== selectedAttraction.id &&
        slugify(attraction.name) === slug
    );
    if (duplicateSlug) {
      setFormError("An attraction with this URL already exists.");
      return;
    }

    if (
      !Number.isInteger(selectedAttraction.capacity) ||
      selectedAttraction.capacity === null ||
      selectedAttraction.capacity < 1
    ) {
      setFormError("Maximum capacity must be a whole number of at least 1.");
      return;
    }

    if (
      selectedAttraction.currentVisitors !== null &&
      (!Number.isInteger(selectedAttraction.currentVisitors) ||
        selectedAttraction.currentVisitors < 0 ||
        selectedAttraction.currentVisitors > selectedAttraction.capacity)
    ) {
      setFormError("Current visitors must be a whole number within the attraction capacity, or left blank if unknown.");
      return;
    }

    if (!schedule) {
      setFormError("Operating schedule is required.");
      return;
    }
    if (
      selectedAttraction.type === "Paid" &&
      selectedAttraction.status === "Open" &&
      selectedAttraction.isActive &&
      selectedAttraction.isPublished &&
      generateBookingTimeOptions(schedule, selectedAttraction.duration).issue
    ) {
      setFormError(
        "An open, published paid attraction needs a valid estimated duration and operating schedule that allow at least one booking time."
      );
      return;
    }
    if (!Number.isInteger(selectedAttraction.displayOrder) || selectedAttraction.displayOrder < 1) {
      setFormError("Display order must be a whole number of at least 1.");
      return;
    }

    if (
      selectedAttraction.imageFile &&
      (!selectedAttraction.imageFile.type.startsWith("image/") ||
        selectedAttraction.imageFile.size > 5 * 1024 * 1024)
    ) {
      setFormError("Choose an image file no larger than 5 MB.");
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

    const updatedAttraction = {
      ...selectedAttraction,
      name,
      slug,
      schedule,
      description: selectedAttraction.description.trim(),
      tagline: selectedAttraction.tagline.trim(),
      fullDescription: selectedAttraction.fullDescription.trim(),
      duration: selectedAttraction.duration.trim(),
      badge: selectedAttraction.badge.trim(),
      highlights: selectedAttraction.highlights
        .map((highlight) => highlight.trim())
        .filter(Boolean),
      entranceFee:
        selectedAttraction.type === "Free"
          ? 0
          : selectedAttraction.entranceFee,
    };

    setSaving(true);
    setFormError("");
    setPageError("");
    let uploadedImage: ReturnType<typeof ref> | null = null;
    try {
      const attractionRef =
        modalMode === "create"
          ? doc(collection(db, "attractions"))
          : doc(db, "attractions", updatedAttraction.id);
      let imageUrl = updatedAttraction.img;
      let imagePath = updatedAttraction.imagePath;

      if (updatedAttraction.imageFile) {
        const extension =
          updatedAttraction.imageFile.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        uploadedImage = ref(
          storage,
          `attractions/${attractionRef.id}/cover-${Date.now()}.${extension}`
        );
        const upload = await uploadBytes(uploadedImage, updatedAttraction.imageFile, {
          contentType: updatedAttraction.imageFile.type,
        });
        imageUrl = await getDownloadURL(upload.ref);
        imagePath = upload.ref.fullPath;
      }

      const attractionData = {
        name: updatedAttraction.name,
        slug: updatedAttraction.slug,
        displayOrder: updatedAttraction.displayOrder,
        type: updatedAttraction.type,
        capacity: updatedAttraction.capacity,
        capacityIsPreview: updatedAttraction.capacityIsPreview,
        currentVisitors: updatedAttraction.currentVisitors,
        schedule: updatedAttraction.schedule,
        status: updatedAttraction.status,
        description: updatedAttraction.description,
        tagline: updatedAttraction.tagline,
        fullDescription: updatedAttraction.fullDescription,
        duration: updatedAttraction.duration,
        img: imageUrl,
        imagePath,
        badge: updatedAttraction.badge,
        highlights: updatedAttraction.highlights,
        isActive: updatedAttraction.isActive,
        isPublished: updatedAttraction.isPublished,
        entranceFee: updatedAttraction.entranceFee,
        updatedAt: serverTimestamp(),
      };

      if (modalMode === "create") {
        await setDoc(attractionRef, {
          ...attractionData,
          createdAt: serverTimestamp(),
        });
      } else {
        await updateDoc(attractionRef, attractionData);
      }

      if (
        updatedAttraction.imagePath &&
        updatedAttraction.imagePath !== imagePath
      ) {
        try {
          await deleteObject(ref(storage, updatedAttraction.imagePath));
        } catch (cleanupError) {
          console.error("Unable to remove the previous attraction image:", cleanupError);
          setPageError("The attraction was saved, but its previous image could not be removed from Storage.");
        }
      }

      setSuccessMessage(`${updatedAttraction.name} was saved.`);
      closeModal();
    } catch (saveError) {
      console.error("Unable to save attraction:", saveError);
      if (uploadedImage) {
        try {
          await deleteObject(uploadedImage);
        } catch (cleanupError) {
          console.error("Unable to clean up an unused attraction image:", cleanupError);
          setFormError("Unable to save this attraction, and the uploaded image could not be cleaned up. Contact an administrator.");
          return;
        }
      }
      setFormError("Unable to save this attraction. Check your access and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(attraction: Attraction) {
    if (!window.confirm(`Delete "${attraction.name}"? This cannot be undone.`)) {
      return;
    }

    setPageError("");
    try {
      await deleteDoc(doc(db, "attractions", attraction.id));
      setSuccessMessage(`${attraction.name} was deleted.`);
      if (attraction.imagePath) {
        try {
          await deleteObject(ref(storage, attraction.imagePath));
        } catch (cleanupError) {
          console.error("Unable to remove the deleted attraction image:", cleanupError);
          setPageError("The attraction record was deleted, but its image could not be removed from Storage.");
        }
      }
    } catch (deleteError) {
      console.error("Unable to delete attraction:", deleteError);
      setPageError("Unable to delete this attraction. Check your access and try again.");
    }
  }

  async function reviewAccessRequest(
    request: AttractionAccessRequestRecord,
    status: "approved" | "denied"
  ) {
    if (request.status !== "pending") return;
    if (
      !window.confirm(
        `${status === "approved" ? "Approve" : "Deny"} this access request? This does not issue an access code.`
      )
    ) {
      return;
    }

    const reviewerId = auth.currentUser?.uid;
    if (!reviewerId) {
      setPageError("Sign in with an administrator account to review access requests.");
      return;
    }

    setReviewingRequestId(request.id);
    setPageError("");
    try {
      await updateDoc(doc(db, "attractionAccessRequests", request.id), {
        status,
        reviewedBy: reviewerId,
        reviewedAt: serverTimestamp(),
      });
      setSuccessMessage(`Access request ${request.id} was ${status}. No code was issued.`);
    } catch (reviewError) {
      console.error("Unable to review attraction access request:", reviewError);
      setPageError("Unable to review this request. Check administrator access and try again.");
    } finally {
      setReviewingRequestId(null);
    }
  }

  function formatRequestDate(value: unknown) {
    return value instanceof Timestamp
      ? value.toDate().toLocaleString()
      : "Date unavailable";
  }

  function openCreateModal() {
    setSelectedAttraction({
      id: "",
      name: "",
      type: "Paid",
      capacity: null,
      capacityIsPreview: false,
      displayOrder:
        Math.max(0, ...attractions.map((attraction) => attraction.displayOrder)) + 1,
      currentVisitors: null,
      schedule: "",
      status: "Closed",
      description: "",
      entranceFee: null,
      tagline: "",
      fullDescription: "",
      duration: "",
      img: "",
      imagePath: "",
      imageFile: null,
      badge: "",
      highlights: [],
      isActive: true,
      isPublished: false,
    });
    setModalMode("create");
    setFormError("");
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
              style={{ fontFamily: "var(--font-montemaria-sans)" }}
            >
              Tourism Administration
            </p>

            <h1
              className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
              style={{
                fontFamily: "var(--font-montemaria-sans)",
              }}
            >
              Manage Attractions
            </h1>

            <p
              className="mt-3 max-w-3xl text-sm leading-6 text-gray-500 md:text-base"
              style={{ fontFamily: "var(--font-montemaria-sans)" }}
            >
              Manage attraction information, visitor capacity,
              operating schedules, entrance fees, and availability.
            </p>
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

          {pageError && (
            <p
              role="alert"
              className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            >
              {pageError}
            </p>
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
                      fontFamily: "var(--font-montemaria-sans)",
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
                    fontFamily: "var(--font-montemaria-sans)",
                  }}
                >
                  Attraction Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                {paidAttractions} paid and {freeAttractions} free attractions in the current records.
                Visibility is controlled independently from operating status.
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
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c1122f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9e0e26]"
                >
                  Add Attraction
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {[
                      "Attraction",
                      "Type",
                      "Capacity",
                      "Currently Inside",
                      "Entrance Fee",
                      "Operating Schedule",
                      "Status",
                      "Visibility",
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
                            fontFamily: "var(--font-montemaria-sans)",
                          }}
                        >
                          {attraction.name}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <TypeBadge type={attraction.type} />
                      </td>

                      <td className="px-5 py-5 text-sm font-semibold text-gray-700">
                        {attraction.capacity ?? "Not set"}
                        {attraction.capacityIsPreview && attraction.capacity !== null && (
                          <span className="ml-2 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase text-amber-700">
                            Preview
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-5 text-sm font-semibold text-gray-700">
                        {attraction.currentVisitors ?? "Unknown"}
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-600">
                        {formatFee(attraction)}
                      </td>

                      <td className="px-5 py-5">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-gray-600">
                          <Clock3 size={15} className="text-gray-400" />
                          {attraction.schedule || "Not set"}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <StatusBadge status={attraction.status} />
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${attraction.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                            {attraction.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${attraction.isPublished ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                            {attraction.isPublished ? "Published" : "Unpublished"}
                          </span>
                        </div>
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
                          <button
                            type="button"
                            onClick={() => void handleDelete(attraction)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {loading ? (
              <p className="px-6 py-16 text-center text-sm text-gray-500">
                Loading attractions…
              </p>
            ) : error ? (
              <p role="alert" className="px-6 py-16 text-center text-sm text-red-700">
                {error}
              </p>
            ) : filteredAttractions.length === 0 && (
              <div className="px-6 py-16 text-center">
                <MapPin size={30} className="mx-auto text-gray-300" />

                <p className="mt-4 text-lg font-bold text-gray-800">
                  No attractions found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {attractions.length === 0
                    ? "No attractions have been added yet."
                    : "Try changing your search or filters."}
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
                Showing {filteredAttractions.length} of {attractions.length} attractions
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

          <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Free Attraction Access Requests
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review real visitor requests. Approval does not generate an access code.
              </p>
            </div>

            {requestsLoading ? (
              <p className="p-8 text-center text-sm text-gray-500">
                Loading access requests…
              </p>
            ) : requestsError ? (
              <p role="alert" className="p-8 text-center text-sm text-red-700">
                {requestsError}
              </p>
            ) : accessRequests.length === 0 ? (
              <p className="p-8 text-center text-sm text-gray-500">
                No access requests have been submitted.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      {["Attraction", "Visitor account", "Visitors", "Submitted", "Status", "Review"].map((heading) => (
                        <th key={heading} className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {accessRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                          {request.attractionName}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {request.userEmail || request.userId}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {request.requestedVisitors}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatRequestDate(request.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold capitalize text-gray-700">
                          {request.status}
                        </td>
                        <td className="px-5 py-4">
                          {request.status === "pending" ? (
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={reviewingRequestId === request.id}
                                onClick={() => void reviewAccessRequest(request, "approved")}
                                className="text-sm font-semibold text-green-700 hover:underline disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={reviewingRequestId === request.id}
                                onClick={() => void reviewAccessRequest(request, "denied")}
                                className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-50"
                              >
                                Deny
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Reviewed by administrator
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

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
                    fontFamily: "var(--font-montemaria-sans)",
                  }}
                >
                  {modalMode === "view"
                    ? "Attraction Details"
                    : modalMode === "create"
                      ? "Add Attraction"
                      : "Edit Attraction"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedAttraction.name || "New attraction"}
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
                {selectedAttraction.img && (
                  <img
                    src={selectedAttraction.img}
                    alt={selectedAttraction.name}
                    className="h-52 w-full rounded-xl object-cover"
                  />
                )}
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
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Visibility
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedAttraction.isActive ? "Active" : "Inactive"} · {selectedAttraction.isPublished ? "Published" : "Unpublished"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Maximum Capacity
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedAttraction.capacity === null
                        ? "Not set"
                        : `${selectedAttraction.capacity} visitors${selectedAttraction.capacityIsPreview ? " (temporary preview)" : ""}`}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Currently Inside
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedAttraction.currentVisitors ?? "Unknown"}
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

                {selectedAttraction.fullDescription && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Full Description
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                      {selectedAttraction.fullDescription}
                    </p>
                  </div>
                )}

                {selectedAttraction.highlights.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Highlights
                    </p>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
                      {selectedAttraction.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {selectedAttraction.tagline && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Tagline</p>
                      <p className="mt-2 text-sm text-gray-700">{selectedAttraction.tagline}</p>
                    </div>
                  )}
                  {selectedAttraction.duration && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Estimated Duration</p>
                      <p className="mt-2 text-sm text-gray-700">{selectedAttraction.duration}</p>
                    </div>
                  )}
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
                  void handleSave();
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
                  <label htmlFor="attraction-display-order" className="mb-2 block text-sm font-semibold text-gray-700">
                    Display Order
                  </label>
                  <input
                    id="attraction-display-order"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={selectedAttraction.displayOrder}
                    onChange={(event) =>
                      updateField("displayOrder", Number(event.target.value))
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
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
                    <label htmlFor="attraction-tagline" className="mb-2 block text-sm font-semibold text-gray-700">
                      Short Tagline
                    </label>
                    <input
                      id="attraction-tagline"
                      type="text"
                      value={selectedAttraction.tagline}
                      onChange={(event) => updateField("tagline", event.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                    />
                  </div>
                  <div>
                    <label htmlFor="attraction-duration" className="mb-2 block text-sm font-semibold text-gray-700">
                      Estimated Duration
                    </label>
                    <input
                      id="attraction-duration"
                      type="text"
                      value={selectedAttraction.duration}
                      onChange={(event) => updateField("duration", event.target.value)}
                      placeholder="e.g. 45 minutes or 1-2 hours"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="attraction-full-description" className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Description
                  </label>
                  <textarea
                    id="attraction-full-description"
                    rows={5}
                    value={selectedAttraction.fullDescription}
                    onChange={(event) => updateField("fullDescription", event.target.value)}
                    className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="attraction-badge" className="mb-2 block text-sm font-semibold text-gray-700">
                      Badge
                    </label>
                    <input
                      id="attraction-badge"
                      type="text"
                      value={selectedAttraction.badge}
                      onChange={(event) => updateField("badge", event.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                    />
                  </div>
                  <div>
                    <label htmlFor="attraction-highlights" className="mb-2 block text-sm font-semibold text-gray-700">
                      Highlights (one per line)
                    </label>
                    <textarea
                      id="attraction-highlights"
                      rows={3}
                      value={selectedAttraction.highlights.join("\n")}
                      onChange={(event) => updateField("highlights", event.target.value.split("\n"))}
                      className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="attraction-cover" className="mb-2 block text-sm font-semibold text-gray-700">
                    Cover Image
                  </label>
                  <input
                    id="attraction-cover"
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      updateField("imageFile", event.target.files?.[0] ?? null)
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-semibold"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Upload a JPG, PNG, or WebP image up to 5 MB.{" "}
                    {selectedAttraction.imageFile
                      ? `Selected: ${selectedAttraction.imageFile.name}`
                      : selectedAttraction.img
                        ? "A cover image is currently set."
                        : "No cover image is set."}
                  </p>
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
                      value={selectedAttraction.capacity ?? ""}
                      onChange={(event) =>
                        updateField(
                          "capacity",
                          Number(event.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                    />
                    <label className="mt-3 flex items-start gap-2 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={!selectedAttraction.capacityIsPreview}
                        onChange={(event) =>
                          updateField("capacityIsPreview", !event.target.checked)
                        }
                        className="mt-0.5 accent-[#c1122f]"
                      />
                      Mark this capacity as verified
                    </label>
                    {selectedAttraction.capacityIsPreview && (
                      <p className="mt-2 text-xs text-amber-700">
                        This is a temporary screenshot value. Verify or replace it before relying on it operationally.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="attraction-current-visitors" className="mb-2 block text-sm font-semibold text-gray-700">
                    Current Visitors Inside
                  </label>
                  <input
                    id="attraction-current-visitors"
                    type="number"
                    min="0"
                    step="1"
                    value={selectedAttraction.currentVisitors ?? ""}
                    onChange={(event) =>
                      updateField(
                        "currentVisitors",
                        event.target.value === "" ? null : Number(event.target.value)
                      )
                    }
                    placeholder="Leave blank if occupancy has not been verified"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    This is live occupancy, not a preview statistic. Only enter a verified current headcount.
                  </p>
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
                    placeholder="Example: 7:00 AM - 7:30 PM"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#c1122f]"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Booking times are generated from these hours and the estimated duration.
                    Multiple open periods can be separated by commas.
                  </p>
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

                <fieldset className="rounded-xl border border-gray-200 p-4">
                  <legend className="px-1 text-sm font-semibold text-gray-700">
                    Visitor Visibility
                  </legend>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedAttraction.isActive}
                        onChange={(event) => updateField("isActive", event.target.checked)}
                        className="mt-0.5 accent-[#c1122f]"
                      />
                      <span>
                        <span className="block font-semibold">Active</span>
                        <span className="mt-1 block text-xs text-gray-500">
                          Inactive attractions are hidden from visitors and cannot be booked.
                        </span>
                      </span>
                    </label>
                    <label className="flex items-start gap-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedAttraction.isPublished}
                        onChange={(event) => updateField("isPublished", event.target.checked)}
                        className="mt-0.5 accent-[#c1122f]"
                      />
                      <span>
                        <span className="block font-semibold">Published</span>
                        <span className="mt-1 block text-xs text-gray-500">
                          Only published attractions appear on public pages.
                        </span>
                      </span>
                    </label>
                  </div>
                </fieldset>

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
                    disabled={saving}
                    className="rounded-xl bg-[#c1122f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#9e0e26] disabled:opacity-50"
                  >
                    {saving ? "Saving…" : modalMode === "create" ? "Create Attraction" : "Save Changes"}
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
