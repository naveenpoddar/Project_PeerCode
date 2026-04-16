import Link from 'next/link';
import { dummyAssignments } from '@/data/assignments';
import { ArrowLeft, BookOpen, ExternalLink, Code2, Play, Sparkles, Terminal } from 'lucide-react';

export default function AssignmentsPage() {
  return (
    <div className="assignments-root">
      
      {/* Dynamic Background */}
      <div className="bg-pattern"></div>
      
      <nav className="a-nav">
        <Link href="/dashboard/student" className="back-link">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        <div className="a-logo">
          <Terminal className="text-indigo-600 drop-shadow-glow" size={24} />
          <h1>Algorithm Arena</h1>
        </div>
        <div style={{ width: 150 }}></div>
      </nav>

      <div className="main-layout">
        
        {/* Left Column: Assignments */}
        <div className="challenges-section">
          <header className="section-header">
            <h2><Code2 size={24} className="text-indigo-600" /> Coding Challenges</h2>
            <p>Complete challenges to earn XP and level up your data structures knowledge.</p>
          </header>

          <div className="assignments-grid">
            {dummyAssignments.map((assignment) => (
              <div key={assignment.id} className="assignment-card hover-glow">
                <div className="card-content">
                  <h3>{assignment.title}</h3>
                  <p>{assignment.description.substring(0, 110)}...</p>
                  
                  <div className="card-meta">
                    <span className="badge">
                      <Terminal size={14}/> {assignment.testCases.length} Test Cases
                    </span>
                    <span className="badge badge-marks">
                      <Sparkles size={14}/> {assignment.testCases.length * assignment.marksPerTestCase} Marks
                    </span>
                  </div>
                </div>
                
                <Link href={`/assignments/${assignment.id}`} className="solve-btn">
                  <Play size={16} /> Solve Challenge
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Learning Resources */}
        <aside className="resources-section">
          <header className="section-header">
            <h2><BookOpen size={22} className="text-pink-500" /> Learning Resources</h2>
            <p>Master algorithms visually before coding them.</p>
          </header>

          <div className="resources-list">
            
            {/* QuantaLearn Featured Resource */}
            <a 
              href="https://quantalearn.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="resource-card featured-resource hover-glow"
            >
              <div className="featured-badge">Featured Partner</div>
              <div className="r-icon">
                <div className="cube-spinner"></div>
              </div>
              <div className="r-content">
                <h3>QUANTALEARN</h3>
                <p>The Future of Learning. Visualize data structures and algorithms in real-time 3D environments.</p>
              </div>
              <div className="r-action">
                <span>Launch Visualizer</span> <ExternalLink size={16} />
              </div>
            </a>

            {/* Other Dummy Resources */}
            <a href="#" className="resource-card standard-resource hover-glow">
              <div className="r-icon bg-blue"><BookOpen size={24} color="#3b82f6" /></div>
              <div className="r-content">
                <h3>Docs: Big-O Notation</h3>
                <p>Read the official guide to time and space complexity analysis.</p>
              </div>
            </a>
            
          </div>
        </aside>

      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        .assignments-root {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', system-ui, sans-serif;
          color: #0f172a;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient Background */
        .bg-pattern {
          position: absolute; inset: 0; z-index: 0;
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 30px 30px; opacity: 0.4;
          mask-image: linear-gradient(to bottom, black, transparent);
          -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent);
          pointer-events: none;
        }

        /* Nav */
        .a-nav {
          position: relative; z-index: 10;
          height: 70px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 3rem; border-bottom: 1px solid rgba(0,0,0,0.05);
          background: rgba(255,255,255,0.8); backdrop-filter: blur(12px);
        }
        .back-link { display: flex; align-items: center; gap: 0.5rem; color: #64748b; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: color 0.2s; }
        .back-link:hover { color: #0f172a; }
        .a-logo { display: flex; align-items: center; gap: 0.75rem; }
        .a-logo h1 { font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; background: linear-gradient(to right, #4f46e5, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        /* Layout */
        .main-layout {
          position: relative; z-index: 10;
          max-width: 1400px; margin: 0 auto; padding: 4rem 2rem;
          display: grid; grid-template-columns: 2fr 1.1fr; gap: 4rem;
          align-items: start;
        }

        .section-header { margin-bottom: 2.5rem; }
        .section-header h2 { display: flex; align-items: center; gap: 0.75rem; font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .section-header p { color: #64748b; font-size: 1.05rem; }
        .text-indigo-600 { color: #4f46e5; }
        .text-pink-500 { color: #ec4899; }

        /* Left: Assignments */
        .assignments-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;
        }

        .assignment-card {
          background: white; border: 1px solid #e2e8f0; border-radius: 20px;
          display: flex; flex-direction: column; overflow: hidden;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .hover-glow:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -10px rgba(79,70,229,0.15);
          border-color: #c7d2fe;
        }

        .card-content { padding: 2rem; flex: 1; }
        .card-content h3 { font-size: 1.3rem; font-weight: 700; margin-bottom: 0.75rem; color: #0f172a; }
        .card-content p { color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; }
        
        .card-meta { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .badge { display: flex; align-items: center; gap: 0.4rem; background: #f1f5f9; color: #475569; padding: 0.4rem 0.8rem; border-radius: 99px; font-size: 0.8rem; font-weight: 600; }
        .badge-marks { background: #eff6ff; color: #3b82f6; }

        .solve-btn {
          display: flex; justify-content: center; align-items: center; gap: 0.5rem;
          background: #f8fafc; border-top: 1px solid #e2e8f0;
          padding: 1.2rem; text-decoration: none; color: #4f46e5;
          font-weight: 700; font-size: 1rem; transition: all 0.2s;
        }
        .assignment-card:hover .solve-btn { background: #4f46e5; color: white; }

        /* Right: Resources */
        .resources-list { display: flex; flex-direction: column; gap: 1.5rem; }

        .resource-card {
          text-decoration: none; border-radius: 20px; padding: 2rem;
          display: flex; flex-direction: column; gap: 1.5rem; position: relative;
          transition: all 0.3s ease;
        }
        
        .featured-resource {
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          color: white; border: 1px solid #4338ca;
          box-shadow: 0 10px 30px rgba(49, 46, 129, 0.3);
          overflow: hidden;
        }
        .featured-resource::before {
          content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .featured-resource:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(49, 46, 129, 0.5);
          border-color: #6366f1;
        }

        .featured-badge {
          position: absolute; top: 1.5rem; right: 1.5rem;
          background: rgba(236, 72, 153, 0.2); color: #fbcfe8;
          padding: 0.3rem 0.8rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(236,72,153,0.4);
        }

        .cube-spinner {
          width: 40px; height: 40px; background: linear-gradient(135deg, #ec4899, #8b5cf6);
          border-radius: 10px; animation: spin 4s linear infinite;
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .featured-resource .r-content h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; color: white; letter-spacing: 0.05em; }
        .featured-resource .r-content p { color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; }
        
        .r-action {
          display: flex; align-items: center; gap: 0.5rem; color: #a5b4fc;
          font-weight: 700; font-size: 0.95rem; margin-top: 0.5rem;
        }
        .featured-resource:hover .r-action { color: white; }

        /* Standard Resource */
        .standard-resource {
          background: white; border: 1px solid #e2e8f0; border-radius: 20px;
          flex-direction: row; align-items: center; padding: 1.5rem;
        }
        .standard-resource:hover { border-color: #93c5fd; box-shadow: 0 10px 20px rgba(59,130,246,0.1); }
        .r-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .bg-blue { background: #eff6ff; }
        .standard-resource .r-content h3 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.3rem; }
        .standard-resource .r-content p { font-size: 0.85rem; color: #64748b; line-height: 1.4; }

        @media (max-width: 1024px) {
          .main-layout { grid-template-columns: 1fr; gap: 4rem; }
        }
        @media (max-width: 768px) {
          .a-nav { padding: 0 1.5rem; }
        }
      `}</style>
    </div>
  );
}
