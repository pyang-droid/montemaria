
"use client";

export interface Attraction {
  id: number;
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  price: number | null;
  duration: string;
  currentVisitors: number;
  maxCapacity: number;
  timeSlots: {
    time: string;
    label: string;
    reserved: number;
  }[];
  img: string;
  badge: string;
  type: "paid" | "free";
  highlights: string[];
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
    capacity > 0
      ? Math.min(
          Math.round(
            (attraction.currentVisitors / capacity) * 100
          ),
          100
        )
      : 0;

  const available = Math.max(
    capacity - attraction.currentVisitors,
    0
  );

  return (
    <article
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={attraction.img}
          alt={attraction.name}
          className="block w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <span className="absolute top-3 left-3 bg-gray-800/90 text-white text-xs px-3 py-1.5 rounded-full font-medium">
          {attraction.badge}
        </span>

        <span
          className={`absolute top-3 right-3 text-white text-xs px-3 py-1.5 rounded-full font-medium ${
            attraction.type === "paid"
              ? "bg-orange-500"
              : "bg-green-600"
          }`}
        >
          {attraction.type === "paid"
            ? `₱${attraction.price}`
            : "FREE"}
        </span>
      </div>

      <div className="p-5">
        <h3
          className="text-lg font-bold text-gray-900 mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {attraction.name}
        </h3>

        <p
          className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-4"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {attraction.description}
        </p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">
            Currently Inside
          </span>

          <span
            className={`text-xs font-bold ${
              attraction.currentVisitors >= capacity
                ? "text-red-600"
                : "text-gray-700"
            }`}
          >
            {attraction.currentVisitors} / {capacity}
          </span>
        </div>

        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
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
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>⏱ {attraction.duration}</span>

          <span>
            {available > 0
              ? `${available} available`
              : "Full"}
          </span>
        </div>
      </div>
    </article>
  );
}
