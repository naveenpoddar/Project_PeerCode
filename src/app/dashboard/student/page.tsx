'use client';

import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BookOpen, CheckCircle, Clock, Trophy } from 'lucide-react';
import { dummyAssignments } from '@/data/assignments';

const activityData = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 3 },
  { name: 'Wed', hours: 1.5 },
  { name: 'Thu', hours: 4 },
  { name: 'Fri', hours: 2.5 },
  { name: 'Sat', hours: 5 },
  { name: 'Sun', hours: 3.5 },
];

const performanceData = [
  { name: 'Week 1', score: 65 },
  { name: 'Week 2', score: 72 },
  { name: 'Week 3', score: 85 },
  { name: 'Week 4', score: 92 },
];

export default function StudentDashboard() {
  return (
    <div className="dash-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-box">S</div>
          <span className="brand-name">Student Portal</span>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/student" className="nav-item active">Dashboard</Link>
          <Link href="/leaderboard" className="nav-item">Leaderboard</Link>
          <Link href="/assignments" className="nav-item">My Assignments</Link>
          <Link href="/live-class" className="nav-item">Join Live Class</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="welcome">
            <h1>Welcome back, Kunal! 👋</h1>
            <p>You have 2 pending assignments due this week.</p>
          </div>
          <div className="profile-img">
            <img src="https://i.pravatar.cc/150?u=kunal" alt="Kunal" />
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon b-blue"><BookOpen size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Active Courses</span>
              <span className="stat-val">4</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon b-green"><CheckCircle size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Completed Tasks</span>
              <span className="stat-val">28</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon b-purple"><Clock size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Hours Learned</span>
              <span className="stat-val">42h</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon b-orange"><Trophy size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Average Score</span>
              <span className="stat-val">88%</span>
            </div>
          </div>
        </div>

        <div className="charts-grid has-3d">
          <div className="chart-card is-3d">
            <h2>Weekly Learning Hours</h2>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card is-3d">
            <h2>Performance Growth</h2>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} domain={[0, 100]} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                  <Line type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={3} dot={{r: 4, fill: '#ec4899'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="bottom-section">
            <h2>Pending Assignments</h2>
            <div className="assignments-list">
              {dummyAssignments.map(a => (
                <div key={a.id} className="assignment-row">
                  <div className="a-info">
                    <h3>{a.title}</h3>
                    <p>{a.testCases.length * a.marksPerTestCase} Marks • Needs Completion</p>
                  </div>
                  <Link href={`/assignments/${a.id}`} className="a-btn">Solve Now</Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bottom-section streak-section">
            <div className="streak-header">
              <h2>Learning Streak 🔥</h2>
              <span className="streak-count">12 Days</span>
            </div>
            <div className="calendar-grid">
              {Array.from({ length: 30 }).map((_, i) => {
                const isStreak = i > 17;
                const hit = isStreak || Math.random() > 0.5;
                return (
                  <div 
                    key={i} 
                    className={`cal-day ${hit ? 'active' : ''} ${isStreak ? 'streak' : ''}`}
                    title={hit ? 'Studied' : 'No activity'}
                  ></div>
                );
              })}
            </div>
            <p className="streak-caption">You're on a roll! Keep learning to maintain your streak.</p>
          </div>
        </div>
      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .dash-root {
          min-height: 100vh;
          background: #f8f9fb;
          font-family: 'Inter', system-ui, sans-serif;
          display: flex;
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex; flex-direction: column;
          padding: 1.5rem; flex-shrink: 0;
        }
        .brand { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 3rem; }
        .logo-box { width: 32px; height: 32px; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: bold; }
        .brand-name { font-weight: 700; color: #111827; font-size: 1.1rem; }
        
        .side-nav { display: flex; flex-direction: column; gap: 0.5rem; }
        .nav-item { padding: 0.75rem 1rem; border-radius: 8px; color: #6b7280; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
        .nav-item:hover { background: #f3f4f6; color: #111827; }
        .nav-item.active { background: #eff6ff; color: #2563eb; }

        /* Main Content */
        .main-content {
          flex: 1; padding: 2.5rem; overflow-y: auto;
        }
        .top-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .welcome h1 { font-size: 1.75rem; font-weight: 700; color: #111827; margin-bottom: 0.25rem; }
        .welcome p { color: #6b7280; font-size: 0.95rem; }
        .profile-img { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 2px solid white; box-shadow: 0 0 0 2px #e5e7eb; flex-shrink: 0; }
        .profile-img img { width: 100%; height: 100%; object-fit: cover; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 1rem; }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
        .b-blue { background: rgba(59,130,246,0.15); color: #3b82f6; }
        .b-green { background: rgba(16,185,129,0.15); color: #10b981; }
        .b-purple { background: rgba(139,92,246,0.15); color: #8b5cf6; }
        .b-orange { background: rgba(249,115,22,0.15); color: #f97316; }
        .stat-info { display: flex; flex-direction: column; gap: 0.2rem; }
        .stat-label { font-size: 0.8rem; color: #6b7280; font-weight: 500; }
        .stat-val { font-size: 1.4rem; font-weight: 700; color: #111827; }

        .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin-bottom: 3.5rem; }
        .charts-grid.has-3d { perspective: 1200px; padding-bottom: 2rem; }
        
        .chart-card { background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid #e5e7eb; position: relative; }
        .chart-card.is-3d {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform: rotateX(15deg) rotateY(-5deg) translateZ(10px);
          box-shadow: 20px 25px 30px rgba(0,0,0,0.08);
          border: 1px solid #ddd6fe;
        }
        .chart-card.is-3d:hover {
          transform: rotateX(5deg) rotateY(0deg) translateZ(40px);
          box-shadow: 10px 15px 40px rgba(0,0,0,0.12);
        }
        .chart-card.is-3d::before {
          content: ""; position: absolute; top: 0; left: -10px; width: 10px; height: 100%;
          background: #e2e8f0; transform: rotateY(-90deg); transform-origin: right; border-radius: 8px 0 0 8px;
        }
        .chart-card.is-3d::after {
          content: ""; position: absolute; bottom: -10px; left: 0; width: 100%; height: 10px;
          background: #cbd5e1; transform: rotateX(-90deg); transform-origin: top; border-radius: 0 0 8px 8px;
        }
        
        .chart-card.is-3d h2 { transform: translateZ(30px); font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; color: #111827; }
        .chart-card.is-3d .chart-wrapper { transform: translateZ(40px); background: rgba(255,255,255,0.7); border-radius: 8px; padding: 1rem; }
        
        .chart-card:not(.is-3d) h2 { font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; color: #111827; }
        .chart-wrapper { height: 260px; }

        .bottom-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        .bottom-section h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #111827; }
        .assignments-list { display: flex; flex-direction: column; gap: 1rem; }
        .assignment-row { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; }
        .a-info h3 { font-size: 1rem; font-weight: 600; color: #111827; margin-bottom: 0.25rem; }
        .a-info p { font-size: 0.85rem; color: #6b7280; }
        .a-btn { background: #4f46e5; color: white; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: background 0.2s; white-space: nowrap; }
        .a-btn:hover { background: #4338ca; }

        .streak-section { background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; }
        .streak-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .streak-header h2 { margin-bottom: 0; }
        .streak-count { background: #fffbeb; color: #d97706; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 8px; font-size: 0.9rem; }
        .calendar-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem; margin-bottom: 1rem; }
        .cal-day { aspect-ratio: 1; border-radius: 6px; background: #f3f4f6; transition: transform 0.2s; }
        .cal-day:hover { transform: scale(1.1); }
        .cal-day.active { background: #93c5fd; }
        .cal-day.streak { background: #3b82f6; box-shadow: 0 0 8px rgba(59,130,246,0.4); }
        .streak-caption { font-size: 0.85rem; color: #6b7280; line-height: 1.5; text-align: center; margin-top: auto; }

        @media (max-width: 1024px) {
          .bottom-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .dash-root { flex-direction: column; }
          .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #e5e7eb; padding: 1rem; }
          .brand { margin-bottom: 1rem; }
          .charts-grid { grid-template-columns: 1fr; }
          .main-content { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
