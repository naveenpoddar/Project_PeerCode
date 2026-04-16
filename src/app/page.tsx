import Link from 'next/link';
import { BookOpen, Users, Video, Code, LayoutDashboard } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="home-root">
      <nav className="navbar">
        <div className="logo-section">
          <div className="logo-box">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M23 7L16 12L23 17V7Z" fill="currentColor"/>
              <rect x="1" y="5" width="15" height="14" rx="2" fill="currentColor"/>
            </svg>
          </div>
          <span className="brand-name">PeerCode</span>
        </div>
        <div className="nav-links">
          <Link href="/leaderboard" className="nav-link">Leaderboard</Link>
          <Link href="/live-class" className="nav-link">Live Classes</Link>
          <Link href="/assignments" className="nav-link">Assignments</Link>
        </div>
      </nav>

      <main className="main-content">
        <div className="hero-section">
          <h1>One platform.<br /><span className="gradient-text">Infinite learning.</span></h1>
          <p>Choose your portal to get started with intuitive dashboards, live collaborative classes, and instant code assignments.</p>
        </div>

        <div className="portal-cards">
          {/* Student Portal Card */}
          <Link href="/dashboard/student" className="portal-card student-card">
            <div className="card-bg-gradient student-bg"></div>
            <div className="card-icon-wrapper student-icon">
              <BookOpen size={32} />
            </div>
            <h2>Student Portal</h2>
            <p>Track your learning progress, complete assignments, check your grades, and join live classes.</p>
            <ul className="feature-list">
              <li><LayoutDashboard size={14} /> Analytics Dashboard</li>
              <li><Code size={14} /> Code Runner</li>
              <li><Video size={14} /> Join Live Classes</li>
            </ul>
            <div className="card-arrow">Go to Student Portal →</div>
          </Link>

          {/* Teacher Portal Card */}
          <Link href="/dashboard/teacher" className="portal-card teacher-card">
            <div className="card-bg-gradient teacher-bg"></div>
            <div className="card-icon-wrapper teacher-icon">
              <Users size={32} />
            </div>
            <h2>Teacher Portal</h2>
            <p>Create assignments, monitor class performance, grade submissions, and host synced video lectures.</p>
            <ul className="feature-list">
              <li><LayoutDashboard size={14} /> Class Insights</li>
              <li><BookOpen size={14} /> Assign Work</li>
              <li><Video size={14} /> Host Live Classes</li>
            </ul>
            <div className="card-arrow">Go to Teacher Portal →</div>
          </Link>
        </div>
      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        .home-root {
          min-height: 100vh;
          background: #0f172a;
          color: white;
          font-family: 'Inter', system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        /* Navbar */
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 3rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(15,23,42,0.8);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .logo-section { display: flex; align-items: center; gap: 0.75rem; }
        .logo-box {
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 8px;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          color: white;
        }
        .brand-name { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; }
        .nav-links { display: flex; gap: 1.5rem; }
        .nav-link {
          color: #94a3b8; text-decoration: none; font-size: 0.9rem; font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover { color: white; }

        /* Main */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 5rem;
          max-width: 700px;
        }
        .hero-section h1 {
          font-size: 4rem;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }
        .gradient-text {
          background: linear-gradient(135deg, #a78bfa, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-section p {
          font-size: 1.2rem;
          color: #94a3b8;
          line-height: 1.6;
        }

        /* Cards */
        .portal-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 2rem;
          width: 100%;
        }

        .portal-card {
          position: relative;
          background: #1e293b;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          text-decoration: none;
          color: white;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .portal-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,255,255,0.15);
        }
        
        .card-bg-gradient {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          transition: opacity 0.3s;
        }
        .portal-card:hover .card-bg-gradient { opacity: 0.3; }
        .student-bg { background: radial-gradient(circle at top right, #3b82f6, transparent 60%); }
        .teacher-bg { background: radial-gradient(circle at top right, #8b5cf6, transparent 60%); }

        .card-icon-wrapper {
          width: 64px; height: 64px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }
        .student-icon { background: rgba(59,130,246,0.2); color: #60a5fa; }
        .teacher-icon { background: rgba(139,92,246,0.2); color: #a78bfa; }

        .portal-card h2 {
          font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem;
          position: relative; z-index: 1;
        }
        .portal-card p {
          color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem;
          position: relative; z-index: 1; flex: 1;
        }

        .feature-list {
          list-style: none; display: flex; flex-direction: column; gap: 0.85rem;
          margin-bottom: 2.5rem; position: relative; z-index: 1;
        }
        .feature-list li {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.9rem; color: #cbd5e1;
        }

        .card-arrow {
          font-size: 0.95rem; font-weight: 600;
          display: flex; align-items: center; gap: 0.5rem;
          position: relative; z-index: 1;
        }
        .student-card .card-arrow { color: #60a5fa; }
        .teacher-card .card-arrow { color: #a78bfa; }

        @media (max-width: 768px) {
          .hero-section h1 { font-size: 2.5rem; }
          .hero-section p { font-size: 1rem; }
          .portal-cards { grid-template-columns: 1fr; }
          .navbar { padding: 1.25rem; flex-direction: column; gap: 1rem; }
        }
      `}</style>
    </div>
  );
}
