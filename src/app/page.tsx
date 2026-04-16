'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { BookOpen, Users, Code, Activity, Terminal, Network, Award } from 'lucide-react';

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false });

export default function HomePage() {
  return (
    <div className="home-root">
      {/* 3D Animated Background */}
      <ThreeBackground />

      <nav className="navbar">
        <div className="logo-section">
          <div className="logo-box">
            <Terminal size={20} className="logo-icon" />
          </div>
          <span className="brand-name text-gradient">PeerCode</span>
        </div>
        <div className="nav-links">
          <Link href="/leaderboard" className="nav-link">Leaderboard</Link>
          <Link href="/live-class" className="nav-link">Live Classes</Link>
          <Link href="/assignments" className="nav-link">Assignments</Link>
        </div>
      </nav>

      <main className="main-content">
        <div className="scene-3d">
          
          <div className="hero-section floating">
            <h1>The modern platform for<br /><span className="text-gradient">infinite interactive learning.</span></h1>
            <p>Step into the future of education. PeerCode delivers physical-feeling, interactive dashboards, synced video collaborative classes, and instant code assessments.</p>
          </div>

          {/* Data Statistics Section */}
          <div className="data-ribbon-3d floating-delayed">
            <div className="data-box">
              <span className="d-icon d-blue"><Users size={18}/></span>
              <div className="d-info">
                <span className="d-label">Active Users</span>
                <span className="d-val">142,850</span>
              </div>
            </div>
            <div className="data-separator"></div>
            <div className="data-box">
              <span className="d-icon d-purple"><Code size={18}/></span>
              <div className="d-info">
                <span className="d-label">Lines Evaluated</span>
                <span className="d-val">8.4M+</span>
              </div>
            </div>
            <div className="data-separator"></div>
            <div className="data-box">
              <span className="d-icon d-green"><Activity size={18}/></span>
              <div className="d-info">
                <span className="d-label">Avg. Latency</span>
                <span className="d-val">12ms</span>
              </div>
            </div>
          </div>

          <div className="portal-cards-3d">
            {/* Student Portal Card */}
            <Link href="/dashboard/student" className="portal-card student-card">
              <div className="card-face card-top s-top"></div>
              <div className="card-face card-side s-side"></div>
              <div className="card-inner">
                <div className="card-icon-wrapper student-icon">
                  <BookOpen size={28} />
                </div>
                <h2>Student Portal</h2>
                <p>Track your learning progress, complete assignments seamlessly, and check grades.</p>
                <ul className="feature-list">
                  <li><span className="f-dot s-dot"></span> Analytics Dashboard</li>
                  <li><span className="f-dot s-dot"></span> Advanced Code Runner</li>
                </ul>
                <div className="card-arrow s-arrow">Launch Space →</div>
              </div>
            </Link>

            {/* Peer-to-Peer Coding Card */}
            <Link href="/live-class" className="portal-card peer-card">
              <div className="card-face card-top p-top"></div>
              <div className="card-face card-side p-side"></div>
              <div className="card-inner">
                <div className="card-icon-wrapper peer-icon">
                  <Network size={28} />
                </div>
                <h2>Peer-to-Peer</h2>
                <p>Collaborate in real-time. Join pair-programming sessions and synced whiteboards.</p>
                <ul className="feature-list">
                  <li><span className="f-dot p-dot"></span> Real-time P2P Sync</li>
                  <li><span className="f-dot p-dot"></span> Multiplayer Editor</li>
                </ul>
                <div className="card-arrow p-arrow">Find Peers →</div>
              </div>
            </Link>

            {/* Teacher Portal Card */}
            <Link href="/dashboard/teacher" className="portal-card teacher-card">
              <div className="card-face card-top t-top"></div>
              <div className="card-face card-side t-side"></div>
              <div className="card-inner">
                <div className="card-icon-wrapper teacher-icon">
                  <Users size={28} />
                </div>
                <h2>Teacher Portal</h2>
                <p>Create assignments, deploy AI grading, and host live classes.</p>
                <ul className="feature-list">
                  <li><span className="f-dot t-dot"></span> Auto-Grade AI</li>
                  <li><span className="f-dot t-dot"></span> Host Live Video</li>
                </ul>
                <div className="card-arrow t-arrow">Management →</div>
              </div>
            </Link>

            {/* Leaderboard Card */}
            <Link href="/leaderboard" className="portal-card leaderboard-card">
              <div className="card-face card-top l-top"></div>
              <div className="card-face card-side l-side"></div>
              <div className="card-inner">
                <div className="card-icon-wrapper leaderboard-icon">
                  <Award size={28} />
                </div>
                <h2>Leaderboard</h2>
                <p>Compete globally. Track your XP, rise through ranks, and earn badges.</p>
                <ul className="feature-list">
                  <li><span className="f-dot l-dot"></span> Global Rankings</li>
                  <li><span className="f-dot l-dot"></span> Earn Achievements</li>
                </ul>
                <div className="card-arrow l-arrow">View Ranks →</div>
              </div>
            </Link>
          </div>

        </div>
      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        .home-root {
          min-height: 100vh;
          background: transparent;
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          position: relative;
        }

        /* Navbar */
        .navbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5rem 4rem; border-bottom: 1px solid rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.2); backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 50; box-shadow: 0 4px 30px rgba(0,0,0,0.03);
        }
        .logo-section { display: flex; align-items: center; gap: 0.75rem; }
        .logo-box {
          background: linear-gradient(135deg, #4f46e5, #ec4899); border-radius: 12px;
          width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
          color: white; box-shadow: 0 4px 10px rgba(79,70,229,0.3);
        }
        .brand-name { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.02em; }
        .text-gradient { background: linear-gradient(135deg, #4f46e5, #db2777); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .nav-links { display: flex; gap: 2rem; }
        .nav-link { color: #475569; text-decoration: none; font-size: 0.95rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: 8px; transition: all 0.2s; }
        .nav-link:hover { background: rgba(79,70,229,0.08); color: #4f46e5; }

        /* 3D Main Scene */
        .main-content {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          padding: 5rem 2rem; max-width: 1500px; margin: 0 auto; width: 100%;
          position: relative; z-index: 10; perspective: 1800px;
        }

        .scene-3d {
          display: flex; flex-direction: column; align-items: center; width: 100%;
          transform-style: preserve-3d;
        }

        .floating { animation: floatY 6s ease-in-out infinite; }
        .floating-delayed { animation: floatY 6s ease-in-out infinite 1.5s; }
        @keyframes floatY { 0%, 100% { transform: translateZ(20px) translateY(0); } 50% { transform: translateZ(20px) translateY(-15px); } }

        .hero-section { text-align: center; margin-bottom: 4rem; max-width: 800px; }
        .hero-section h1 { font-size: 4.5rem; line-height: 1.1; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 1.5rem; color: #0f172a; text-shadow: 0 10px 30px rgba(255,255,255,0.8); }
        .hero-section p { font-size: 1.25rem; color: #475569; line-height: 1.6; font-weight: 500; text-shadow: 0 5px 15px rgba(255,255,255,1); }

        /* 3D Data Ribbon */
        .data-ribbon-3d {
          display: flex; align-items: center; gap: 2rem; background: rgba(255,255,255,0.7);
          padding: 1rem 3rem; border-radius: 20px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.8); backdrop-filter: blur(10px);
          margin-bottom: 6rem;
          transform: rotateX(10deg) translateZ(40px); transform-style: preserve-3d;
          transition: transform 0.5s;
        }
        .data-ribbon-3d:hover { transform: rotateX(0deg) translateZ(60px); }
        .data-box { display: flex; align-items: center; gap: 1rem; }
        .d-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .d-blue { background: #eff6ff; color: #3b82f6; }
        .d-purple { background: #faf5ff; color: #a855f7; }
        .d-green { background: #f0fdf4; color: #22c55e; }
        .d-info { display: flex; flex-direction: column; }
        .d-label { font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.2rem; }
        .d-val { font-size: 1.4rem; font-weight: 800; color: #0f172a; font-family: 'SF Mono', monospace; }
        .data-separator { width: 1px; height: 40px; background: #cbd5e1; }

        /* 3D Cards */
        .portal-cards-3d {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; width: 100%;
          transform-style: preserve-3d;
        }

        .portal-card {
          position: relative; text-decoration: none; color: #0f172a;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        /* 3D Angles */
        .student-card     { transform: rotateX(15deg) rotateY(-20deg); z-index: 1; }
        .peer-card        { transform: rotateX(10deg) rotateY(-5deg) translateY(-10px); z-index: 3; }
        .teacher-card     { transform: rotateX(10deg) rotateY(5deg) translateY(-10px); z-index: 4; }
        .leaderboard-card { transform: rotateX(15deg) rotateY(20deg); z-index: 2; }
        
        .portal-card:hover { transform: rotateX(0deg) rotateY(0deg) translateZ(60px); z-index: 50; }

        .card-inner {
          background: rgba(255,255,255,0.85); border: 1px solid #e2e8f0; border-radius: 20px;
          padding: 2rem 1.5rem; transform: translateZ(20px);
          box-shadow: 0 30px 50px -10px rgba(0,0,0,0.1);
          backdrop-filter: blur(12px);
          position: relative; z-index: 2; height: 100%;
          display: flex; flex-direction: column;
        }
        .peer-card .card-inner        { box-shadow: 0 40px 60px -10px rgba(6, 182, 212, 0.15); border-color: rgba(6, 182, 212, 0.3); }
        .teacher-card .card-inner     { box-shadow: 10px 30px 50px -10px rgba(0,0,0,0.1); }
        .leaderboard-card .card-inner { box-shadow: 20px 40px 60px -10px rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.3); }
        
        .portal-card:hover .card-inner { box-shadow: 0 30px 80px -15px rgba(0,0,0,0.2); }

        /* 3D Edges */
        .card-face { position: absolute; background: rgba(241, 245, 249, 0.8); border: 1px solid #cbd5e1; border-radius: 20px; }
        .card-top { top: -12px; left: 0; width: 100%; height: 12px; transform: rotateX(90deg); transform-origin: bottom; border-radius: 20px 20px 0 0; }
        .card-side { top: 0; left: -12px; width: 12px; height: 100%; transform: rotateY(-90deg); transform-origin: right; border-radius: 20px 0 0 20px; }
        
        /* Specific edges based on rotation */
        .t-top { top: -8px; height: 8px; }
        .t-side { display: none; }
        
        .p-top { top: -8px; height: 8px; }
        .p-side { display: none; } 
        
        .l-top { top: -12px; left: 0; width: 100%; height: 12px; transform: rotateX(90deg); transform-origin: bottom; }
        .l-side { top: 0; left: auto; right: -12px; width: 12px; height: 100%; transform: rotateY(90deg); transform-origin: left; border-radius: 0 20px 20px 0; }

        .card-icon-wrapper {
          width: 52px; height: 52px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem; transform: translateZ(30px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .student-icon     { background: linear-gradient(135deg, #3b82f6, #60a5fa); color: white; }
        .peer-icon        { background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; }
        .teacher-icon     { background: linear-gradient(135deg, #8b5cf6, #a78bfa); color: white; }
        .leaderboard-icon { background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; }

        .portal-card h2 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.6rem; transform: translateZ(25px); }
        .portal-card p { color: #475569; font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.5rem; flex: 1; font-weight: 500; transform: translateZ(20px); }

        .feature-list { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; margin-bottom: 2rem; transform: translateZ(25px); }
        .feature-list li { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #1e293b; font-weight: 600; }
        .f-dot { width: 8px; height: 8px; border-radius: 50%; }
        .s-dot { background: #3b82f6; box-shadow: 0 0 8px #3b82f6; }
        .p-dot { background: #06b6d4; box-shadow: 0 0 8px #06b6d4; }
        .t-dot { background: #8b5cf6; box-shadow: 0 0 8px #8b5cf6; }
        .l-dot { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }

        .card-arrow { font-size: 0.85rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.5rem; padding-bottom: 0.4rem; border-bottom: 2px solid transparent; transition: all 0.2s; transform: translateZ(30px); width: fit-content; }
        .s-arrow { color: #2563eb; }
        .p-arrow { color: #0891b2; }
        .t-arrow { color: #7c3aed; }
        .l-arrow { color: #d97706; }
        .portal-card:hover .s-arrow { border-color: #2563eb; }
        .portal-card:hover .p-arrow { border-color: #0891b2; }
        .portal-card:hover .t-arrow { border-color: #7c3aed; }
        .portal-card:hover .l-arrow { border-color: #d97706; }

        @media (max-width: 1200px) {
          .portal-cards-3d { grid-template-columns: 1fr 1fr; gap: 3rem; max-width: 800px; transform: none; }
          .portal-card { transform: none !important; }
          .card-side, .card-top, .t-top, .t-side, .p-top, .l-side, .l-top { display: none; }
        }
        @media (max-width: 768px) {
          .portal-cards-3d { grid-template-columns: 1fr; }
          .hero-section h1 { font-size: 2.5rem; }
          .hero-section p { font-size: 1rem; }
          .navbar { padding: 1.25rem; flex-direction: column; gap: 1rem; }
          .data-separator { display: none; }
          .data-ribbon-3d { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
