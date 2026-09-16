"use client";

import { useState } from "react";
import StaffNav from "../StaffNav";

export default function QRCodePage() {
  const [scannedCodes, setScannedCodes] = useState<
    { code: string; time: string; status: "success" | "failed" }[]
  >([]);
  const [inputCode, setInputCode] = useState("");

  const handleScanQR = () => {
    if (!inputCode.trim()) return;

    const newEntry = {
      code: inputCode,
      time: new Date().toLocaleTimeString(),
      status: Math.random() > 0.1 ? "success" : "failed" as const,
    };

    setScannedCodes([newEntry, ...scannedCodes]);
    setInputCode("");
  };

  return (
    <>
      <StaffNav />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              QR Code <span className="text-brand-red">Scanning</span>
            </h1>
            <p className="text-gray-600">Scan visitor QR codes for entry and exit tracking</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Scanner Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Scanner Input</h2>

              <div className="mb-6 text-center">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-gray-600 mb-4">
                  Point your camera at a QR code or paste the code below
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleScanQR()}
                  placeholder="Scan QR code or paste code here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                  autoFocus
                />
                <button
                  onClick={handleScanQR}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all"
                >
                  Process Code
                </button>
              </div>

              {/* Scan Statistics */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Today's Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Successful Scans</p>
                    <p className="text-2xl font-bold text-green-600">
                      {scannedCodes.filter((s) => s.status === "success").length}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Failed Scans</p>
                    <p className="text-2xl font-bold text-red-600">
                      {scannedCodes.filter((s) => s.status === "failed").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scan History */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Scan History</h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {scannedCodes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No scans yet</p>
                ) : (
                  scannedCodes.map((scan, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        scan.status === "success"
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div>
                        <p className="font-mono text-sm text-gray-900">{scan.code}</p>
                        <p className="text-xs text-gray-500 mt-1">{scan.time}</p>
                      </div>
                      <span
                        className={`text-xl ${
                          scan.status === "success" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {scan.status === "success" ? "✓" : "✗"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
