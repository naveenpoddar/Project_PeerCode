"use client";

import React from "react";
import { Play } from "lucide-react";

const assignments = [
  {
    title: "Practice DSA in Java with OOP Concepts",
    desc: "asidagsvjda d aa aaa adamndasd asdadkans dad asd ad as nd dadas"
  },
  {
    title: "Practice DSA in Java with OOP Concepts",
    desc: "asidagsvjda d aa aaa adamndasd asdadkans dad asd ad as nd dadas"
  },
  {
    title: "Practice DSA in Java with OOP Concepts",
    desc: "asidagsvjda d aa aaa adamndasd asdadkans dad asd ad as nd dadas"
  },
  {
    title: "Practice DSA in Java with OOP Concepts",
    desc: "asidagsvjda d aa aaa adamndasd asdadkans dad asd ad as nd dadas"
  }
];

export default function Assignments() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Assginments Due</h2>
      
      <div className="flex flex-col gap-4">
        {assignments.map((item, idx) => (
          <div key={idx} className="assignment-card flex items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{item.title}</h3>
              <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
                {item.desc}
              </p>
            </div>
            
            <button className="w-14 h-14 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-lg shadow-emerald-200">
               <Play size={24} className="text-white fill-white translate-x-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
