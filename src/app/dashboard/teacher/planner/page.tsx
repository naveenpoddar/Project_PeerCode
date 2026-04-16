'use client';

import Link from 'next/link';
import { Sparkles, Calendar, Plus, BookOpen, AlertCircle, PlayCircle, Grid } from 'lucide-react';
import { useState } from 'react';

const initialModules = [
  { id: 1, week: 'Week 1', title: 'Introduction to Data Structures', status: 'completed', topics: ['Arrays', 'Strings', 'Complexity Analysis'] },
  { id: 2, week: 'Week 2', title: 'Advanced Data Structures', status: 'active', topics: ['Hash Maps', 'Linked Lists', 'Two Pointers'] },
  { id: 3, week: 'Week 3', title: 'Algorithms Fundamentals', status: 'locked', topics: ['Recursion', 'Sorting', 'Binary Search'] },
  { id: 4, week: 'Week 4', title: 'Dynamic Programming', status: 'locked', topics: ['Memoization', 'Tabulation', 'Knapsack'] },
];

const aiSuggestions = [
  {
    id: 1,
    type: 'warning',
    title: 'Class Average Dropped',
    desc: 'The average score on "Hash Maps" assignments is 64%. Students are struggling with time complexity.',
    action: 'Schedule Review Session',
  },
  {
    id: 2,
    type: 'idea',
    title: 'Generate Practice Set',
    desc: 'Based on upcoming Week 3 Algorithms, generate 5 foundational Recursion problems to prepare the class.',
    action: 'Auto-Generate Quiz',
  },
  {
    id: 3,
    type: 'success',
    title: 'High Engagement Detected',
    desc: 'Students completed the Arrays module 20% faster than average. Consider advancing the curriculum pace loosely.',
    action: 'Review Curriculum Pace',
  }
];

