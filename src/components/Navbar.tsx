"use client";

import React from "react";
import { Flame, Trophy, Bell, Settings } from "lucide-react";

interface NavbarProps {
  onOpenLeaderboard: () => void;
}

export default function Navbar({ onOpenLeaderboard }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-12 border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="text-xl font-black tracking-tighter text-gray-900">
          PEERCODE
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Stats & Streak */}
        <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 transition-colors">
            <Flame size={16} className="text-orange-500 fill-orange-500" />
            <span className="text-orange-700">12 Days</span>
          </div>
          
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            <Trophy size={16} className="text-indigo-600" />
            <span className="text-indigo-900">1,240 XP</span>
          </div>
        </div>

        <button 
          onClick={onOpenLeaderboard}
          className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          Leaderboard
        </button>

        <div className="flex items-center gap-3 border-l border-gray-100 pl-6 ml-2">
          <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
            <Bell size={18} />
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
