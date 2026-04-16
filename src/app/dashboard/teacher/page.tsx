'use client';

import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileSignature, Video as VideoIcon, Activity } from 'lucide-react';
import { dummyAssignments } from '@/data/assignments';

const classPerformanceData = [
  { month: 'Jan', average: 75, top: 95 },
  { month: 'Feb', average: 78, top: 96 },
  { month: 'Mar', average: 82, top: 98 },
  { month: 'Apr', average: 86, top: 100 },
];

const assignmentCompletion = [
  { name: 'Completed', value: 85 },
  { name: 'Pending', value: 15 },
];
const COLORS = ['#10b981', '#f3f4f6'];

export default function TeacherDashboard() {
  return (
    <div className="dash-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-box t-logo">T</div>
          <span className="brand-name">Teacher Portal</span>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/teacher" className="nav-item active">Overview</Link>
          <Link href="/leaderboard" className="nav-item">Leaderboard</Link>
          <Link href="/assignments" className="nav-item">Manage Assignments</Link>
          <Link href="/live-class" className="nav-item">Host Live Class</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="welcome">
            <h1>Teacher Dashboard 📊</h1>
            <p>Manage your classes, assignments, and monitor student performance.</p>
          </div>
          <div className="top-actions">
            <button className="new-class-btn">+ Create New Plan</button>
            <div className="profile-img">
              <img src="https://i.pravatar.cc/150?u=teacher" alt="Teacher" />
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon b-purple"><Users size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Total Students</span>
              <span className="stat-val">124</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon b-blue"><FileSignature size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Active Assignments</span>
              <span className="stat-val">{dummyAssignments.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon b-green"><Activity size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Class Average</span>
              <span className="stat-val">86%</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon b-orange"><VideoIcon size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Live Sessions</span>
              <span className="stat-val">12</span>
            </div>
          </div>
        </div>

        <div className="charts-grid has-3d">
          <div className="chart-card is-3d">
            <h2>Class Performance Trend</h2>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={classPerformanceData}>
                  <defs>
                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="average" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card is-3d">
            <h2>Assignment Completion Rate</h2>
            <div className="chart-wrapper pie-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assignmentCompletion}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {assignmentCompletion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                <div className="legend-item"><span className="dot d-green"></span> Completed (85%)</div>
                <div className="legend-item"><span className="dot d-gray"></span> Pending (15%)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-section">
          <div className="section-header">
            <h2>Recent Submissions</h2>
            <Link href="/assignments" className="view-all">View All Assignments →</Link>
          </div>
          <div className="assignments-list">
            <div className="submission-row">
              <div className="s-avatar">
                <img src="https://i.pravatar.cc/150?u=rahul" alt="Rahul" />
              </div>
              <div className="s-info">
                <h3>Rahul Sharma submitted "Two Sum"</h3>
                <p>Score: 45/45 • 2 hours ago</p>
              </div>
              <Link href="/dashboard/teacher/submissions/rahul123" className="s-btn">Review Code</Link>
            </div>
            <div className="submission-row">
              <div className="s-avatar">
                <img src="https://i.pravatar.cc/150?u=priya" alt="Priya" />
              </div>
              <div className="s-info">
                <h3>Priya Singh submitted "Reverse a String"</h3>
                <p>Score: 40/40 • 4 hours ago</p>
              </div>
              <Link href="/dashboard/teacher/submissions/priya123" className="s-btn">Review Code</Link>
            </div>
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
        .logo-box { width: 32px; height: 32px; color: white; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: bold; }
        .t-logo { background: #8b5cf6; }
        .brand-name { font-weight: 700; color: #111827; font-size: 1.1rem; }
        
        .side-nav { display: flex; flex-direction: column; gap: 0.5rem; }
        .nav-item { padding: 0.75rem 1rem; border-radius: 8px; color: #6b7280; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
        .nav-item:hover { background: #f3f4f6; color: #111827; }
        .nav-item.active { background: #f5f3ff; color: #7c3aed; }

        /* Main Content */
        .main-content {
          flex: 1; padding: 2.5rem; overflow-y: auto;
        }
        .top-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .top-actions { display: flex; align-items: center; gap: 1rem; }
        .welcome h1 { font-size: 1.75rem; font-weight: 700; color: #111827; margin-bottom: 0.25rem; }
        .welcome p { color: #6b7280; font-size: 0.95rem; }
        .new-class-btn { background: #8b5cf6; color: white; border: none; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background 0.2s; }
        .new-class-btn:hover { background: #7c3aed; }
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
        .pie-chart-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
        .pie-legend { display: flex; gap: 1.5rem; font-size: 0.85rem; color: #4b5563; font-weight: 500; position: absolute; bottom: 0; }
        .legend-item { display: flex; align-items: center; gap: 0.4rem; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .d-green { background: #10b981; }
        .d-gray { background: #f3f4f6; }

        .bottom-section h2 { font-size: 1.25rem; font-weight: 600; color: #111827; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .view-all { font-size: 0.9rem; color: #8b5cf6; text-decoration: none; font-weight: 500; }
        .view-all:hover { text-decoration: underline; }

        .assignments-list { display: flex; flex-direction: column; gap: 1rem; }
        .submission-row { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem; }
        .s-avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid #e5e7eb; flex-shrink: 0; }
        .s-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .s-info { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
        .s-info h3 { font-size: 0.95rem; font-weight: 600; color: #111827; }
        .s-info p { font-size: 0.8rem; color: #6b7280; }
        .s-btn { background: white; border: 1.5px solid #e5e7eb; color: #374151; padding: 0.45rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .s-btn:hover { border-color: #8b5cf6; color: #8b5cf6; }

        @media (max-width: 768px) {
          .dash-root { flex-direction: column; }
          .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #e5e7eb; padding: 1rem; }
          .brand { margin-bottom: 1rem; }
          .charts-grid { grid-template-columns: 1fr; }
          .main-content { padding: 1.5rem; }
          .top-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
      `}</style>
    </div>
  );
}
