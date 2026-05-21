import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getLeaderboard, saveScore } from './leaderboard';

const LEADERBOARD_KEY = 'leaderboard2048';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

vi.stubGlobal('localStorage', mockLocalStorage);

beforeEach(() => {
  mockLocalStorage.clear();
});

describe('getLeaderboard', () => {
  it('returns empty array when nothing stored', () => {
    expect(getLeaderboard()).toEqual([]);
  });

  it('returns parsed entries', () => {
    const entries = [{ score: 100, date: '5/21/2026' }];
    mockLocalStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
    expect(getLeaderboard()).toEqual(entries);
  });

  it('returns empty array on corrupt data', () => {
    mockLocalStorage.setItem(LEADERBOARD_KEY, 'not-json');
    expect(getLeaderboard()).toEqual([]);
  });
});

describe('saveScore', () => {
  it('saves a new score', () => {
    saveScore(500);
    const entries = getLeaderboard();
    expect(entries).toHaveLength(1);
    expect(entries[0].score).toBe(500);
  });

  it('ignores scores of 0 or less', () => {
    saveScore(0);
    saveScore(-100);
    expect(getLeaderboard()).toHaveLength(0);
  });

  it('sorts entries by score descending', () => {
    saveScore(100);
    saveScore(500);
    saveScore(250);
    const entries = getLeaderboard();
    expect(entries[0].score).toBe(500);
    expect(entries[1].score).toBe(250);
    expect(entries[2].score).toBe(100);
  });

  it('keeps only the top 10 entries', () => {
    for (let i = 1; i <= 12; i++) saveScore(i * 100);
    expect(getLeaderboard()).toHaveLength(10);
    expect(getLeaderboard()[0].score).toBe(1200);
  });
});
