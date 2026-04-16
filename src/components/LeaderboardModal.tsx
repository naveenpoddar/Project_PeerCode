"use client";

import React from "react";
import { X, Award, TrendingUp, Medal } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardModalProps {
  onClose: () => void;
}

const leaderboardData = [
  { rank: 1, name: "Arsh Gupta", xp: 12450, streak: 45, avatar: "Arsh" },
  { rank: 2, name: "Sneha Patel", xp: 11200, streak: 32, avatar: "Sneha" },
  { rank: 3, name: "Rohan Verma", xp: 9800, streak: 28, avatar: "Rohan" },
  { rank: 4, name: "Me (Naveen)", xp: 1240, streak: 12, avatar: "Naveen", isMe: true },
  { rank: 5, name: "Priya Singh", xp: 8500, streak: 15, avatar: "Priya" },
  { rank: 6, name: "Aman Jain", xp: 7200, streak: 8, avatar: "Aman" },
];

export default function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-white border border-gray-100 rounded-[32px] shadow-2xl shadow-gray-200/50 overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 bg-gradient-to-br from-indigo-50 to-white border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Medal size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Leaderboard</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Ranking</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[55vh] overflow-y-auto custom-scrollbar">
           <div className="space-y-1">
              {leaderboardData.map((user) => (
                <div 
                  key={user.rank}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    user.isMe ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    user.isMe ? 'text-white' :
                    user.rank === 1 ? 'text-yellow-500 bg-yellow-50' :
                    user.rank === 2 ? 'text-gray-400 bg-gray-50' :
                    user.rank === 3 ? 'text-orange-500 bg-orange-50' :
                    'text-gray-300'
                  }`}>
                    {user.rank}
                  </div>
                  
                  <div className="relative">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`} 
                      className={`w-10 h-10 rounded-full ${user.isMe ? 'bg-white/20' : 'bg-gray-100'}`}
                      alt={user.name}
                    />
                    {user.rank <= 3 && (
                      <div className="absolute -top-1 -right-1">
                        <Award size={14} className={user.rank === 1 ? 'text-yellow-500' : 'text-gray-400'} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm ${user.isMe ? 'text-white' : 'text-gray-900'}`}>{user.name}</h4>
                    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter ${user.isMe ? 'text-white/70' : 'text-gray-400'}`}>
                       <TrendingUp size={10} className={user.isMe ? 'text-white' : 'text-emerald-500'} />
                       <span>{user.streak} DAY STREAK</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-black text-sm ${user.isMe ? 'text-white' : 'text-indigo-600'}`}>{user.xp.toLocaleString()}</div>
                    <div className={`text-[8px] font-black uppercase tracking-widest ${user.isMe ? 'text-white/60' : 'text-gray-400'}`}>XP</div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex justify-center">
           <button className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">
              View All Rankings
           </button>
        </div>
      </motion.div>
    </div>
  );
}
