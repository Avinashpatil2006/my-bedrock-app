import type { LeaderboardEntry } from '../types';

const LEADERBOARD_KEY = 'leaderboard2048';
const MAX_ENTRIES = 10;

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveScore = (score: number): void => {
  if (score <= 0) return;
  const entries = getLeaderboard();
  entries.push({ score, date: new Date().toLocaleDateString() });
  entries.sort((a, b) => b.score - a.score);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
};
