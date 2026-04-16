"use client";

import React from "react";
import { Star } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="flex flex-col items-center">
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-48 h-48 rounded-full bg-gray-200 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden mb-6">
           <svg 
             viewBox="0 0 24 24" 
             className="w-32 h-32 text-gray-400"
             fill="none" 
             stroke="currentColor" 
             strokeWidth="1" 
             strokeLinecap="round" 
             strokeLinejoin="round"
           >
             <circle cx="12" cy="8" r="5" />
             <path d="M20 21a8 8 0 0 0-16 0" />
           </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">Naveen Poddar</h2>
        <p className="text-lg text-gray-500 font-medium">Software Developer</p>
      </div>

      {/* GitHub Repository Cards */}
      <div className="w-full flex flex-col gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="github-mini-card flex gap-4 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                 <Star size={14} className="text-yellow-400 fill-yellow-400" />
                 <Star size={14} className="text-yellow-400" />
              </div>
              <h4 className="text-xs font-bold text-gray-900 truncate">naveenpoddar/CursorScript</h4>
              <p className="text-[10px] text-gray-500 mt-1 leading-snug line-clamp-3">
                CursorScript is a high-performance, interpreted programming language designed for...
              </p>
            </div>
            
            {/* Mini Bar Chart Mockup */}
            <div className="flex items-end gap-1 h-12 w-12 shrink-0">
               <div className="w-2 bg-pink-600 rounded-t-sm" style={{ height: '60%' }}></div>
               <div className="w-2 bg-yellow-400 rounded-t-sm" style={{ height: '100%' }}></div>
               <div className="w-2 bg-blue-500 rounded-t-sm" style={{ height: '80%' }}></div>
               <div className="w-2 bg-red-500 rounded-t-sm" style={{ height: '40%' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
