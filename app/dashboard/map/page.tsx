"use client";

import { useState, useEffect } from "react";
import DashboardNav from "../DashboardNav";

// Occupancy status types
type OccupancyStatus = "available" | "moderate" | "busy" | "full";

interface Attraction {
  id: number;
  name: string;
  currentOccupancy: number;
  maxCapacity: number;
  status: OccupancyStatus;
  location: string;
  type: "paid" | "free";
}

const attractions: Attraction[] = [
  {
    id: 1,
    name: "Mirage Walk",
    currentOccupancy: 8,
    maxCapacity: 20,
    status: "available",
    location: "East Wing",
    type: "paid",
  },
  {
    id: 2,
    name: "View Deck",
    currentOccupancy: 35,
    maxCapacity: 50,
    status: "moderate",
    location: "Summit",
    type: "paid",
  },
  {
    id: 3,
    name: "Glass Walk",
    currentOccupancy: 15,
    maxCapacity: 15,
    status: "full",
    location: "West Wing",
    type: "paid",
  },
  {
    id: 4,
    name: "Miracle Walk",
    currentOccupancy: 12,
    maxCapacity: 30,
    status: "available",
    location: "Main Path",
    type: "free",
  },
  {
    id: 5,
    name: "Gate of the Archangels",
    currentOccupancy: 45,
    maxCapacity: 60,
    status: "moderate",
    location: "Entrance",
    type: "free",
  },
  {
    id: 6,
    name: "Sto. Niño Chapel",
    currentOccupancy: 28,
    maxCapacity: 40,
    status: "moderate",
    location: "Central Garden",
    type: "free",
  },
  {
    id: 7,
    name: "Retreat Facility",
    currentOccupancy: 55,
    maxCapacity: 80,
    status: "moderate",
    location: "North Area",
    type: "free",
  },
  {
    id: 8,
    name: "St. John Paul II Chapel",
    currentOccupancy: 62,
    maxCapacity: 70,
    status: "busy",
    location: "South Wing",
    type: "free",
  },
];

const getStatusColor = (status: OccupancyStatus) => {
  switch (status) {
    case "available":
      return "bg-green-500";
    case "moderate":
      return "bg-yellow-500";
    case "busy":
      return "bg-orange-500";
    case "full":
      return "bg-red-500";
  }
};

const getStatusText = (status: OccupancyStatus) => {
  switch (status) {
    case "available":
      return "Available";
    case "moderate":
      return "Moderate";
    case "busy":
      return "Busy";
    case "full":
      return "Full";
  }
};

const getStatusTextColor = (status: OccupancyStatus) => {
  switch (status) {
    case "available":
      return "text-green-700";
    case "moderate":
      return "text-yellow-700";
    case "busy":
      return "text-orange-700";
    case "full":
      return "text-red-700";
  }
};

export default function MapPage() {
  const [filter, setFilter] = useState<"all" | "paid" | "free">("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredAttractions = attractions.filter((attraction) => {
    if (filter === "all") return true;
    return attraction.type === filter;
  });

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Live <span className="text-brand-red italic">Occupancy Map</span>
            </h1>
            <p
              className="text-gray-600 text-lg"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Real-time occupancy status of all attractions
            </p>
            <p
              className="text-gray-500 text-sm mt-2"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Last updated: {currentTime.toLocaleTimeString()}
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-gray-700 text-white border border-gray-300"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              All Attractions
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === "paid"
                  ? "bg-gray-700 text-white border border-gray-300"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Paid Only
            </button>
            <button
              onClick={() => setFilter("free")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === "free"
                  ? "bg-gray-700 text-white border border-gray-300"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Free Only
            </button>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-100">
            <h3
              className="text-lg font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Occupancy Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span
                  className="text-sm text-gray-700"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Available (0-40%)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <span
                  className="text-sm text-gray-700"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Moderate (41-70%)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <span
                  className="text-sm text-gray-700"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Busy (71-99%)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span
                  className="text-sm text-gray-700"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Full (100%)
                </span>
              </div>
            </div>
          </div>

          {/* Attractions List */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredAttractions.map((attraction) => {
              const occupancyPercentage = Math.round(
                (attraction.currentOccupancy / attraction.maxCapacity) * 100
              );

              return (
                <div
                  key={attraction.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(attraction.status)} mt-1.5 flex-shrink-0`} />
                      <div>
                        <h3
                          className="text-xl font-bold text-gray-900 mb-1"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {attraction.name}
                        </h3>
                        <p
                          className="text-sm text-gray-500"
                          style={{ fontFamily: "'Lato', sans-serif" }}
                        >
                          📍 {attraction.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        attraction.type === "paid"
                          ? "bg-brand-red/10 text-brand-red"
                          : "bg-green-100 text-green-700"
                      }`}
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {attraction.type === "paid" ? "Paid" : "Free"}
                    </span>
                  </div>

                  {/* Occupancy Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        Current Occupancy
                      </span>
                      <span
                        className={`text-sm font-bold ${getStatusTextColor(attraction.status)}`}
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        {getStatusText(attraction.status)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${getStatusColor(attraction.status)} transition-all duration-500`}
                        style={{ width: `${occupancyPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p
                        className="text-xs text-gray-500 mb-1"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        Current / Max
                      </p>
                      <p
                        className="text-lg font-bold text-gray-900"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {attraction.currentOccupancy} / {attraction.maxCapacity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-xs text-gray-500 mb-1"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        Capacity
                      </p>
                      <p
                        className="text-lg font-bold text-gray-900"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {occupancyPercentage}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
