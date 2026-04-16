'use client';

import Link from 'next/link';
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Trophy, Flame, Star, Award, Zap } from 'lucide-react';
import BlackholeBackground from '@/components/BlackholeBackground';

// --- Dummy Data ---
const topThree = [
  { rank: 2, name: 'Priya Singh', score: '9,850', avatar: 'https://i.pravatar.cc/150?u=priya', trend: '+120' },
  { rank: 1, name: 'Kunal Kumar', score: '12,400', avatar: 'https://i.pravatar.cc/150?u=kunal', trend: '+450' },
  { rank: 3, name: 'Rahul Sharma', score: '8,900', avatar: 'https://i.pravatar.cc/150?u=rahul', trend: '+85' },
];

const remainingRanks = [
  { rank: 4, name: 'Amit Patel', score: '7,200', avatar: 'https://i.pravatar.cc/150?u=amit', language: 'JavaScript' },
  { rank: 5, name: 'Sara Khan', score: '6,850', avatar: 'https://i.pravatar.cc/150?u=sara', language: 'Python' },
  { rank: 6, name: 'John Doe', score: '6,100', avatar: 'https://i.pravatar.cc/150?u=johndoe', language: 'C++' },
  { rank: 7, name: 'Jane Smith', score: '5,900', avatar: 'https://i.pravatar.cc/150?u=janesmith', language: 'Java' },
  { rank: 8, name: 'Aarav Gupta', score: '5,400', avatar: 'https://i.pravatar.cc/150?u=aarav', language: 'JavaScript' },
];

const performanceActivity = [
  { day: 'Mon', score: 400 },
  { day: 'Tue', score: 900 },
  { day: 'Wed', score: 1500 },
  { day: 'Thu', score: 2800 },
  { day: 'Fri', score: 4000 },
  { day: 'Sat', score: 8500 },
  { day: 'Sun', score: 12400 },
];

