'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  subscribeToRoom,
  updateVideoState,
  subscribeToMessages,
  sendMessage,
  type ChatMessage,
} from '@/lib/firebase';

export interface RoomState {
  videoId: string;
  isPlaying: boolean;
  currentTime: number;
  lastUpdated: number;
  updatedBy: string;
}

interface VideoState {
  videoId: string;
  isPlaying: boolean;
  currentTime: number;
}

// Minimal interface for what we need from the YouTube player ref
export interface YTPlayerHandle {
  getCurrentTime: () => number;
  getPlayerState: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  loadVideoById: (videoId: string, startSeconds?: number) => void;
}

const SEEK_THRESHOLD = 2; // seconds

export default function useRoomSync(
  roomId: string | null,
  userName: string,
  playerRef: React.RefObject<YTPlayerHandle | null>
) {
  const [roomState, setRoomState] = useState<RoomState>({
    videoId: '',
    isPlaying: false,
    currentTime: 0,
    lastUpdated: 0,
    updatedBy: '',
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for loop prevention
  const isRemoteUpdate = useRef(false);
  const lastProcessedUpdate = useRef(0);
  const currentVideoIdRef = useRef('');

  // ── Subscribe to room state ─────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId) return;

    const unsub = subscribeToRoom(roomId, (data) => {
      setIsConnected(true);
      setIsLoading(false);
      setError(null);

      const d = data as unknown as RoomState;

      if (d.lastUpdated <= lastProcessedUpdate.current) return;

      const isOwnUpdate = d.updatedBy === userName;

      if (isOwnUpdate) {
        // Load on our own player if video changed
        if (d.videoId && d.videoId !== currentVideoIdRef.current && playerRef?.current) {
          playerRef.current.loadVideoById(d.videoId, d.currentTime || 0);
          currentVideoIdRef.current = d.videoId;
          if (!d.isPlaying) {
            setTimeout(() => playerRef.current?.pauseVideo(), 500);
          }
        }
        setRoomState((prev) => ({ ...prev, ...d }));
        lastProcessedUpdate.current = d.lastUpdated;
        return;
      }

      // Remote update — apply to player
      isRemoteUpdate.current = true;
      setRoomState((prev) => ({ ...prev, ...d }));

      if (playerRef?.current) {
        try {
          if (d.videoId && d.videoId !== currentVideoIdRef.current) {
            currentVideoIdRef.current = d.videoId;
            playerRef.current.loadVideoById(d.videoId, d.currentTime || 0);
            if (!d.isPlaying) setTimeout(() => playerRef.current?.pauseVideo(), 500);
          } else {
            const timeDiff = Math.abs((playerRef.current.getCurrentTime?.() || 0) - d.currentTime);
            if (timeDiff > SEEK_THRESHOLD) playerRef.current.seekTo(d.currentTime, true);

            const state = playerRef.current.getPlayerState?.();
            if (d.isPlaying && state !== 1) playerRef.current.playVideo();
            else if (!d.isPlaying && state === 1) playerRef.current.pauseVideo();
          }
        } catch (err) {
          console.error('[useRoomSync] Player error:', err);
        }
      }

      lastProcessedUpdate.current = d.lastUpdated;
      setTimeout(() => { isRemoteUpdate.current = false; }, 1000);
    });

    return () => {
      unsub();
      currentVideoIdRef.current = '';
      lastProcessedUpdate.current = 0;
    };
  }, [roomId, userName, playerRef]);

  // ── Subscribe to messages ───────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId) return;
    const unsub = subscribeToMessages(roomId, setMessages);
    return () => unsub();
  }, [roomId]);

  // ── Outgoing update helpers ─────────────────────────────────────────────────
  const updateState = useCallback(
    async (newState: Partial<VideoState>) => {
      if (isRemoteUpdate.current || !roomId || !userName) return;
      try {
        setRoomState((prev) => {
          const merged = {
            videoId: newState.videoId ?? prev.videoId,
            isPlaying: newState.isPlaying ?? prev.isPlaying,
            currentTime: newState.currentTime ?? prev.currentTime,
          };
          updateVideoState(roomId, merged, userName);
          return { ...prev, ...merged, lastUpdated: Date.now(), updatedBy: userName };
        });
      } catch (err) {
        console.error('[useRoomSync] updateState error:', err);
        setError('Failed to sync video state');
      }
    },
    [roomId, userName]
  );

  const sendPlay = useCallback((currentTime: number) =>
    updateState({ isPlaying: true, currentTime }), [updateState]);

  const sendPause = useCallback((currentTime: number) =>
    updateState({ isPlaying: false, currentTime }), [updateState]);

  const sendSeek = useCallback((currentTime: number, isPlaying: boolean) =>
    updateState({ currentTime, isPlaying }), [updateState]);

  const loadVideo = useCallback((videoId: string) =>
    updateState({ videoId, currentTime: 0, isPlaying: true }), [updateState]);

  const sendChatMessage = useCallback(async (text: string) => {
    if (!text.trim() || !roomId || !userName) return;
    try {
      await sendMessage(roomId, userName, text.trim());
    } catch (err) {
      console.error('[useRoomSync] sendMessage error:', err);
      setError('Failed to send message');
    }
  }, [roomId, userName]);

  const isRemoteUpdateInProgress = useCallback(() => isRemoteUpdate.current, []);

  return {
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
  };
}

