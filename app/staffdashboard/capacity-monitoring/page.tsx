"use client";

import { useState } from "react";
import StaffNav from "../StaffNav";

interface Attraction {
  id: number;
  name: string;
  current: number;
  max: number;
  status: "available" | "warning" | "full";
}

export default function CapacityMonitoringPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([
    { id: 1, name: "Mirage Walk", current: 12, max: 20, status: "available" },
    { id: 2, name: "View Deck", current: 42, max: 50, status: "warning" },
    { id: 3, name: "Glass Walk", current: 15, max: 15, status: "full" },
    { id: 4, name: "Mirror Walk", current: 18, max: 25, status: "available" },
    { id: 5, name: "Gate of the Archangels", current: 55, max: 60, status: "warning" },
    { id: 6, name: "Sto. Niño Chapel", current: 40, max: 40, status: "full" },
  ]);

  const handleUpdateStatus = (id: number, newStatus: "available" | "warning" | "full") => {
    setAttractions(
      attractions.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "full":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-800 bg-green-100";
      case "warning":
        return "text-yellow-800 bg-yellow-100";
      case "full":
        return "text-red-800 bg-red-100";
      default:
        return "text-gray-800 bg-gray-100";
    }
  };

  return (
    <>
      <StaffNav />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Capacity <span className="text-brand-red">Monitoring</span>
            </h1>
            <p className="text-gray-600">Monitor real-time attraction capacity</p>
          </div>

          {/* Overall Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <p className="text-sm text-gray-600 mb-2">Total Capacity Used</p>
              <p className="text-3xl font-bold text-gray-900">
                {attractions.reduce((sum, a) => sum + a.current, 0)}/
                {attractions.reduce((sum, a) => sum + a.max, 0)}
              </p>
              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      (attractions.reduce((sum, a) => sum + a.current, 0) /
                        attractions.reduce((sum, a) => sum + a.max, 0)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Available</p>
              <p className="text-3xl font-bold text-green-600">
                {attractions.filter((a) => a.status === "available").length}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
                <p className="text-xs text-gray-600 mb-1">Warning</p>
                <p className="text-2xl font-bold text-gray-700">
                  {attractions.filter((a) => a.status === "warning").length}
                </p>
              </div>
              <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                <p className="text-xs text-gray-600 mb-1">Full</p>
                <p className="text-2xl font-bold text-gray-700">
                  {attractions.filter((a) => a.status === "full").length}
                </p>
              </div>
            </div>
          </div>

          {/* Attractions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction) => (
              <div
                key={attraction.id}
                className={`rounded-2xl p-6 border shadow-lg ${getStatusBgColor(
                  attraction.status
                )}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {attraction.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusTextColor(
                      attraction.status
                    )}`}
                  >
                    {attraction.status.charAt(0).toUpperCase() +
                      attraction.status.slice(1)}
                  </span>
                </div>

                {/* Capacity Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {attraction.current}/{attraction.max}
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round((attraction.current / attraction.max) * 100)}%
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all ${getCapacityColor(
                        attraction.current,
                        attraction.max
                      )}`}
                      style={{
                        width: `${
                          (attraction.current / attraction.max) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() =>
                      handleUpdateStatus(attraction.id, "available")
                    }
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      attraction.status === "available"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Available
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(attraction.id, "warning")
                    }
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      attraction.status === "warning"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Warning
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(attraction.id, "full")}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      attraction.status === "full"
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Full
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
