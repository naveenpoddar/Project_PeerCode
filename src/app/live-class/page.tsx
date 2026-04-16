'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom, generateRoomCode, checkRoomExists } from '@/lib/firebase';

export default function LiveClassPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!userName.trim()) { setError('Please enter your name'); return; }
    setError('');
    setLoading(true);
    try {
      const code = generateRoomCode();
      await createRoom(code, userName.trim());
      router.push(`/live-class/room/${code}?name=${encodeURIComponent(userName.trim())}`);
    } catch (e) {
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
    } catch (e) {
      setError('Failed to join room. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="live-lobby">
      {/* Ambient background */}
      <div className="lobby-bg" />

      <div className="lobby-card">
        {/* Logo / Title */}
        <div className="lobby-header">
          <div className="lobby-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 7L16 12L23 17V7Z" fill="currentColor" />
              <rect x="1" y="5" width="15" height="14" rx="2" fill="currentColor" />
            </svg>
          </div>
          <h1>Live Class</h1>
          <p>Watch YouTube videos in perfect sync with your peers</p>
        </div>

        {/* Tabs */}
        <div className="lobby-tabs">
          <button
            className={`lobby-tab${tab === 'create' ? ' active' : ''}`}
            onClick={() => { setTab('create'); setError(''); }}
          >
            Create Room
          </button>
          <button
            className={`lobby-tab${tab === 'join' ? ' active' : ''}`}
            onClick={() => { setTab('join'); setError(''); }}
          >
            Join Room
          </button>
        </div>

        {/* Form */}
        <div className="lobby-form">
          <div className="form-group">
            <label htmlFor="userName">Your Name</label>
            <input
              id="userName"
              type="text"
              placeholder="Enter your display name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (tab === 'create' ? handleCreate() : handleJoin())}
            />
          </div>

          {tab === 'join' && (
            <div className="form-group">
              <label htmlFor="joinCode">Room Code</label>
              <input
                id="joinCode"
                type="text"
                placeholder="E.g. ABC123"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                maxLength={6}
                style={{ letterSpacing: '0.25em', textTransform: 'uppercase' }}
              />
            </div>
          )}

          {error && <div className="lobby-error">{error}</div>}

          <button
            className="lobby-btn"
            onClick={tab === 'create' ? handleCreate : handleJoin}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : tab === 'create' ? (
              '✨ Create Room'
            ) : (
              '🚀 Join Room'
            )}
          </button>
        </div>

        <div className="lobby-features">
          <div className="feature-pill">🔴 Live sync</div>
          <div className="feature-pill">💬 Chat</div>
          <div className="feature-pill">⏩ Seekable</div>
          <div className="feature-pill">🎮 Controls synced</div>
        </div>
      </div>

      <style>{`
        .live-lobby {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif;
          padding: 1.5rem;
        }
        .lobby-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(236,72,153,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(6,182,212,0.07) 0%, transparent 60%);
          animation: bgPulse 8s ease-in-out infinite alternate;
        }
        @keyframes bgPulse {
          from { opacity: 0.7; }
          to   { opacity: 1; }
        }
        .lobby-card {
          position: relative;
          z-index: 1;
          background: rgba(15,15,25,0.85);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1);
        }
        .lobby-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .lobby-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: white;
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
        }
        .lobby-icon svg { width: 28px; height: 28px; }
        .lobby-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.375rem;
        }
        .lobby-header p {
          color: rgba(255,255,255,0.45);
          font-size: 0.9rem;
          margin: 0;
        }
        .lobby-tabs {
          display: flex;
          gap: 4px;
          background: rgba(255,255,255,0.04);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1.75rem;
        }
        .lobby-tab {
          flex: 1;
          padding: 0.6rem 1rem;
          border: none;
          border-radius: 9px;
          background: transparent;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lobby-tab.active {
          background: rgba(99,102,241,0.25);
          color: #a78bfa;
          box-shadow: 0 2px 8px rgba(99,102,241,0.2);
        }
        .lobby-tab:hover:not(.active) { color: rgba(255,255,255,0.75); }
        .lobby-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label {
          color: rgba(255,255,255,0.6);
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .form-group input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #fff;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }
        .form-group input::placeholder { color: rgba(255,255,255,0.25); }
        .form-group input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.08);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }
        .lobby-error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.25);
          color: #f87171;
          border-radius: 8px;
          padding: 0.6rem 0.9rem;
          font-size: 0.855rem;
        }
        .lobby-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.85rem 1.5rem;
          font-size: 0.975rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
        }
        .lobby-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.45);
        }
        .lobby-btn:active:not(:disabled) { transform: translateY(0); }
        .lobby-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .lobby-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 1.75rem;
        }
        .feature-pill {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          padding: 0.3rem 0.75rem;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.45);
        }
      `}</style>
    </div>
  );
}
