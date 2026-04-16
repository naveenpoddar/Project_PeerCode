"use client";

import React from "react";
import { Play } from "lucide-react";
import Link from "next/link";

const assignments = [
  {
    id: 1,
    title: "Practice DSA in Java with OOP Concepts",
    desc: "Implement a Red-Black tree and solve 3 LeetCode problems related to advanced tree structures."
  },
  {
    id: 2,
    title: "CodeRacer: 1v1 Daily Match",
    desc: "Compete against peers in a real-time coding race. Improve your WPM and algorithmic accuracy."
  },
  {
    id: 3,
    title: "System Design: Scalability",
    desc: "Complete the module on Horizontal vs Vertical scaling and the CAP theorem."
  }
];

export default function Assignments() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Assginments Due</h2>
      
      <div className="flex flex-col gap-4">
        {assignments.map((item, idx) => (
          <Link 
            key={idx} 
            href="/assignments" 
            className="assignment-card flex items-center justify-between gap-6 transition-all hover:scale-[1.01] active:scale-[0.99] group"
          >
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
                {item.desc}
              </p>
            </div>
            
            <div className="w-14 h-14 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-lg shadow-emerald-200">
               <Play size={24} className="text-white fill-white translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
