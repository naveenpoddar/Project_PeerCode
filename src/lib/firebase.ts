import { initializeApp, getApps } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  push,
  update,
  remove,
} from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDk67T9wChw93owmNQdv9JLFGJuCxIn_Eg",
  authDomain: "watch-togather.firebaseapp.com",
  databaseURL: "https://watch-togather-default-rtdb.firebaseio.com",
  projectId: "watch-togather",
  storageBucket: "watch-togather.firebasestorage.app",
  messagingSenderId: "1078870978792",
  appId: "1:1078870978792:web:4d64c6d0ba61e55365595d",
};

// Prevent duplicate app init in Next.js dev (hot-reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);

// ─── Room helpers ────────────────────────────────────────────────────────────

export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export const createRoom = async (roomId: string, creatorName: string) => {
  const roomRef = ref(database, `live-rooms/${roomId}`);
  await set(roomRef, {
    videoId: '',
    isPlaying: false,
    currentTime: 0,
    lastUpdated: Date.now(),
    updatedBy: creatorName,
    createdAt: Date.now(),
    createdBy: creatorName,
  });
};

export const checkRoomExists = async (roomId: string): Promise<boolean> => {
  const snapshot = await get(ref(database, `live-rooms/${roomId}`));
  return snapshot.exists();
};

// ─── Video state ─────────────────────────────────────────────────────────────

export interface VideoState {
  videoId: string;
  isPlaying: boolean;
  currentTime: number;
}

export const updateVideoState = async (
  roomId: string,
  state: VideoState,
  updatedBy: string
) => {
  await update(ref(database, `live-rooms/${roomId}`), {
    ...state,
    lastUpdated: Date.now(),
    updatedBy,
  });
};

export const subscribeToRoom = (
  roomId: string,
  callback: (data: Record<string, unknown>) => void
) => {
  const roomRef = ref(database, `live-rooms/${roomId}`);
  return onValue(roomRef, (snap) => {
    if (snap.exists()) callback(snap.val());
  });
};

// ─── Chat ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export const sendMessage = async (roomId: string, sender: string, text: string) => {
  await push(ref(database, `live-rooms/${roomId}/messages`), {
    sender,
    text,
    timestamp: Date.now(),
  });
};

export const subscribeToMessages = (
  roomId: string,
  callback: (messages: ChatMessage[]) => void
) => {
  return onValue(ref(database, `live-rooms/${roomId}/messages`), (snap) => {
    const msgs: ChatMessage[] = [];
    if (snap.exists()) {
      snap.forEach((child) => {
        msgs.push({ id: child.key as string, ...child.val() });
      });
      msgs.sort((a, b) => a.timestamp - b.timestamp);
    }
    callback(msgs);
  });
};

export { database, ref, onValue, update, remove };
export default app;
