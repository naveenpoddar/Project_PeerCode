'use client';

import { useState, useEffect, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { checkRoomExists } from '@/lib/firebase';
import useRoomSync, { type YTPlayerHandle } from '@/hooks/useRoomSync';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PLAYER_STATE = { PLAYING: 1, PAUSED: 2, BUFFERING: 3 };

function extractVideoId(input: string): string | null {
  const t = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(t)) return t;
  try {
    const url = new URL(t);
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname === '/watch') return url.searchParams.get('v');
      if (url.pathname.startsWith('/embed/')) return url.pathname.split('/embed/')[1]?.split('?')[0] ?? null;
      if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/shorts/')[1]?.split('?')[0] ?? null;
    }
    if (url.hostname === 'youtu.be') return url.pathname.slice(1).split('?')[0];
  } catch {
    const m = t.match(/[a-zA-Z0-9_-]{11}/);
    if (m) return m[0];
  }
  return null;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

declare global {
  interface Window {
    YT: { Player: new (id: string, opts: Record<string, unknown>) => unknown };
    onYouTubeIframeAPIReady?: () => void;
  }
}


export default function LiveClassRoom(props: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(props.params);
  const searchParams = use(props.searchParams);
  const roomId = params.roomId;
  const nameParam = searchParams.name;
  const userName = (typeof nameParam === 'string' ? nameParam : 'Guest') || 'Guest';

  const [verifying, setVerifying] = useState(true);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoError, setVideoError] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [copied, setCopied] = useState(false);

  const ytPlayerRef = useRef<YTPlayerHandle | null>(null);
  const playerHandleRef = useRef<YTPlayerHandle | null>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const lastReportedTime = useRef(0);
  const isSeeking = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const uniquePlayerId = useRef(`yt-${Date.now()}`);

  const { roomState, messages, isConnected, error, sendPlay, sendPause, sendSeek, loadVideo, sendChatMessage, isRemoteUpdateInProgress } =
    useRoomSync(roomId, userName, playerHandleRef);

  // Verify room
  useEffect(() => {
    checkRoomExists(roomId)
      .then(exists => { if (!exists) setRoomNotFound(true); })
      .catch(() => setRoomNotFound(true))
      .finally(() => setVerifying(false));
  }, [roomId]);

  // Load YouTube API
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.YT?.Player) { setIsApiLoaded(true); return; }
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const iv = setInterval(() => { if (window.YT?.Player) { setIsApiLoaded(true); clearInterval(iv); } }, 100);
      return () => clearInterval(iv);
    }
    window.onYouTubeIframeAPIReady = () => setIsApiLoaded(true);
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api'; s.async = true;
    document.body.appendChild(s);
  }, []);

  // Create player
  useEffect(() => {
    if (!isApiLoaded || ytPlayerRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const player: any = new window.YT.Player(uniquePlayerId.current, {
      height: '100%', width: '100%',
      playerVars: { enablejsapi: 1, autoplay: 0, rel: 0, modestbranding: 1, controls: 1, fs: 1, origin: window.location.origin },
      events: {
        onReady: (e: { target: unknown }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const p = e.target as any;
          const handle: YTPlayerHandle = {
            getCurrentTime: () => p.getCurrentTime?.() ?? 0,
            getPlayerState: () => p.getPlayerState?.() ?? -1,
            playVideo: () => p.playVideo?.(),
            pauseVideo: () => p.pauseVideo?.(),
            seekTo: (s, a) => p.seekTo?.(s, a),
            loadVideoById: (id, start = 0) => p.loadVideoById?.(id, start),
          };
          playerHandleRef.current = handle;
          setIsPlayerReady(true);
          if (roomState.videoId) {
            handle.loadVideoById(roomState.videoId, roomState.currentTime);
            if (!roomState.isPlaying) setTimeout(() => handle.pauseVideo(), 500);
          }
        },
        onStateChange: (e: { data: number; target: { getCurrentTime: () => number } }) => {
          if (isRemoteUpdateInProgress()) return;
          const state = e.data;
          const t = e.target.getCurrentTime();
          if (state === PLAYER_STATE.PLAYING) {
            const d = Math.abs(t - lastReportedTime.current);
            if (d > 2 && !isSeeking.current) sendSeek(t, true); else sendPlay(t);
            lastReportedTime.current = t; isSeeking.current = false;
          } else if (state === PLAYER_STATE.PAUSED) {
            const d = Math.abs(t - lastReportedTime.current);
            if (d > 2) { isSeeking.current = true; sendSeek(t, false); } else sendPause(t);
            lastReportedTime.current = t;
          } else if (state === PLAYER_STATE.BUFFERING) {
            if (Math.abs(t - lastReportedTime.current) > 2) isSeeking.current = true;
          }
        },
      },
    });
    ytPlayerRef.current = player as unknown as YTPlayerHandle;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiLoaded]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ytPlayerRef.current as any)?.destroy?.();
      ytPlayerRef.current = null; playerHandleRef.current = null;
    };
  }, []);

  const handleLoadVideo = useCallback(() => {
    setVideoError('');
    const id = extractVideoId(videoUrlInput);
    if (!id) { setVideoError('Invalid YouTube URL or video ID'); return; }
    loadVideo(id); setVideoUrlInput('');
  }, [videoUrlInput, loadVideo]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim()); setChatInput('');
  };

  if (verifying) return <Spinner text="Connecting to room…" />;
  if (roomNotFound) return <NotFound />;

  return (
    <div className="room-root">
      {/* ── Top nav ── */}
      <nav className="room-nav">
        <div className="nav-left">
          <div className="nav-logo">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M23 7L16 12L23 17V7Z" fill="currentColor"/>
              <rect x="1" y="5" width="15" height="14" rx="2" fill="currentColor"/>
            </svg>
          </div>
          <span className="nav-title">LiveClass</span>
          <div className="nav-divider" />
          <span className="nav-room-id">{roomId}</span>
        </div>

        <div className="nav-center">
          <div className={`status-dot ${isConnected ? 'live' : ''}`} />
          <span className="status-label">{isConnected ? 'Live' : 'Connecting…'}</span>
          {roomState.videoId && (
            <span className={`play-badge ${roomState.isPlaying ? 'play' : 'pause'}`}>
              {roomState.isPlaying ? '▶ Playing' : '⏸ Paused'}
            </span>
          )}
        </div>

        <div className="nav-right">
          <button className="nav-btn" onClick={handleCopy}>
            {copied ? (
              <><CheckIcon /> Copied</>
            ) : (
              <><LinkIcon /> Share</>
            )}
          </button>
          <div className="avatar" title={userName}>{initials(userName)}</div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="room-body">
        {/* ── Video column ── */}
        <section className="video-col">
          {/* URL bar */}
          <div className="url-bar">
            <div className="url-icon"><YTIcon /></div>
            <input
              type="text"
              value={videoUrlInput}
              onChange={e => setVideoUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadVideo()}
              placeholder="Paste a YouTube URL or video ID…"
              className="url-input"
            />
            <button className="url-btn" onClick={handleLoadVideo} disabled={!videoUrlInput.trim()}>
              Load
            </button>
          </div>
          {videoError && <p className="url-error">⚠ {videoError}</p>}

          {/* Player */}
          <div className="player-shell">
            <div className="player-ratio">
              <div id={uniquePlayerId.current} className="yt-mount" />
              {!isPlayerReady && (
                <div className="player-overlay">
                  <div className="mini-spinner" />
                  <p>Loading player…</p>
                </div>
              )}
              {isPlayerReady && !roomState.videoId && (
                <div className="player-overlay">
                  <div className="empty-icon"><YTIcon /></div>
                  <h3>No video loaded</h3>
                  <p>Paste a YouTube link above — everyone in this room will see it instantly.</p>
                </div>
              )}
            </div>
          </div>

          {/* Info strip */}
          {roomState.videoId && (
            <div className="info-strip">
              <span className="info-vid">
                <span className="info-dot" />
                youtube.com/watch?v={roomState.videoId}
              </span>
              {roomState.updatedBy && (
                <span className="info-by">
                  Last action by {roomState.updatedBy === userName ? 'you' : roomState.updatedBy}
                </span>
              )}
            </div>
          )}
        </section>

        {/* ── Chat column ── */}
        <aside className="chat-col">
          <div className="chat-head">
            <span className="chat-title">Chat</span>
            <span className="chat-count">{messages.length}</span>
          </div>

          <div className="chat-body">
            {messages.length === 0 && (
              <div className="chat-empty">
                <span>💬</span>
                <p>Say hi to your peers!</p>
              </div>
            )}
            {messages.map(msg => {
              const mine = msg.sender === userName;
              return (
                <div key={msg.id} className={`msg ${mine ? 'mine' : 'theirs'}`}>
                  {!mine && <div className="msg-name">{msg.sender}</div>}
                  <div className="msg-bubble">{msg.text}</div>
                  <div className="msg-time">{formatTime(msg.timestamp)}</div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-form" onSubmit={handleSendChat}>
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Message…"
              className="chat-input"
            />
            <button type="submit" className="chat-send" disabled={!chatInput.trim()}>
              <SendIcon />
            </button>
          </form>
        </aside>
      </div>

      {error && <div className="toast">⚠ {error}</div>}

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .room-root {
          min-height: 100vh;
          background: #f8f9fb;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
          color: #111827;
        }

        /* ── Nav ── */
        .room-nav {
          height: 56px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem;
          position: sticky;
          top: 0;
          z-index: 50;
          gap: 1rem;
        }
        .nav-left { display: flex; align-items: center; gap: 0.6rem; }
        .nav-logo {
          width: 30px; height: 30px;
          background: #4f46e5;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .nav-title { font-size: 0.95rem; font-weight: 700; color: #111827; }
        .nav-divider { width: 1px; height: 16px; background: #e5e7eb; }
        .nav-room-id {
          font-size: 0.8rem;
          font-weight: 600;
          color: #6b7280;
          font-family: 'SF Mono', monospace;
          background: #f3f4f6;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }

        .nav-center { display: flex; align-items: center; gap: 0.5rem; }
        .status-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #d1d5db;
          flex-shrink: 0;
        }
        .status-dot.live {
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16,185,129,0.2);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 2px rgba(16,185,129,0.2); }
          50%      { box-shadow: 0 0 0 4px rgba(16,185,129,0.1); }
        }
        .status-label { font-size: 0.8rem; color: #6b7280; }
        .play-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.18rem 0.6rem;
          border-radius: 99px;
        }
        .play-badge.play { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .play-badge.pause { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }

        .nav-right { display: flex; align-items: center; gap: 0.625rem; }
        .nav-btn {
          display: flex; align-items: center; gap: 0.35rem;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.38rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
          white-space: nowrap;
        }
        .nav-btn:hover { border-color: #4f46e5; color: #4f46e5; background: #f5f3ff; }
        .avatar {
          width: 30px; height: 30px;
          background: #4f46e5;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; font-weight: 700;
          color: white; flex-shrink: 0;
          cursor: default;
        }

        /* ── Body ── */
        .room-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          min-height: 0;
        }

        /* ── Video col ── */
        .video-col {
          flex: 1;
          min-width: 0;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          overflow-y: auto;
        }

        .url-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 0.5rem 0.5rem 0.5rem 0.75rem;
          transition: border-color 0.15s;
        }
        .url-bar:focus-within { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.08); }
        .url-icon { color: #ef4444; flex-shrink: 0; display: flex; align-items: center; }
        .url-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.875rem;
          color: #111827;
          font-family: inherit;
          min-width: 0;
        }
        .url-input::placeholder { color: #9ca3af; }
        .url-btn {
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.45rem 1rem;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s;
          font-family: inherit;
        }
        .url-btn:hover:not(:disabled) { background: #4338ca; }
        .url-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .url-error {
          font-size: 0.82rem;
          color: #dc2626;
          padding: 0 0.25rem;
        }

        /* ── Player ── */
        .player-shell {
          flex: 1;
          min-height: 360px;
        }
        .player-ratio {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          background: #111827;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
        }
        .yt-mount {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
        }
        .yt-mount iframe { width: 100% !important; height: 100% !important; border: none; }
        .player-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 2rem;
          background: #111827;
          color: rgba(255,255,255,0.5);
          gap: 0.75rem;
        }
        .mini-spinner {
          width: 32px; height: 32px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .player-overlay p { font-size: 0.85rem; line-height: 1.6; max-width: 280px; }
        .player-overlay h3 { color: rgba(255,255,255,0.8); font-size: 1.05rem; font-weight: 600; }
        .empty-icon { color: #ef4444; margin-bottom: 0.25rem; }

        .info-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.5rem 0.875rem;
          font-size: 0.78rem;
          color: #6b7280;
        }
        .info-vid { display: flex; align-items: center; gap: 0.4rem; font-family: monospace; }
        .info-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; flex-shrink: 0; }
        .info-by { color: #9ca3af; }

        /* ── Chat col ── */
        .chat-col {
          width: 300px;
          flex-shrink: 0;
          background: white;
          border-left: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 56px);
          position: sticky;
          top: 56px;
        }
        .chat-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #f3f4f6;
        }
        .chat-title { font-size: 0.875rem; font-weight: 700; color: #111827; }
        .chat-count {
          background: #f3f4f6;
          color: #6b7280;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: 99px;
        }

        .chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .chat-body::-webkit-scrollbar { width: 3px; }
        .chat-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

        .chat-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #9ca3af;
          font-size: 0.84rem;
          text-align: center;
          padding: 2rem 0;
        }
        .chat-empty span { font-size: 1.5rem; }

        .msg { display: flex; flex-direction: column; max-width: 85%; }
        .msg.mine { align-self: flex-end; align-items: flex-end; }
        .msg.theirs { align-self: flex-start; align-items: flex-start; }
        .msg-name { font-size: 0.7rem; color: #9ca3af; margin-bottom: 0.2rem; padding: 0 0.2rem; font-weight: 500; }
        .msg-bubble {
          padding: 0.5rem 0.7rem;
          border-radius: 12px;
          font-size: 0.86rem;
          line-height: 1.5;
          word-break: break-word;
        }
        .msg.mine .msg-bubble {
          background: #4f46e5;
          color: white;
          border-bottom-right-radius: 3px;
        }
        .msg.theirs .msg-bubble {
          background: #f3f4f6;
          color: #111827;
          border-bottom-left-radius: 3px;
          border: 1px solid #e5e7eb;
        }
        .msg-time { font-size: 0.67rem; color: #d1d5db; margin-top: 0.2rem; padding: 0 0.2rem; }

        .chat-form {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem;
          border-top: 1px solid #f3f4f6;
        }
        .chat-input {
          flex: 1;
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.5rem 0.7rem;
          font-size: 0.875rem;
          color: #111827;
          outline: none;
          transition: all 0.15s;
          font-family: inherit;
          min-width: 0;
        }
        .chat-input::placeholder { color: #9ca3af; }
        .chat-input:focus { border-color: #4f46e5; background: white; box-shadow: 0 0 0 3px rgba(79,70,229,0.08); }
        .chat-send {
          width: 34px; height: 34px;
          background: #4f46e5;
          border: none; border-radius: 8px;
          color: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: all 0.15s;
        }
        .chat-send:hover:not(:disabled) { background: #4338ca; }
        .chat-send:disabled { opacity: 0.35; cursor: not-allowed; }

        /* ── Toast ── */
        .toast {
          position: fixed;
          bottom: 1.25rem; left: 50%;
          transform: translateX(-50%);
          background: #fef2f2;
          border: 1.5px solid #fecaca;
          color: #dc2626;
          padding: 0.55rem 1.25rem;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 500;
          z-index: 100;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .room-body { flex-direction: column; overflow: auto; }
          .chat-col {
            width: 100%; height: 380px;
            position: static;
            border-left: none;
            border-top: 1px solid #e5e7eb;
          }
          .nav-center { display: none; }
          .video-col { padding: 0.875rem; }
        }
      `}</style>
    </div>
  );
}

// ─── Icon components ──────────────────────────────────────────────────────────
function YTIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  );
}

// ─── Status screens ───────────────────────────────────────────────────────────
function Spinner({ text }: { text: string }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#f8f9fb', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
      gap: '0.875rem', color: '#6b7280', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        width: 32, height: 32,
        border: '3px solid #e5e7eb', borderTopColor: '#4f46e5',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: '#f8f9fb', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif', padding: '1.5rem'
    }}>
      <div style={{
        textAlign: 'center', padding: '2.5rem 2rem',
        background: 'white', borderRadius: 20,
        border: '1px solid #e5e7eb', maxWidth: 360,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ color: '#111827', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Room not found</h2>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          This room doesn't exist or has expired. Double-check the room code.
        </p>
        <a href="/live-class" style={{
          display: 'inline-block', background: '#4f46e5', color: 'white',
          textDecoration: 'none', padding: '0.65rem 1.5rem', borderRadius: 10,
          fontSize: '0.9rem', fontWeight: 600
        }}>
          Back to Live Class
        </a>
      </div>
    </div>
  );
}
