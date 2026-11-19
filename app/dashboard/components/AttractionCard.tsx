
"use client";

export interface Attraction {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  fullDescription?: string;
  price: number | null;
  duration?: string;
  currentVisitors: number | null;
  maxCapacity: number | null;
  capacityIsPreview: boolean;
  schedule: string;
  img?: string;
  badge?: string;
  type: "paid" | "free";
  highlights?: string[];
  status: "Open" | "Closed";
}

interface AttractionCardProps {
  attraction: Attraction;
  onClick: () => void;
}

export default function AttractionCard({
  attraction,
  onClick,
}: AttractionCardProps) {
  const capacity = attraction.maxCapacity;

  const occupancy =
    !attraction.capacityIsPreview &&
    capacity !== null &&
    capacity > 0 &&
    attraction.currentVisitors !== null
      ? Math.min(
          Math.round(
            ((attraction.currentVisitors ?? 0) / capacity) * 100
          ),
          100
        )
      : null;

  const available =
    attraction.capacityIsPreview ||
    attraction.currentVisitors === null ||
    capacity === null
    ? null
    : Math.max(capacity - attraction.currentVisitors, 0);

  return (
    <article
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        {attraction.img ? (
          <img
            src={attraction.img}
            alt={attraction.name}
            className="block w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-300" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {attraction.status === "Closed" && (
          <span className="absolute bottom-3 left-3 rounded-full bg-gray-900/90 px-3 py-1.5 text-xs font-medium text-white">
            Currently closed
          </span>
        )}

        {attraction.badge && (
          <span className="absolute top-3 left-3 bg-gray-800/90 text-white text-xs px-3 py-1.5 rounded-full font-medium">
            {attraction.badge}
          </span>
        )}

        <span
          className={`absolute top-3 right-3 text-white text-xs px-3 py-1.5 rounded-full font-medium ${
            attraction.type === "paid"
              ? "bg-orange-500"
              : "bg-green-600"
          }`}
        >
          {attraction.type === "paid"
            ? attraction.price === null
              ? "Price not set"
              : `₱${attraction.price}`
            : "FREE"}
        </span>
      </div>

      <div className="p-5">
        <h3
          className="text-lg font-bold text-gray-900 mb-2"
          style={{
            fontFamily: "var(--font-montemaria-sans)",
          }}
        >
          {attraction.name}
        </h3>

        <p
          className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-4"
          style={{ fontFamily: "var(--font-montemaria-sans)" }}
        >
          {attraction.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">
            {attraction.capacityIsPreview
              ? "Temporary capacity"
              : attraction.currentVisitors === null || capacity === null
                ? "Occupancy unavailable"
                : "Currently Inside"}
          </span>

          <span
            className={`text-xs font-bold ${
              !attraction.capacityIsPreview &&
              attraction.currentVisitors !== null &&
              capacity !== null &&
              attraction.currentVisitors >= capacity
                ? "text-red-600"
                : "text-gray-700"
            }`}
          >
            {attraction.currentVisitors === null || capacity === null
              ? `— / ${capacity ?? "—"}`
              : `${attraction.currentVisitors} / ${capacity}`}
          </span>
        </div>

        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
          {occupancy !== null && (
            <div
              className={`h-full rounded-full ${
                occupancy >= 100
                  ? "bg-red-600"
                  : occupancy >= 80
                    ? "bg-orange-500"
                    : "bg-green-600"
              }`}
              style={{ width: `${occupancy}%` }}
            />
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{attraction.duration ? `⏱ ${attraction.duration}` : ""}</span>

          <span>
            {available === null ? "Availability unavailable" : available > 0 ? `${available} available` : "Full"}
          </span>
        </div>
      </div>
    </article>
  );
}
