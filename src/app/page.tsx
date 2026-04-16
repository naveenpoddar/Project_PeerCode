"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Assignments from "@/components/Assignments";
import ActivitySidebar from "@/components/ActivitySidebar";
import Navbar from "@/components/Navbar";
import LeaderboardModal from "@/components/LeaderboardModal";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar is kept as per previous request for stats/streaks */}
      <Navbar onOpenLeaderboard={() => setIsLeaderboardOpen(true)} />

      <div className="dashboard-container">
        {/* Left Section: Profile & GitHub */}
        <div className="sidebar-left">
          <Sidebar />
        </div>

        {/* Center Section: Assignments */}
        <div className="main-content">
          <Assignments />
        </div>

        {/* Right Section: Calendar & Live Classes */}
        <div className="sidebar-right">
          <ActivitySidebar />
        </div>
      </div>

      <AnimatePresence>
        {isLeaderboardOpen && (
          <LeaderboardModal onClose={() => setIsLeaderboardOpen(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}
