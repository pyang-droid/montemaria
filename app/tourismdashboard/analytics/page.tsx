"use client";

import { useState } from "react";
import AdminNav from "../AdminNav";

interface AttractionAnalytics {
  id: number;
  name: string;
  totalDailyVisitors: number;
  averageStayTime: string;
  peakHourWindow: string;
  timeOfDay: "morning" | "afternoon" | "evening";
  trend: "rising" | "stable" | "declining";
}

const mockAnalyticsData: AttractionAnalytics[] = [
  { id: 1, name: "Mirage Walk", totalDailyVisitors: 280, averageStayTime: "45 mins", peakHourWindow: "09:00 AM - 11:00 AM", timeOfDay: "morning", trend: "rising" },
  { id: 2, name: "View Deck", totalDailyVisitors: 640, averageStayTime: "35 mins", peakHourWindow: "04:30 PM - 06:00 PM", timeOfDay: "evening", trend: "rising" },
  { id: 3, name: "Glass Walk", totalDailyVisitors: 195, averageStayTime: "20 mins", peakHourWindow: "01:00 PM - 02:30 PM", timeOfDay: "afternoon", trend: "stable" },
  { id: 4, name: "Miracle Walk", totalDailyVisitors: 310, averageStayTime: "50 mins", peakHourWindow: "08:00 AM - 10:00 AM", timeOfDay: "morning", trend: "declining" },
  { id: 5, name: "Gate of the Archangels", totalDailyVisitors: 920, averageStayTime: "15 mins", peakHourWindow: "03:00 PM - 05:00 PM", timeOfDay: "afternoon", trend: "rising" },
  { id: 6, name: "Sto. Niño Chapel", totalDailyVisitors: 450, averageStayTime: "30 mins", peakHourWindow: "10:30 AM - 12:00 PM", timeOfDay: "morning", trend: "stable" },
];