export default function CoursePlanner() {
  const [modules, setModules] = useState(initialModules);

  return (
    <div className="dash-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-box t-logo">T</div>
          <span className="brand-name">Teacher Portal</span>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/teacher" className="nav-item">Overview</Link>
          <Link href="/leaderboard" className="nav-item">Leaderboard</Link>
          <Link href="/dashboard/teacher/planner" className="nav-item active">Course Planner</Link>
          <Link href="/assignments" className="nav-item">Manage Assignments</Link>
          <Link href="/live-class" className="nav-item">Host Live Class</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="welcome">
            <h1>Course Planner & AI Intelligence 🧠</h1>
            <p>Design your curriculum timeline and receive data-driven teaching suggestions.</p>
          </div>
          <div className="top-actions">
            <button className="new-class-btn"><Plus size={16} /> New Module</button>
            <div className="profile-img">
              <img src="https://i.pravatar.cc/150?u=teacher" alt="Teacher" />
            </div>
          </div>
        </header>

        <div className="planner-grid">
          {/* Timeline Planner */}
          <div className="curriculum-col">
            <div className="section-head">
              <h2><Calendar size={20} /> Curriculum Timeline</h2>
              <span className="badge-draft">Fall 2026 Cohort</span>
            </div>
            
            <div className="timeline-container">
              {modules.map((mod, index) => (
                <div key={mod.id} className={`timeline-card ${mod.status}`}>
                  <div className="timeline-line"></div>
                  <div className="card-inner hover-3d">
                    <div className="t-head">
                      <span className="week-label">{mod.week}</span>
                      <span className={`status-pill pill-${mod.status}`}>
                        {mod.status === 'completed' && 'Completed'}
                        {mod.status === 'active' && 'Current'}
                        {mod.status === 'locked' && 'Upcoming'}
                      </span>
                    </div>
                    <h3>{mod.title}</h3>
                    <ul className="topic-list">
                      {mod.topics.map(t => <li key={t}><Grid size={12}/> {t}</li>)}
                    </ul>
                    <div className="card-actions">
                      <button className="ghost-btn"><BookOpen size={14}/> Edit Material</button>
                      {mod.status === 'active' && <button className="start-btn"><PlayCircle size={14}/> Start Live Class</button>}
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="add-module-btn hover-3d">
                <Plus size={20} />
                <span>Add Missing Syllabus Module</span>
              </button>
            </div>
          </div>

          {/* AI Suggestion Panel */}
          <div className="ai-col">
            <div className="glass-panel ai-panel">
              <div className="ai-header">
                <h2><Sparkles size={20} className="sparkle-icon" /> PeerCode AI Suggestions</h2>
                <p>Real-time insights based on student metrics.</p>
              </div>

              <div className="suggestions-list">
                {aiSuggestions.map(s => (
                  <div key={s.id} className={`suggestion-card type-${s.type}`}>
                    <div className="s-icon">
                      {s.type === 'warning' && <AlertCircle size={20} />}
                      {s.type === 'idea' && <Sparkles size={20} />}
                      {s.type === 'success' && <BookOpen size={20} />}
                    </div>
                    <div className="s-content">
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>
                      <button className="action-btn">{s.action}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mini Overview */}
            <div className="glass-panel mini-stats">
              <h3>Curriculum Progress</h3>
              <div className="progress-bar-bg">
                <div className="progress-fill" style={{width: '35%'}}></div>
              </div>
              <p>35% of modules completed. You are <strong>on track</strong> for the final exams on May 30th.</p>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .dash-root { min-height: 100vh; background: #f8f9fb; font-family: 'Inter', system-ui, sans-serif; display: flex; }
        
        .sidebar { width: 260px; background: white; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; padding: 1.5rem; flex-shrink: 0; z-index: 10; }
        .brand { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 3rem; }
        .logo-box { width: 32px; height: 32px; color: white; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: bold; }
        .t-logo { background: #8b5cf6; }
        .brand-name { font-weight: 700; color: #111827; font-size: 1.1rem; }
        .side-nav { display: flex; flex-direction: column; gap: 0.5rem; }
        .nav-item { padding: 0.75rem 1rem; border-radius: 8px; color: #6b7280; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
        .nav-item:hover { background: #f3f4f6; color: #111827; }
        .nav-item.active { background: #f5f3ff; color: #7c3aed; }

        .main-content { flex: 1; padding: 2.5rem; overflow-y: auto; }
        .top-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .top-actions { display: flex; align-items: center; gap: 1rem; }
        .welcome h1 { font-size: 1.75rem; font-weight: 700; color: #111827; margin-bottom: 0.25rem; }
        .welcome p { color: #6b7280; font-size: 0.95rem; }
        .new-class-btn { display: flex; align-items: center; gap: 0.4rem; background: #8b5cf6; color: white; border: none; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background 0.2s; }
        .new-class-btn:hover { background: #7c3aed; }
        .profile-img { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 2px solid white; box-shadow: 0 0 0 2px #e5e7eb; flex-shrink: 0; }
        .profile-img img { width: 100%; height: 100%; object-fit: cover; }

        .planner-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; align-items: flex-start; }

        /* Timeline Column */
        .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .section-head h2 { display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: 700; color: #111827; }
        .badge-draft { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 0.3rem 0.8rem; border-radius: 99px; font-size: 0.8rem; font-weight: 600; color: #475569; }

        .timeline-container { display: flex; flex-direction: column; gap: 1.5rem; padding-left: 1rem; }
        .timeline-card { position: relative; }
        .timeline-line { position: absolute; left: -1rem; top: 2rem; bottom: -2rem; width: 2px; background: #e5e7eb; z-index: 1; }
        .timeline-card:last-child .timeline-line { display: none; }
        
        .card-inner { background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1.5rem; position: relative; z-index: 2; transition: all 0.3s; }
        .card-inner::before { content: ""; position: absolute; left: -1.4rem; top: 1.2rem; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 1px #cbd5e1; background: #cbd5e1; z-index: 3; }
        
        .timeline-card.completed .card-inner::before { background: #10b981; box-shadow: 0 0 0 1px #10b981; }
        .timeline-card.active .card-inner { border-color: #8b5cf6; box-shadow: 0 4px 20px rgba(139,92,246,0.1); }
        .timeline-card.active .card-inner::before { background: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,0.3); }

        .t-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .week-label { font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-pill { font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 99px; }
        .pill-completed { background: #d1fae5; color: #065f46; }
        .pill-active { background: #ede9fe; color: #5b21b6; }
        .pill-locked { background: #f1f5f9; color: #475569; }

        .card-inner h3 { font-size: 1.2rem; font-weight: 700; color: #111827; margin-bottom: 1rem; }
        .topic-list { list-style: none; display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
        .topic-list li { background: #f8f9fb; border: 1px solid #e5e7eb; color: #4b5563; font-size: 0.85rem; padding: 0.3rem 0.8rem; border-radius: 6px; display: flex; align-items: center; gap: 0.4rem; }

        .card-actions { display: flex; gap: 1rem; }
        .ghost-btn { background: transparent; border: 1px solid #d1d5db; color: #374151; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s; }
        .ghost-btn:hover { background: #f3f4f6; }
        .start-btn { background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s; box-shadow: 0 4px 12px rgba(16,185,129,0.3); }
        .start-btn:hover { background: #059669; transform: translateY(-1px); }

        .add-module-btn { background: transparent; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 1.5rem; color: #64748b; font-weight: 600; font-size: 0.95rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; transition: all 0.2s; margin-top: 0.5rem; }
        .add-module-btn:hover { border-color: #8b5cf6; color: #8b5cf6; background: rgba(139,92,246,0.02); }

        /* 3D Hover Fx */
        .hover-3d { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease; }
        .hover-3d:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }

        /* AI Suggestions Column */
        .ai-col { display: flex; flex-direction: column; gap: 1.5rem; }
        .glass-panel { background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        
        .ai-panel { background: linear-gradient(180deg, #faf5ff 0%, #ffffff 100%); border: 1px solid #ddd6fe; box-shadow: 0 10px 30px rgba(139,92,246,0.1); }
        .ai-header { margin-bottom: 1.5rem; }
        .ai-header h2 { display: flex; align-items: center; gap: 0.5rem; font-size: 1.2rem; font-weight: 700; color: #5b21b6; margin-bottom: 0.25rem; }
        .sparkle-icon { color: #8b5cf6; fill: #8b5cf6; animation: pulseSparkle 2s infinite alternate; }
        @keyframes pulseSparkle { from { transform: scale(1); opacity: 0.8; } to { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 5px #8b5cf6); } }
        .ai-header p { font-size: 0.85rem; color: #6b7280; }

        .suggestions-list { display: flex; flex-direction: column; gap: 1rem; }
        .suggestion-card { display: flex; gap: 1rem; padding: 1.25rem; border-radius: 12px; background: white; border-left: 4px solid transparent; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: transform 0.2s; }
        .suggestion-card:hover { transform: translateX(4px); }
        .type-warning { border-color: #ef4444; }
        .type-warning .s-icon { color: #ef4444; background: #fee2e2; }
        .type-idea { border-color: #8b5cf6; }
        .type-idea .s-icon { color: #8b5cf6; background: #f3e8ff; }
        .type-success { border-color: #10b981; }
        .type-success .s-icon { color: #10b981; background: #d1fae5; }
        
        .s-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .s-content h4 { font-size: 0.95rem; font-weight: 700; color: #111827; margin-bottom: 0.3rem; }
        .s-content p { font-size: 0.85rem; color: #4b5563; line-height: 1.5; margin-bottom: 0.8rem; }
        .action-btn { background: transparent; border: 1px solid #d1d5db; color: #374151; font-weight: 600; font-size: 0.8rem; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        
        .type-warning .action-btn:hover { background: #ef4444; color: white; border-color: #ef4444; }
        .type-idea .action-btn:hover { background: #8b5cf6; color: white; border-color: #8b5cf6; }
        .type-success .action-btn:hover { background: #10b981; color: white; border-color: #10b981; }

        .mini-stats h3 { font-size: 1rem; font-weight: 600; color: #111827; margin-bottom: 1rem; }
        .progress-bar-bg { width: 100%; height: 8px; background: #e5e7eb; border-radius: 99px; margin-bottom: 0.8rem; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #8b5cf6); border-radius: 99px; }
        .mini-stats p { font-size: 0.85rem; color: #6b7280; line-height: 1.5; }

        @media (max-width: 1024px) {
          .planner-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .dash-root { flex-direction: column; }
          .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #e5e7eb; padding: 1rem; }
          .main-content { padding: 1.5rem; }
          .top-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
      `}</style>
    </div>
  );
}
