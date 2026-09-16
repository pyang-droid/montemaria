"use client";

import StaffNav from "./StaffNav";
import Link from "next/link";

export default function StaffDashboardPage() {
  const tools = [
    {
      title: "QR Scanner",
      description: "Process visitor entry and exit logs.",
      icon: "⛶", // Clean unicode frame instead of an emoji
      href: "/staffdashboard/qrcode",
    },
    {
      title: "Entry Validation",
      description: "Approve or reject credentials manually.",
      icon: "✓",
      href: "/staffdashboard/entry-validation",
    },
    {
      title: "Capacity Control",
      description: "Update attraction headcounts in real-time.",
      icon: "◱", // Clean geometric unicode
      href: "/staffdashboard/capacity-monitoring",
    },
  ];

  return (
    <>
      <StaffNav />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Dashboard Header */}
          <div className="mb-12 border-b border-gray-200 pb-6">
            <h1
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Operations <span className="text-brand-red italic">Overview</span>
            </h1>
            <p 
              className="text-gray-500 text-sm tracking-wide uppercase"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Active Session: Terminal 04
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Today's Scans</p>
              <p className="text-3xl font-medium text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>247</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Total Load</p>
              <p className="text-3xl font-medium text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>65%</p>
            </div>
            <div className="hidden md:block bg-white rounded-lg p-5 border border-gray-200">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Recent Entries</p>
              <p className="text-3xl font-medium text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>34 <span className="text-sm text-gray-400">/hr</span></p>
            </div>
          </div>

          {/* Core Tools Grid */}
          <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Operational Tools
          </h2>
          
          <div className="grid md:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group block"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-brand-red hover:shadow-sm transition-all h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded bg-gray-50 text-gray-700 flex items-center justify-center text-xl mb-4 group-hover:bg-brand-red group-hover:text-white transition-colors">
                      {tool.icon}
                    </div>
                    <h3
                      className="text-lg font-bold text-gray-900 mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {tool.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
                      {tool.description}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-brand-red transition-colors" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Launch →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}