"use client";

import React from "react";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

const calendarData = [
  { day: 1, activity: 20 },
  { day: 2, activity: 40 },
  { day: 3, activity: 10 },
  { day: 4, activity: 80 },
  { day: 5, activity: 5 },
  { day: 6, activity: 0 },
  { day: 7, activity: 15 },
  { day: 8, activity: 60 },
  { day: 9, activity: 45 },
  { day: 10, activity: 90 },
  { day: 11, activity: 10 },
  { day: 12, activity: 30 },
  { day: 13, activity: 50 },
  { day: 14, activity: 0 },
  { day: 15, activity: 25 },
  { day: 16, activity: 70 },
  { day: 17, activity: 35 },
  { day: 18, activity: 85 },
  { day: 19, activity: 60 },
  { day: 20, activity: 10 },
  { day: 21, activity: 40 },
];

const liveSessions = [
  {
    id: 1,
    title: "Practice DSA in Java with OOP Concepts",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Advanced System Design Patterns",
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Frontend Optimization Deep Dive",
    image:
      "https://images.unsplash.com/photo-1550063873-ab792950096b?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function ActivitySidebar() {
  return (
    <div className="flex flex-col gap-10">
      {/* Activity Calendar Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Activity</h3>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {calendarData.map((data, idx) => (
            <div
              key={idx}
              className="relative aspect-square bg-gray-50 border border-gray-100 rounded-lg overflow-hidden group cursor-pointer hover:border-indigo-200 transition-all shadow-sm"
            >
              <div
                className={`absolute bottom-0 left-0 right-0 transition-all duration-700 ${
                  data.activity > 70
                    ? "bg-emerald-500"
                    : data.activity > 30
                      ? "bg-yellow-400"
                      : "bg-indigo-400"
                }`}
                style={{ height: `${data.activity}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/60 text-[8px] font-black text-gray-900 transition-opacity">
                {data.activity}%
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-100"></div>

      {/* Live Sessions Section */}
      <div className="flex flex-col gap-6">
        <h3 className="font-bold text-gray-800">Live Sessions</h3>

        <div className="flex flex-col gap-8 pr-1 custom-scrollbar pb-8">
          {liveSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-[24px] overflow-hidden shadow-lg border border-gray-100 flex flex-col group shrink-0"
            >
              {/* Image Header - 16:9 Aspect Ratio */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                <img
                  src={session.image}
                  alt={session.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Minimal LIVE Badge */}
                <div className="absolute top-4 right-4 bg-red-500 text-[8px] font-black px-2 py-1 rounded-md text-white tracking-widest shadow-xl flex items-center gap-1.5 animate-pulse">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  LIVE
                </div>
              </div>

              <div className="p-5 flex flex-col gap-5">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
                    {session.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-widest">
                    Ongoing Session
                  </p>
                </div>

                <button className="w-full bg-[#ff3d3d] hover:bg-red-600 text-white font-bold py-3.5 rounded-2xl text-[9px] tracking-widest transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 group">
                  JOIN LIVE CLASS
                  <PlayCircle
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
