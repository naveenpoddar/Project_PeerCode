'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom, generateRoomCode, checkRoomExists } from '@/lib/firebase';

export default function LiveClassPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [roomTitle, setRoomTitle] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!userName.trim()) { setError('Please enter your name'); return; }
    if (!roomTitle.trim()) { setError('Please enter a room title'); return; }
    setError('');
    setLoading(true);
    try {
      const code = generateRoomCode();
      await createRoom(code, userName.trim());
      await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: code, title: roomTitle.trim(), createdBy: userName.trim() }),
      });
      router.push(`/live-class/room/${code}?name=${encodeURIComponent(userName.trim())}`);
    } catch {
      setError('Failed to create room. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!userName.trim()) { setError('Please enter your name'); return; }
    if (!joinCode.trim()) { setError('Please enter a room code'); return; }
    setError('');
    setLoading(true);
    try {
      const exists = await checkRoomExists(joinCode.trim().toUpperCase());
      if (!exists) { setError('Room not found. Check the code and try again.'); setLoading(false); return; }
      router.push(`/live-class/room/${joinCode.trim().toUpperCase()}?name=${encodeURIComponent(userName.trim())}`);
    } catch {
      setError('Failed to join room. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lobby-root">
      {/* Left panel — branding */}
      <aside className="lobby-aside">
        <div className="aside-inner">
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M23 7L16 12L23 17V7Z" fill="currentColor"/><rect x="1" y="5" width="15" height="14" rx="2" fill="currentColor"/></svg>
            </div>
            <span className="brand-name">LiveClass</span>
          </div>

          <div className="aside-hero">
            <h1>Watch together,<br/>learn together.</h1>
            <p>Stream YouTube videos in perfect sync. Every play, pause, and seek — shared in real time.</p>
          </div>

          <ul className="feature-list">
            {[
              { icon: '⚡', label: 'Real-time sync across all peers' },
              { icon: '💬', label: 'Built-in live chat' },
              { icon: '🔗', label: 'Share with a simple link' },
              { icon: '🎮', label: 'Full playback controls synced' },
            ].map((f) => (
              <li key={f.label} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right panel — form */}
      <main className="lobby-main">
        <div className="form-card">
          <div className="form-header">
            <h2>{tab === 'create' ? 'Create a room' : 'Join a room'}</h2>
            <p>{tab === 'create' ? 'Set up a new watch session for your peers.' : 'Enter the room code to jump in.'}</p>
          </div>

          {/* Tab switcher */}
          <div className="tab-row">
            <button className={`tab-btn${tab === 'create' ? ' active' : ''}`} onClick={() => { setTab('create'); setError(''); }}>
              Create Room
            </button>
            <button className={`tab-btn${tab === 'join' ? ' active' : ''}`} onClick={() => { setTab('join'); setError(''); }}>
              Join Room
            </button>
          </div>

          {/* Fields */}
          <div className="fields">
            <div className="field">
              <label htmlFor="userName">Your display name</label>
              <input
                id="userName"
                type="text"
                placeholder="e.g. Kunal"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (tab === 'create' ? handleCreate() : handleJoin())}
              />
            </div>

            {tab === 'create' && (
              <div className="field">
                <label htmlFor="roomTitle">Room title</label>
                <input
                  id="roomTitle"
                  type="text"
                  placeholder="e.g. React Hooks Deep Dive"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  maxLength={120}
                />
              </div>
            )}

            {tab === 'join' && (
              <div className="field">
                <label htmlFor="joinCode">Room code</label>
                <input
                  id="joinCode"
                  type="text"
                  placeholder="e.g. ABC123"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                  maxLength={6}
                  className="mono"
                />
              </div>
            )}

            {error && <div className="error-box">{error}</div>}

            <button className="submit-btn" onClick={tab === 'create' ? handleCreate : handleJoin} disabled={loading}>
              {loading ? <span className="spinner" /> : tab === 'create' ? 'Create Room →' : 'Join Room →'}
            </button>
          </div>

          <p className="footer-note">
            {tab === 'create'
              ? <>Already have a code? <button className="link-btn" onClick={() => { setTab('join'); setError(''); }}>Join a room</button></>
              : <>Want to start fresh? <button className="link-btn" onClick={() => { setTab('create'); setError(''); }}>Create a room</button></>
            }
          </p>
        </div>
      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lobby-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #f8f9fb;
        }

        /* ── Left panel ── */
        .lobby-aside {
          width: 420px;
          flex-shrink: 0;
          background: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2.5rem;
        }
        .aside-inner { max-width: 320px; width: 100%; }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 3rem;
        }
        .brand-icon {
          width: 36px; height: 36px;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: white;
        }
        .brand-icon svg { width: 18px; height: 18px; }
        .brand-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
        }

        .aside-hero { margin-bottom: 2.5rem; }
        .aside-hero h1 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          line-height: 1.25;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }
        .aside-hero p {
          color: rgba(255,255,255,0.65);
          font-size: 0.95rem;
          line-height: 1.65;
        }

        .feature-list { list-style: none; display: flex; flex-direction: column; gap: 0.85rem; }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(255,255,255,0.75);
          font-size: 0.875rem;
        }
        .feature-icon {
          width: 32px; height: 32px;
          background: rgba(255,255,255,0.12);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        /* ── Right panel ── */
        .lobby-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .form-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }

        .form-header { margin-bottom: 1.75rem; }
        .form-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.03em;
          margin-bottom: 0.375rem;
        }
        .form-header p {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
        }

        /* ── Tabs ── */
        .tab-row {
          display: flex;
          background: #f3f4f6;
          border-radius: 10px;
          padding: 3px;
          margin-bottom: 1.75rem;
          gap: 3px;
        }
        .tab-btn {
          flex: 1;
          padding: 0.55rem 1rem;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          font-family: inherit;
        }
        .tab-btn.active {
          background: white;
          color: #111827;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          font-weight: 600;
        }
        .tab-btn:hover:not(.active) { color: #374151; }

        /* ── Fields ── */
        .fields { display: flex; flex-direction: column; gap: 1.1rem; }
        .field { display: flex; flex-direction: column; gap: 0.4rem; }
        .field label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.01em;
        }
        .field input {
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.7rem 0.9rem;
          font-size: 0.925rem;
          color: #111827;
          outline: none;
          transition: all 0.18s;
          font-family: inherit;
          width: 100%;
        }
        .field input.mono { font-family: 'SF Mono', 'Fira Code', monospace; letter-spacing: 0.15em; }
        .field input::placeholder { color: #9ca3af; }
        .field input:focus {
          border-color: #4f46e5;
          background: white;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
        }

        .error-box {
          background: #fef2f2;
          border: 1.5px solid #fecaca;
          color: #dc2626;
          border-radius: 8px;
          padding: 0.6rem 0.875rem;
          font-size: 0.84rem;
          font-weight: 500;
        }

        .submit-btn {
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 0.8rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: all 0.18s;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }
        .submit-btn:hover:not(:disabled) { background: #4338ca; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(79,70,229,0.35); }
        .submit-btn:active:not(:disabled) { transform: none; }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .footer-note {
          text-align: center;
          font-size: 0.82rem;
          color: #9ca3af;
          margin-top: 1.25rem;
        }
        .link-btn {
          background: none;
          border: none;
          color: #4f46e5;
          font-weight: 600;
          cursor: pointer;
          font-size: inherit;
          font-family: inherit;
          padding: 0;
        }
        .link-btn:hover { text-decoration: underline; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .lobby-root { flex-direction: column; }
          .lobby-aside { width: 100%; padding: 2rem 1.5rem; }
          .aside-hero h1 { font-size: 1.5rem; }
          .feature-list { display: none; }
          .aside-hero { margin-bottom: 1rem; }
          .brand { margin-bottom: 1.5rem; }
          .lobby-main { padding: 1.5rem 1rem; }
          .form-card { padding: 1.75rem 1.25rem; }
        }
      `}</style>
    </div>
  );
}
