import Link from 'next/link';
import { BookOpen, Users, Video, Code, LayoutDashboard, TrendingUp, Activity, Terminal } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="home-root">
      {/* 3D Ambient Light Background Elements */}
      <div className="bg-orbs">
        <div className="orb orb-t"></div>
        <div className="orb orb-r"></div>
        <div className="orb orb-b"></div>
      </div>

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
            <h1>The modern platform for<br /><span className="text-gradient">3D interactive learning.</span></h1>
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
              <div className="card-face card-top"></div>
              <div className="card-face card-side"></div>
              <div className="card-inner">
                <div className="card-icon-wrapper student-icon">
                  <BookOpen size={32} />
                </div>
                <h2>Student Portal</h2>
                <p>Track your learning progress, complete assignments seamlessly, check grades, and join live classes.</p>
                <ul className="feature-list">
                  <li><span className="f-dot s-dot"></span> Analytics Dashboard</li>
                  <li><span className="f-dot s-dot"></span> Advanced Code Runner</li>
                  <li><span className="f-dot s-dot"></span> Join Live Interactive Classes</li>
                </ul>
                <div className="card-arrow s-arrow">Launch Student Environment →</div>
              </div>
            </Link>

            {/* Teacher Portal Card */}
            <Link href="/dashboard/teacher" className="portal-card teacher-card">
              <div className="card-face card-top t-top"></div>
              <div className="card-face card-side t-side"></div>
              <div className="card-inner">
                <div className="card-icon-wrapper teacher-icon">
                  <Users size={32} />
                </div>
                <h2>Teacher Portal</h2>
                <p>Create assignments, deploy AI-assisted grading, and host highly synchronized video lectures.</p>
                <ul className="feature-list">
                  <li><span className="f-dot t-dot"></span> Class Insights & AI Reports</li>
                  <li><span className="f-dot t-dot"></span> Auto-Grade Assignments</li>
                  <li><span className="f-dot t-dot"></span> Host Live 3D Classes</li>
                </ul>
                <div className="card-arrow t-arrow">Launch Teacher Environment →</div>
              </div>
            </Link>
          </div>

        </div>
      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        .home-root {
          min-height: 100vh;
          background: #f1f5f9; /* Light Theme Background */
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          position: relative;
        }

        /* Ambient 3D Lights */
        .bg-orbs { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.6; animation: drift 15s infinite alternate ease-in-out; }
        .orb-t { width: 600px; height: 600px; background: #e0e7ff; top: -200px; left: -100px; }
        .orb-r { width: 500px; height: 500px; background: #fce7f3; top: 20%; right: -150px; animation-delay: -5s; }
        .orb-b { width: 700px; height: 700px; background: #e0f2fe; bottom: -200px; left: 20%; animation-delay: -10s; }
        @keyframes drift { 100% { transform: translate(50px, 50px) scale(1.1); } }

        /* Navbar */
        .navbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5rem 4rem; border-bottom: 1px solid rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.7); backdrop-filter: blur(20px);
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
          padding: 5rem 2rem; max-width: 1400px; margin: 0 auto; width: 100%;
          position: relative; z-index: 10; perspective: 1500px;
        }

        .scene-3d {
          display: flex; flex-direction: column; align-items: center; width: 100%;
          transform-style: preserve-3d;
        }

        .floating { animation: floatY 6s ease-in-out infinite; }
        .floating-delayed { animation: floatY 6s ease-in-out infinite 1.5s; }
        @keyframes floatY { 0%, 100% { transform: translateZ(20px) translateY(0); } 50% { transform: translateZ(20px) translateY(-15px); } }

        .hero-section { text-align: center; margin-bottom: 4rem; max-width: 800px; }
        .hero-section h1 { font-size: 4.5rem; line-height: 1.1; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 1.5rem; color: #0f172a; text-shadow: 0 10px 30px rgba(79,70,229,0.1); }
        .hero-section p { font-size: 1.25rem; color: #475569; line-height: 1.6; font-weight: 500; }

        /* 3D Data Ribbon */
        .data-ribbon-3d {
          display: flex; align-items: center; gap: 2rem; background: rgba(255,255,255,0.9);
          padding: 1rem 3rem; border-radius: 20px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,1); backdrop-filter: blur(10px);
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
        .data-separator { width: 1px; height: 40px; background: #e2e8f0; }

        /* 3D Cards */
        .portal-cards-3d {
          display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; width: 100%; max-width: 1000px;
          transform-style: preserve-3d;
        }

        .portal-card {
          position: relative; text-decoration: none; color: #0f172a;
          transform-style: preserve-3d;
          transform: rotateX(15deg) rotateY(-10deg);
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .teacher-card { transform: rotateX(15deg) rotateY(10deg); }
        
        .portal-card:hover { transform: rotateX(0deg) rotateY(0deg) translateZ(50px); }

        .card-inner {
          background: rgba(255,255,255,0.95); border: 1px solid #e2e8f0; border-radius: 24px;
          padding: 3.5rem 3rem; transform: translateZ(20px);
          box-shadow: -20px 30px 50px -10px rgba(0,0,0,0.15);
          backdrop-filter: blur(10px);
          position: relative; z-index: 2; height: 100%;
          display: flex; flex-direction: column;
        }
        .teacher-card .card-inner { box-shadow: 20px 30px 50px -10px rgba(0,0,0,0.15); }
        
        .portal-card:hover .card-inner { box-shadow: 0 30px 60px -15px rgba(0,0,0,0.2); }

        /* 3D Edges */
        .card-face { position: absolute; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 24px; box-shadow: inset 0 0 20px rgba(0,0,0,0.05); }
        .card-top { top: -15px; left: 0; width: 100%; height: 15px; transform: rotateX(90deg); transform-origin: bottom; border-radius: 24px 24px 0 0; }
        .card-side { top: 0; left: -15px; width: 15px; height: 100%; transform: rotateY(-90deg); transform-origin: right; border-radius: 24px 0 0 24px; }
        
        .t-top { top: -15px; left: 0; width: 100%; height: 15px; transform: rotateX(90deg); transform-origin: bottom; border-radius: 24px 24px 0 0; }
        .t-side { top: 0; left: auto; right: -15px; width: 15px; height: 100%; transform: rotateY(90deg); transform-origin: left; border-radius: 0 24px 24px 0; }

        .card-icon-wrapper {
          width: 72px; height: 72px; border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 2rem; transform: translateZ(30px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .student-icon { background: linear-gradient(135deg, #3b82f6, #60a5fa); color: white; }
        .teacher-icon { background: linear-gradient(135deg, #8b5cf6, #a78bfa); color: white; }

        .portal-card h2 { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; transform: translateZ(25px); }
        .portal-card p { color: #475569; font-size: 1rem; line-height: 1.6; margin-bottom: 2.5rem; flex: 1; font-weight: 500; transform: translateZ(20px); }

        .feature-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3rem; transform: translateZ(25px); }
        .feature-list li { display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem; color: #1e293b; font-weight: 600; }
        .f-dot { width: 8px; height: 8px; border-radius: 50%; }
        .s-dot { background: #3b82f6; box-shadow: 0 0 8px #3b82f6; }
        .t-dot { background: #8b5cf6; box-shadow: 0 0 8px #8b5cf6; }

        .card-arrow { font-size: 1rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid transparent; transition: all 0.2s; transform: translateZ(30px); width: fit-content; }
        .s-arrow { color: #2563eb; }
        .t-arrow { color: #7c3aed; }
        .portal-card:hover .s-arrow { border-color: #2563eb; }
        .portal-card:hover .t-arrow { border-color: #7c3aed; }

        @media (max-width: 1024px) {
          .portal-cards-3d { grid-template-columns: 1fr; gap: 3rem; transform: none; }
          .portal-card { transform: none !important; }
          .data-ribbon-3d { transform: none !important; flex-wrap: wrap; justify-content: center; }
          .card-side, .card-top, .t-top, .t-side { display: none; }
        }
        @media (max-width: 768px) {
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
