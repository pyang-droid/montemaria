"use client";

import { useState } from "react";
import StaffNav from "../StaffNav";

interface VisitorRequest {
  id: number;
  name: string;
  qrCode: string;
  attraction: string;
  time: string;
  status: "pending" | "approved" | "denied";
}

export default function EntryValidationPage() {
  const [visitors, setVisitors] = useState<VisitorRequest[]>([
    {
      id: 1,
      name: "John Doe",
      qrCode: "MM-ABC123-5678",
      attraction: "Glass Walk",
      time: "2:30 PM",
      status: "pending",
    },
    {
      id: 2,
      name: "Maria Santos",
      qrCode: "MM-DEF456-9012",
      attraction: "View Deck",
      time: "2:35 PM",
      status: "pending",
    },
    {
      id: 3,
      name: "Carlos Rodriguez",
      qrCode: "MM-GHI789-3456",
      attraction: "Mirror Walk",
      time: "2:25 PM",
      status: "approved",
    },
  ]);

  const handleApprove = (id: number) => {
    setVisitors(
      visitors.map((v) => (v.id === id ? { ...v, status: "approved" } : v))
    );
  };

  const handleDeny = (id: number) => {
    setVisitors(
      visitors.map((v) => (v.id === id ? { ...v, status: "denied" } : v))
    );
  };

  const pendingCount = visitors.filter((v) => v.status === "pending").length;
  const approvedCount = visitors.filter((v) => v.status === "approved").length;
  const deniedCount = visitors.filter((v) => v.status === "denied").length;

  return (
    <>
      <StaffNav />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Entry <span className="text-brand-red">Validation</span>
            </h1>
            <p className="text-gray-600">Approve or deny visitor entries</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
              <p className="text-sm text-gray-600 mb-2">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Approved</p>
              <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <p className="text-sm text-gray-600 mb-2">Denied</p>
              <p className="text-3xl font-bold text-red-600">{deniedCount}</p>
            </div>
          </div>

          {/* Requests */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Visitor Requests</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      QR Code
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Attraction
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {visitor.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">
                        {visitor.qrCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {visitor.attraction}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {visitor.time}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            visitor.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : visitor.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {visitor.status.charAt(0).toUpperCase() +
                            visitor.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {visitor.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(visitor.id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-xs font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDeny(visitor.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs font-medium"
                            >
                              Deny
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visitors.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No pending requests
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
