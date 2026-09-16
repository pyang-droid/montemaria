"use client";

import { useState } from "react";
import AdminNav from "../AdminNav";

interface OvercrowdAlert {
  id: string;
  attractionName: string;
  currentCount: number;
  safetyMaxLimit: number;
  status: "critical" | "warning" | "monitored";
  timeFlagged: string;
}

const operationalAlerts: OvercrowdAlert[] = [
  { id: "ALT-801", attractionName: "Glass Walk", currentCount: 18, safetyMaxLimit: 15, status: "critical", timeFlagged: "5 mins ago" },
  { id: "ALT-802", attractionName: "St. John Paul II Chapel", currentCount: 68, safetyMaxLimit: 70, status: "warning", timeFlagged: "14 mins ago" },
  { id: "ALT-803", attractionName: "View Deck", currentCount: 52, safetyMaxLimit: 50, status: "critical", timeFlagged: "22 mins ago" },
];

export default function AlertsPage() {
  const [alertList, setAlertList] = useState<OvercrowdAlert[]>(operationalAlerts);

  const triggerCoordinationAction = (alertId: string, actionName: string, location: string) => {
    alert(`🚨 Dispatch Alert!\nAction: "${actionName}" has been successfully broadcasted to the security and ground control team at ${location}.`);
  };

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Alerts & <span className="text-brand-red italic">Monitoring Hub</span>
            </h1>
            <p className="text-gray-600 text-base" style={{ fontFamily: "'Lato', sans-serif" }}>
              Receive instant overcrowding notifications and deploy on-site coordination workflows.
            </p>
          </div>

          {/* Active Alerts Feed */}
          <div className="space-y-4">
            {alertList.map((alertItem) => {
              const overflowCount = alertItem.currentCount - alertItem.safetyMaxLimit;
              
              return (
                <div 
                  key={alertItem.id} 
                  className={`bg-white rounded-xl border p-6 shadow-sm flex flex-col lg:flex-row justify-between lg:items-center gap-6 ${
                    alertItem.status === "critical" ? "border-l-4 border-l-red-500" : "border-l-4 border-l-yellow-500"
                  }`}
                >
                  {/* Alert Context Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                        alertItem.status === "critical" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-800"
                      }`} style={{ fontFamily: "'Lato', sans-serif" }}>
                        {alertItem.status} Overcrowd Risk
                      </span>
                      <span className="text-xs text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>
                        ⏱️ {alertItem.timeFlagged}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {alertItem.attractionName}
                    </h3>
                    
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Capacity Metrics: <span className="font-semibold text-gray-800">{alertItem.currentCount}</span> / {alertItem.safetyMaxLimit} max limit
                      {overflowCount > 0 && (
                        <span className="text-red-600 font-bold ml-1.5">({overflowCount} visitors over safety line!)</span>
                      )}
                    </p>
                  </div>

                  {/* Coordination Control Buttons Panel */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 border-t lg:border-t-0 pt-4 lg:pt-0">
                    <button
                      onClick={() => triggerCoordinationAction(alertItem.id, "Reroute Incoming Traffic", alertItem.attractionName)}
                      className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold tracking-wider uppercase border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Reroute Flow
                    </button>
                    <button
                      onClick={() => triggerCoordinationAction(alertItem.id, "Deploy Ground Marshals", alertItem.attractionName)}
                      className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold tracking-wider uppercase border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Dispatch Staff
                    </button>
                    <button
                      onClick={() => triggerCoordinationAction(alertItem.id, "Halt Main Entry Ticketing", alertItem.attractionName)}
                      className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold tracking-wider uppercase bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                       Close Gate
                    </button>
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