export default function LeaderboardPage() {
  return (
    <div className="lb-root">
      {/* Dynamic Background */}
      <BlackholeBackground />

      <nav className="lb-nav">
        <Link href="/" className="back-link">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        <div className="lb-logo">
          <Trophy className="text-yellow-400 drop-shadow-glow" size={24} />
          <h1>Global Rankings</h1>
        </div>
        <div style={{ width: 100 }}></div> {/* Spacer */}
      </nav>

      <main className="lb-main">
        {/* 3D Podium Section */}
        <section className="podium-section">
          <div className="podium-container">
            {topThree.map((user, idx) => {
              const isFirst = user.rank === 1;
              const isSecond = user.rank === 2;
              const podiumClass = isFirst ? 'podium-first' : isSecond ? 'podium-second' : 'podium-third';
              const delay = isFirst ? '0.2s' : isSecond ? '0.4s' : '0.6s';

              return (
                <div key={user.rank} className={`podium-card ${podiumClass}`} style={{ animationDelay: delay }}>
                  {isFirst && <div className="crown">👑</div>}
                  <div className="avatar-3d">
                    <img src={user.avatar} alt={user.name} />
                    <div className="rank-badge">{user.rank}</div>
                  </div>
                  <h3>{user.name}</h3>
                  <div className="score-pill">
                    <Flame size={14} className={isFirst ? 'flame-gold' : ''} /> {user.score}
                  </div>
                  <div className="trend">{user.trend} this week</div>
                  
                  {/* 3D Base */}
                  <div className="podium-base">
                    <div className="base-top"></div>
                    <div className="base-front"></div>
                    <div className="base-side"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Split Layout */}
        <div className="lb-bottom-grid">
          
          {/* Table */}
          <div className="glass-panel ranking-list">
            <h2 className="panel-title"><Star size={18} /> Hall of Fame</h2>
            <div className="list-header">
              <span>Rank</span>
              <span>Developer</span>
              <span>Top Skill</span>
              <span>Score</span>
            </div>
            {remainingRanks.map((u) => (
              <div key={u.rank} className="list-row hover-3d">
                <div className="row-rank">#{u.rank}</div>
                <div className="row-user">
                  <img src={u.avatar} alt={u.name} />
                  <span>{u.name}</span>
                </div>
                <div className="row-skill">
                  <span className="skill-badge">{u.language}</span>
                </div>
                <div className="row-score">{u.score}</div>
              </div>
            ))}
          </div>

          {/* Stats & Charts */}
          <div className="glass-panel stats-panel">
            <h2 className="panel-title"><Zap size={18} /> Your Velocity</h2>
            <div className="stats-cards">
              <div className="s-card hover-3d">
                <span className="s-label">Current Rank</span>
                <span className="s-val text-gradient-gold">#1</span>
              </div>
              <div className="s-card hover-3d">
                <span className="s-label">Total XP</span>
                <span className="s-val">12,400</span>
              </div>
            </div>

            <div className="chart-container">
              <h3 className="chart-title">XP Growth (Current Week)</h3>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceActivity}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                    <RechartsTooltip 
                      contentStyle={{ background: 'rgba(17, 24, 39, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                      itemStyle={{ color: '#f59e0b' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        .lb-root {
          min-height: 100vh;
          background: #0f172a;
          color: white;
          font-family: 'Inter', system-ui, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient 3D Lighting Background */
        .bg-orbs {
          position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0;
        }
        .orb {
          position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.4;
          animation: float 10s infinite ease-in-out alternate;
        }
        .orb-1 {
          width: 600px; height: 600px; background: #6366f1; top: -100px; left: -100px;
        }
        .orb-2 {
          width: 500px; height: 500px; background: #f59e0b; bottom: -100px; right: -100px;
          animation-delay: -5s;
        }
        @keyframes float {
          100% { transform: translateY(50px) scale(1.1); }
        }

        /* Nav */
        .lb-nav {
          position: relative; z-index: 10;
          height: 70px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(15,23,42,0.4); backdrop-filter: blur(20px);
        }
        .back-link { display: flex; align-items: center; gap: 0.5rem; color: #9ca3af; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .back-link:hover { color: white; }
        .lb-logo { display: flex; align-items: center; gap: 0.75rem; }
        .lb-logo h1 { font-size: 1.25rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; background: linear-gradient(to right, #fcd34d, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .drop-shadow-glow { filter: drop-shadow(0 0 12px rgba(245,158,11,0.6)); }

        .lb-main {
          position: relative; z-index: 10; padding: 3rem 2rem; max-width: 1200px; margin: 0 auto;
        }

        /* 3D Isometric Podium */
        .podium-section { margin-bottom: 5rem; perspective: 1200px; display: flex; justify-content: center; }
        .podium-container {
          display: flex; align-items: flex-end; gap: 2rem; justify-content: center;
          transform: rotateX(10deg); transform-style: preserve-3d;
        }

        .podium-card {
          position: relative; display: flex; flex-direction: column; align-items: center;
          padding: 2rem 1.5rem 1rem; border-radius: 24px; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px); text-align: center; width: 220px;
          animation: popUp 0.8s backwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popUp {
          from { transform: translateY(100px) scale(0.8); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .podium-card:hover { transform: translateY(-15px) rotateY(-5deg); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }

        .podium-first { transform: translateY(-40px); background: linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.02)); border-color: rgba(245,158,11,0.3); z-index: 3; box-shadow: 0 0 40px rgba(245,158,11,0.15); border-width: 2px; }
        .podium-second { transform: translateY(10px); background: linear-gradient(135deg, rgba(148,163,184,0.15), rgba(148,163,184,0.02)); border-color: rgba(148,163,184,0.3); z-index: 2; height: 95%; }
        .podium-third { transform: translateY(30px); background: linear-gradient(135deg, rgba(180,83,9,0.15), rgba(180,83,9,0.02)); border-color: rgba(180,83,9,0.3); z-index: 1; height: 90%; }
        
        /* Interactive 3D hover scale */
        .podium-first:hover { transform: translateY(-55px) scale(1.05); }
        .podium-second:hover { transform: translateY(-5px) scale(1.05); }
        .podium-third:hover { transform: translateY(15px) scale(1.05); }

        .crown { position: absolute; top: -30px; font-size: 2.5rem; filter: drop-shadow(0 0 10px rgba(245,158,11,0.8)); animation: floatCrown 2s infinite alternate; }
        @keyframes floatCrown { from { transform: translateY(0); } to { transform: translateY(-10px); } }

        .avatar-3d { position: relative; margin-bottom: 1rem; perspective: 500px; }
        .avatar-3d img {
          width: 90px; height: 90px; border-radius: 50%; object-fit: cover;
          border: 3px solid rgba(255,255,255,0.2); transition: transform 0.3s;
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }
        .podium-first .avatar-3d img { border-color: #f59e0b; width: 110px; height: 110px; }
        .podium-second .avatar-3d img { border-color: #cbd5e1; }
        .podium-third .avatar-3d img { border-color: #d97706; }
        
        .avatar-3d:hover img { transform: translateZ(20px) rotateY(10deg); }

        .rank-badge {
          position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%);
          background: #1e293b; color: white; width: 28px; height: 28px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.9rem; border: 2px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        .podium-first .rank-badge { background: #f59e0b; color: #78350f; border-color: #fef3c7; }

        .podium-card h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: -0.01em; }
        .podium-first h3 { font-size: 1.4rem; color: #fef3c7; }

        .score-pill {
          background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
          padding: 0.3rem 0.8rem; border-radius: 99px; display: flex; align-items: center; gap: 0.4rem;
          font-weight: 600; font-family: 'SF Mono', monospace; font-size: 0.95rem; margin-bottom: 0.5rem;
        }
        .podium-first .score-pill { background: rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.4); color: #fcd34d; }
        .flame-gold { color: #f59e0b; filter: drop-shadow(0 0 5px #f59e0b); }
        .trend { font-size: 0.8rem; color: #10b981; font-weight: 500; }

        /* 3D Box Base beneath cards */
        .podium-base {
          position: absolute; bottom: -20px; left: 5%; width: 90%; height: 20px;
          transform-style: preserve-3d; z-index: -1;
        }
        .base-top { position: absolute; inset: 0; background: rgba(255,255,255,0.1); transform: rotateX(90deg) translateZ(10px); border-radius: 12px; }
        .base-front { position: absolute; inset: 0; background: rgba(255,255,255,0.05); transform: translateZ(10px); border-radius: 12px; }
        
        /* Bottom Grid */
        .lb-bottom-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;
        }

        .glass-panel {
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 2rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          position: relative; overflow: hidden;
        }
        .glass-panel::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        }

        .panel-title {
          display: flex; align-items: center; gap: 0.6rem; font-size: 1.25rem;
          font-weight: 700; color: white; margin-bottom: 2rem;
        }

        /* 3D Hover Classes */
        .hover-3d { transition: transform 0.2s ease, background 0.2s ease; }
        .hover-3d:hover { transform: translateZ(10px) translateY(-2px); background: rgba(255,255,255,0.05); }

        /* Table */
        .ranking-list { display: flex; flex-direction: column; }
        .list-header {
          display: grid; grid-template-columns: 0.5fr 2fr 1fr 1fr;
          padding: 0 1rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.85rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .list-row {
          display: grid; grid-template-columns: 0.5fr 2fr 1fr 1fr;
          align-items: center; padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.03);
          border-radius: 12px; cursor: default;
        }
        .list-row:last-child { border-bottom: none; }
        
        .row-rank { font-weight: 700; color: #64748b; font-size: 1.1rem; }
        .row-user { display: flex; align-items: center; gap: 1rem; }
        .row-user img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.1); }
        .row-user span { font-weight: 600; color: #f3f4f6; }
        .skill-badge { background: rgba(99,102,241,0.15); color: #818cf8; border: 1px solid rgba(99,102,241,0.3); padding: 0.2rem 0.6rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600; }
        .row-score { font-family: 'SF Mono', monospace; font-weight: 600; color: #e2e8f0; }

        /* Stats Panel */
        .stats-cards {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2.5rem;
        }
        .s-card {
          background: rgba(15,23,42,0.4); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;
        }
        .s-label { font-size: 0.9rem; color: #9ca3af; font-weight: 500; }
        .s-val { font-size: 2rem; font-weight: 800; font-family: 'SF Mono', monospace; }
        .text-gradient-gold { background: linear-gradient(to right, #fcd34d, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        .chart-container { flex: 1; display: flex; flex-direction: column; }
        .chart-title { font-size: 0.95rem; color: #9ca3af; font-weight: 500; margin-bottom: 1rem; }
        .chart-box { flex: 1; min-height: 220px; }

        /* Responsive */
        @media (max-width: 1024px) {
          .lb-bottom-grid { grid-template-columns: 1fr; }
          .podium-container { gap: 1rem; }
          .podium-card { width: 180px; }
        }
        @media (max-width: 768px) {
          .podium-section { overflow-x: auto; padding-bottom: 2rem; justify-content: flex-start; }
          .podium-container { margin: 0 auto; transform: none; align-items: flex-end; }
          .podium-first { transform: translateY(-20px); }
          .podium-first:hover { transform: translateY(-20px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
