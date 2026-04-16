'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { checkRoomExists } from '@/lib/firebase';
import useRoomSync, { type YTPlayerHandle } from '@/hooks/useRoomSync';

// ─── YouTube helpers ──────────────────────────────────────────────────────────

const PLAYER_STATE = { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 };

function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname === '/watch') return url.searchParams.get('v');
      if (url.pathname.startsWith('/embed/')) return url.pathname.split('/embed/')[1]?.split('?')[0] ?? null;
      if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/shorts/')[1]?.split('?')[0] ?? null;
    }
    if (url.hostname === 'youtu.be') return url.pathname.slice(1).split('?')[0];
  } catch {
    const m = trimmed.match(/[a-zA-Z0-9_-]{11}/);
    if (m) return m[0];
  }
  return null;
}

declare global {
  interface Window {
    YT: {
      Player: new (id: string, opts: Record<string, unknown>) => unknown;
      PlayerState: Record<string, number>;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// ─── Chat message ─────────────────────────────────────────────────────────────

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LiveClassRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const userName = searchParams.get('name') || 'Guest';

  const [verifying, setVerifying] = useState(true);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoError, setVideoError] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);

  // YouTube player ref (typed via the minimal handle interface)
  const playerDomRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<YTPlayerHandle | null>(null);
  const playerHandleRef = useRef<YTPlayerHandle | null>(null);

  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const lastReportedTime = useRef(0);
  const isSeeking = useRef(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const uniquePlayerId = useRef(`yt-player-${Date.now()}`);

  const {
    roomState,
    messages,
    isLoading,
    isConnected,
    error,
    sendPlay,
    sendPause,
    sendSeek,
    loadVideo,
    sendChatMessage,
    isRemoteUpdateInProgress,
  } = useRoomSync(roomId, userName, playerHandleRef);

  // ── Verify room exists ────────────────────────────────────────────────────
  useEffect(() => {
    checkRoomExists(roomId)
      .then((exists) => { if (!exists) setRoomNotFound(true); })
      .catch(() => setRoomNotFound(true))
      .finally(() => setVerifying(false));
  }, [roomId]);

  // ── Load YouTube IFrame API ───────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.YT?.Player) { setIsApiLoaded(true); return; }
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const interval = setInterval(() => { if (window.YT?.Player) { setIsApiLoaded(true); clearInterval(interval); } }, 100);
      return () => clearInterval(interval);
    }
    window.onYouTubeIframeAPIReady = () => setIsApiLoaded(true);
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // ── Create player ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isApiLoaded || ytPlayerRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const player: any = new window.YT.Player(uniquePlayerId.current, {
      height: '100%',
      width: '100%',
      playerVars: {
        enablejsapi: 1, autoplay: 0, rel: 0, modestbranding: 1,
        controls: 1, fs: 1, origin: window.location.origin,
      },
      events: {
        onReady: (e: { target: unknown }) => {
          setIsPlayerReady(true);
          // Build the handle
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

          // If room already has a video, load it
          if (roomState.videoId) {
            handle.loadVideoById(roomState.videoId, roomState.currentTime);
            if (!roomState.isPlaying) setTimeout(() => handle.pauseVideo(), 500);
          }
        },
        onStateChange: (e: { data: number; target: { getCurrentTime: () => number } }) => {
          if (isRemoteUpdateInProgress()) return;
          const state = e.data;
          const currentTime = e.target.getCurrentTime();

          if (state === PLAYER_STATE.PLAYING) {
            const diff = Math.abs(currentTime - lastReportedTime.current);
            if (diff > 2 && !isSeeking.current) sendSeek(currentTime, true);
            else sendPlay(currentTime);
            lastReportedTime.current = currentTime;
            isSeeking.current = false;
          } else if (state === PLAYER_STATE.PAUSED) {
            const diff = Math.abs(currentTime - lastReportedTime.current);
            if (diff > 2) { isSeeking.current = true; sendSeek(currentTime, false); }
            else sendPause(currentTime);
            lastReportedTime.current = currentTime;
          } else if (state === PLAYER_STATE.BUFFERING) {
            if (Math.abs(currentTime - lastReportedTime.current) > 2) isSeeking.current = true;
          }
        },
      },
    });
    ytPlayerRef.current = player as unknown as YTPlayerHandle;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiLoaded]);

  // ── Auto-scroll chat ──────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ytPlayerRef.current as any)?.destroy?.();
      ytPlayerRef.current = null;
      playerHandleRef.current = null;
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleLoadVideo = useCallback(() => {
    setVideoError('');
    const videoId = extractVideoId(videoUrlInput);
    if (!videoId) { setVideoError('Invalid YouTube URL or video ID'); return; }
    loadVideo(videoId);
    setVideoUrlInput('');
  }, [videoUrlInput, loadVideo]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim());
    setChatInput('');
  };

  // ─────────────────────────────────────────────────────────────────────────
  if (verifying) return <FullscreenStatus text="Connecting to room…" />;
  if (roomNotFound) return <RoomNotFound />;

  return (
    <div className="lc-root">
      {/* ── Header ── */}
      <header className="lc-header">
        <div className="lc-header-left">
          <div className="lc-logo">
            <svg viewBox="0 0 24 24" fill="none"><path d="M23 7L16 12L23 17V7Z" fill="currentColor"/><rect x="1" y="5" width="15" height="14" rx="2" fill="currentColor"/></svg>
          </div>
          <div>
            <div className="lc-title">Live Class</div>
            <div className="lc-room-code">Room: <span>{roomId}</span></div>
          </div>
        </div>

        <div className="lc-header-center">
          <div className={`lc-status-dot ${isConnected ? 'connected' : ''}`} />
          <span className="lc-status-text">{isConnected ? 'Live' : 'Connecting…'}</span>
          {roomState.videoId && (
            <span className={`lc-play-badge ${roomState.isPlaying ? 'playing' : 'paused'}`}>
              {roomState.isPlaying ? '▶ Playing' : '⏸ Paused'}
            </span>
          )}
        </div>

        <div className="lc-header-right">
          <button className="lc-copy-btn" onClick={handleCopyLink}>
            {copied ? '✓ Copied!' : '🔗 Share Room'}
          </button>
          <div className="lc-user-pill">{userName[0]?.toUpperCase()}</div>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="lc-main">
        {/* ── Video column ── */}
        <div className="lc-video-col">
          {/* URL input */}
          <div className="lc-url-bar">
            <input
              type="text"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLoadVideo()}
              placeholder="Paste a YouTube URL or video ID to watch together…"
              className="lc-url-input"
            />
            <button
              className="lc-load-btn"
              onClick={handleLoadVideo}
              disabled={!videoUrlInput.trim()}
            >
              Load Video
            </button>
          </div>
          {videoError && <p className="lc-error">{videoError}</p>}

          {/* Player */}
          <div className="lc-player-wrap">
            {/* YouTube mounts here */}
            <div className="lc-player-container">
              <div id={uniquePlayerId.current} className="lc-yt-target" />
              {!isPlayerReady && (
                <div className="lc-player-loading">
                  <div className="lc-spinner" />
                  <p>Loading player…</p>
                </div>
              )}
              {isPlayerReady && !roomState.videoId && (
                <div className="lc-no-video">
                  <div className="lc-no-video-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                  <h3>No Video Loaded</h3>
                  <p>Paste a YouTube URL above to start watching together in sync!</p>
                </div>
              )}
            </div>
          </div>

          {/* Status bar */}
          {roomState.videoId && (
            <div className="lc-status-bar">
              <span>
                {roomState.updatedBy
                  ? `Last action by: ${roomState.updatedBy === userName ? 'You' : roomState.updatedBy}`
                  : ''}
              </span>
              <span className="lc-video-id">🎬 {roomState.videoId}</span>
            </div>
          )}
        </div>

        {/* ── Chat column ── */}
        <div className="lc-chat-col">
          <div className="lc-chat-header">
            <span>💬 Room Chat</span>
            <span className="lc-msg-count">{messages.length} messages</span>
          </div>

          <div className="lc-messages">
            {messages.length === 0 && (
              <div className="lc-no-msgs">No messages yet. Say hi! 👋</div>
            )}
            {messages.map((msg) => {
              const isMine = msg.sender === userName;
              return (
                <div key={msg.id} className={`lc-msg ${isMine ? 'mine' : 'theirs'}`}>
                  {!isMine && <div className="lc-msg-sender">{msg.sender}</div>}
                  <div className="lc-msg-bubble">{msg.text}</div>
                  <div className="lc-msg-time">{formatTime(msg.timestamp)}</div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <form className="lc-chat-form" onSubmit={handleSendChat}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message…"
              className="lc-chat-input"
            />
            <button type="submit" className="lc-chat-send" disabled={!chatInput.trim()}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="lc-toast">
          <span>⚠️ {error}</span>
        </div>
      )}

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lc-root {
          min-height: 100vh;
          background: #080810;
          color: #e5e7eb;
          font-family: 'Inter', system-ui, sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── Header ── */
        .lc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          background: rgba(10,10,20,0.95);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .lc-header-left { display: flex; align-items: center; gap: 0.75rem; }
        .lc-logo {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .lc-logo svg { width: 18px; height: 18px; }
        .lc-title { font-size: 1rem; font-weight: 700; color: white; }
        .lc-room-code { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
        .lc-room-code span { color: #a78bfa; font-weight: 600; }

        .lc-header-center { display: flex; align-items: center; gap: 0.6rem; }
        .lc-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #4b5563; flex-shrink: 0;
        }
        .lc-status-dot.connected {
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 6px #10b981; }
          50%      { box-shadow: 0 0 12px #10b981; }
        }
        .lc-status-text { font-size: 0.82rem; color: rgba(255,255,255,0.55); }
        .lc-play-badge {
          font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.6rem;
          border-radius: 99px;
        }
        .lc-play-badge.playing {
          background: rgba(16,185,129,0.15); color: #34d399;
          border: 1px solid rgba(16,185,129,0.25);
        }
        .lc-play-badge.paused {
          background: rgba(251,191,36,0.12); color: #fbbf24;
          border: 1px solid rgba(251,191,36,0.2);
        }

        .lc-header-right { display: flex; align-items: center; gap: 0.75rem; }
        .lc-copy-btn {
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #a78bfa;
          border-radius: 8px;
          padding: 0.4rem 0.85rem;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          white-space: nowrap;
        }
        .lc-copy-btn:hover { background: rgba(99,102,241,0.25); }
        .lc-user-pill {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700; color: white;
          flex-shrink: 0;
        }

        /* ── Layout ── */
        .lc-main {
          flex: 1;
          display: flex;
          overflow: hidden;
          min-height: 0;
        }

        /* ── Video column ── */
        .lc-video-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1rem 1rem 1rem 1.25rem;
          min-width: 0;
          gap: 0.75rem;
        }

        .lc-url-bar {
          display: flex;
          gap: 0.5rem;
        }
        .lc-url-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0.6rem 1rem;
          color: #e5e7eb;
          font-size: 0.88rem;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
          min-width: 0;
        }
        .lc-url-input::placeholder { color: rgba(255,255,255,0.25); }
        .lc-url-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .lc-load-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 0.6rem 1.1rem;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          font-family: inherit;
          box-shadow: 0 4px 12px rgba(99,102,241,0.3);
        }
        .lc-load-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(99,102,241,0.4);
        }
        .lc-load-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .lc-error {
          color: #f87171;
          font-size: 0.82rem;
          padding: 0.25rem 0.1rem;
        }

        /* ── Player ── */
        .lc-player-wrap {
          flex: 1;
          min-height: 0;
        }
        .lc-player-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 */
          background: #0d0d18;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        .lc-yt-target {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .lc-yt-target iframe {
          width: 100% !important;
          height: 100% !important;
          border: none;
        }
        .lc-player-loading {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: #0d0d18;
          color: rgba(255,255,255,0.4);
          font-size: 0.88rem;
          gap: 0.75rem;
        }
        .lc-spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .lc-no-video {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 2rem;
          gap: 0.75rem;
        }
        .lc-no-video-icon {
          width: 64px; height: 64px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #ef4444;
        }
        .lc-no-video-icon svg { width: 32px; height: 32px; }
        .lc-no-video h3 { color: #e5e7eb; font-size: 1.1rem; font-weight: 600; }
        .lc-no-video p { color: rgba(255,255,255,0.35); font-size: 0.88rem; max-width: 320px; line-height: 1.6; }

        /* ── Status bar ── */
        .lc-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.35);
        }
        .lc-video-id { font-family: monospace; color: rgba(167,139,250,0.7); }

        /* ── Chat column ── */
        .lc-chat-col {
          width: 320px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          border-left: 1px solid rgba(255,255,255,0.07);
          background: rgba(10,10,20,0.7);
          height: calc(100vh - 57px);
          position: sticky;
          top: 57px;
        }
        .lc-chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.9rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 0.88rem;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
        }
        .lc-msg-count { font-size: 0.75rem; color: rgba(255,255,255,0.3); font-weight: 400; }

        .lc-messages {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          scroll-behavior: smooth;
        }
        .lc-messages::-webkit-scrollbar { width: 4px; }
        .lc-messages::-webkit-scrollbar-track { background: transparent; }
        .lc-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        .lc-no-msgs {
          text-align: center;
          color: rgba(255,255,255,0.25);
          font-size: 0.82rem;
          padding: 2rem 0;
        }

        .lc-msg { display: flex; flex-direction: column; max-width: 82%; }
        .lc-msg.mine { align-self: flex-end; align-items: flex-end; }
        .lc-msg.theirs { align-self: flex-start; align-items: flex-start; }

        .lc-msg-sender {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.2rem;
          padding: 0 0.25rem;
        }
        .lc-msg-bubble {
          padding: 0.5rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          line-height: 1.5;
          word-break: break-word;
        }
        .lc-msg.mine .lc-msg-bubble {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .lc-msg.theirs .lc-msg-bubble {
          background: rgba(255,255,255,0.07);
          color: #d1d5db;
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .lc-msg-time {
          font-size: 0.68rem;
          color: rgba(255,255,255,0.25);
          margin-top: 0.2rem;
          padding: 0 0.25rem;
        }

        .lc-chat-form {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .lc-chat-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 0.55rem 0.75rem;
          color: #e5e7eb;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
          min-width: 0;
        }
        .lc-chat-input::placeholder { color: rgba(255,255,255,0.25); }
        .lc-chat-input:focus {
          border-color: rgba(99,102,241,0.4);
          background: rgba(99,102,241,0.05);
        }
        .lc-chat-send {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        }
        .lc-chat-send:hover:not(:disabled) { transform: scale(1.05); }
        .lc-chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── Toast ── */
        .lc-toast {
          position: fixed;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-size: 0.875rem;
          backdrop-filter: blur(12px);
          z-index: 100;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(8px); } }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .lc-main { flex-direction: column; overflow: auto; }
          .lc-chat-col {
            width: 100%;
            height: 400px;
            position: static;
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.07);
          }
          .lc-video-col { padding: 0.75rem; }
          .lc-header { padding: 0.6rem 1rem; }
          .lc-header-center { display: none; }
        }
      `}</style>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FullscreenStatus({ text }: { text: string }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#080810', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
      gap: '1rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#6366f1',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ fontSize: '0.9rem' }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function RoomNotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: '#080810', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        textAlign: 'center', padding: '2rem',
        background: 'rgba(15,15,25,0.8)', borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)', maxWidth: 380
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '0.5rem' }}>Room Not Found</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          This room doesn't exist or has expired. Check the room code and try again.
        </p>
        <a
          href="/live-class"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', textDecoration: 'none',
            padding: '0.7rem 1.5rem', borderRadius: 10,
            fontSize: '0.9rem', fontWeight: 600
          }}
        >
          Back to Live Class
        </a>
      </div>
    </div>
  );
}