export default function AnalyticsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "morning" | "afternoon" | "evening">("all");

  const filteredData = mockAnalyticsData.filter(
    (item) => activeFilter === "all" || item.timeOfDay === activeFilter
  );

  const totalAggregatedVisitors = filteredData.reduce((acc, curr) => acc + curr.totalDailyVisitors, 0);
  const maxCapacityBenchmark = 3500;
  const capacityUtilizationRate = Math.round((totalAggregatedVisitors / maxCapacityBenchmark) * 100);

  // SVG Line plot points
  const linePoints = "20,110 60,70 100,90 140,50 180,80 220,40 260,65 300,20 340,45 380,15";
  const areaPoints = `20,130 ${linePoints} 380,130`;

  return (
    <>
      <AdminNav />
      {/* Pure White Background Floor Canvas */}
      <div className="min-h-screen bg-white pt-24 pb-20 px-6 text-gray-700">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Module */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 rounded-full bg-brand-red" />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>
                  System Control Desk
                </p>
              </div>
              <h1 className="text-4xl font-black tracking-tight mb-2 text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                System <span className="text-brand-red italic font-serif">Analytics</span>
              </h1>
              <p className="text-gray-500 text-sm tracking-wide" style={{ fontFamily: "'Lato', sans-serif" }}>
                Monitor daily foot traffic performance thresholds and target peak operating hours.
              </p>
            </div>
            
            {/* Filter Hub Controls */}
            <div className="mt-6 md:mt-0 bg-white p-1.5 rounded-xl border border-gray-300 shadow-sm flex gap-1">
              {(["all", "morning", "afternoon", "evening"] as const).map((timeSlot) => (
                <button
                  key={timeSlot}
                  onClick={() => setActiveFilter(timeSlot)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeFilter === timeSlot
                      ? "bg-gray-700 text-white shadow-sm scale-105"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {timeSlot}
                </button>
              ))}
            </div>
          </div>

          {/* Charts Slots Grid (Moved to the Top Position) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            
            {/* Left Graph Card Container (Line Curve) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm">
              <div className="mb-4">
                <p className="text-xs font-bold text-brand-red uppercase tracking-widest mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Time Series Trend</p>
                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Visits Curve Velocity</h3>
              </div>
              <div className="h-64 w-full relative pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150" preserveAspectRatio="none">
                  {/* Subtle layout lines */}
                  <line x1="20" y1="30" x2="380" y2="30" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="20" y1="70" x2="380" y2="70" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="20" y1="110" x2="380" y2="110" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="20" y1="130" x2="380" y2="130" stroke="#cbd5e1" strokeWidth="1.5" />
                  
                  {/* Bottom curve gradient overlay block */}
                  <polygon points={areaPoints} fill="url(#gray-area-gradient)" />
                  
                  {/* Core trend line path line */}
                  <polyline
                    points={linePoints}
                    fill="none"
                    stroke="#E53E3E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Graph Data Node Points */}
                  {linePoints.split(" ").map((pt, idx) => {
                    const [x, y] = pt.split(",");
                    return <circle key={idx} cx={x} cy={y} r="4" fill="#FFFFFF" stroke="#E53E3E" strokeWidth="2.5" />;
                  })}

                  <defs>
                    <linearGradient id="gray-area-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E53E3E" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#E53E3E" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Horizontal X Axis Labels */}
                <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-4 px-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                  <span>08:00 AM</span>
                  <span>11:00 AM</span>
                  <span>02:00 PM</span>
                  <span>05:00 PM</span>
                  <span>08:00 PM</span>
                </div>
              </div>
            </div>

            {/* Right Graph Card Container (Bar Chart Column Layout) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm">
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Distribution Metrics</p>
                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Visits By Attraction Zone</h3>
              </div>
              <div className="h-64 w-full flex items-end justify-between gap-4 pt-6 px-2 border-b border-gray-200">
                {filteredData.map((item) => {
                  const heightPercent = Math.max(15, Math.min(100, Math.round((item.totalDailyVisitors / 1000) * 100)));
                  return (
                    <div key={item.id} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        {item.totalDailyVisitors}
                      </span>
                      <div 
                        className="w-full bg-gradient-to-t from-red-600 to-brand-red rounded-t-md transition-all duration-500 shadow-sm group-hover:brightness-95"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-3 text-center truncate w-full" style={{ fontFamily: "'Lato', sans-serif" }}>
                        {item.name.replace(" Walk", "").replace(" Chapel", "")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Clean Muted Summary KPI Cards Grid (Moved Below Charts) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            
            {/* KPI 1: Total Foot Traffic */}
            <div className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                  Total Scheduled Volume
                </p>
                <h3 className="text-3xl font-black text-brand-red" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {totalAggregatedVisitors.toLocaleString()} <span className="text-xs text-gray-400 font-bold tracking-normal uppercase">pax</span>
                </h3>
              </div>
              <p className="text-[11px] text-gray-400 mt-4 pt-2 border-t border-gray-200">Gross timeline counts</p>
            </div>

            {/* KPI 2: Utilization Rate */}
            <div className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                  Utilization Threshold
                </p>
                <h3 className="text-3xl font-black text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {capacityUtilizationRate}%
                </h3>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 overflow-hidden">
                <div className="bg-gray-700 h-full rounded-full" style={{ width: `${capacityUtilizationRate}%` }} />
              </div>
            </div>

            {/* KPI 3: Avg Efficiency Rate */}
            <div className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                  Avg Efficiency Rate
                </p>
                <h3 className="text-3xl font-black text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
                  54%
                </h3>
              </div>
              <p className="text-[11px] text-gray-400 mt-4 pt-2 border-t border-gray-200">Optimal baseline index</p>
            </div>

            {/* KPI 4: Core Operation Trend */}
            <div className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                  Core System Trend
                </p>
                <h3 className="text-xl font-black text-emerald-600 tracking-tight" style={{ fontFamily: "'Lato', sans-serif" }}>
                  STABLE RUN
                </h3>
              </div>
              <p className="text-[11px] text-gray-400 mt-4 pt-2 border-t border-gray-200">Data streams healthy</p>
            </div>
          </div>

          {/* Bordered Data Table */}
          <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300 text-[10px] font-bold uppercase tracking-widest text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>
                    <th className="py-5 px-8">Attraction Name</th>
                    <th className="py-5 px-6">Total Daily Volume</th>
                    <th className="py-5 px-6">Avg Duration</th>
                    <th className="py-5 px-6">Primary Peak Window</th>
                    <th className="py-5 px-8 text-right">Trend State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {filteredData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-5 px-8 font-bold text-gray-900 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>{row.name}</td>
                      <td className="py-5 px-6 font-semibold text-gray-700">{row.totalDailyVisitors.toLocaleString()} pax</td>
                      <td className="py-5 px-6 text-gray-500">{row.averageStayTime}</td>
                      <td className="py-5 px-6 text-brand-red font-bold text-xs tracking-wide">{row.peakHourWindow}</td>
                      <td className="py-5 px-8 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                          row.trend === "rising" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          row.trend === "declining" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}>
                          {row.trend === "rising" ? "▲ Up" : row.trend === "declining" ? "▼ Down" : "● Stable"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}