import { type FC, useEffect, useRef } from 'react';
import type { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  /** Whether the popup is visible */
  isOpen: boolean;
  /** Leaderboard entries sorted by score descending */
  entries: LeaderboardEntry[];
  /** Called when the user closes the popup */
  onClose: () => void;
}

export const Leaderboard: FC<LeaderboardProps> = ({ isOpen, entries, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Trap focus inside the popup
  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="leaderboard-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="leaderboard-popup"
        role="dialog"
        aria-modal="true"
        aria-label="Leaderboard"
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="leaderboard-header">
          <h2 className="leaderboard-title">Leaderboard</h2>
          <button className="leaderboard-close" onClick={onClose} aria-label="Close leaderboard">
            ✕
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="leaderboard-empty">No scores yet. Play a game!</p>
        ) : (
          <ol className="leaderboard-list">
            {entries.map((entry, index) => (
              <li key={index} className={`leaderboard-entry${index === 0 ? ' leaderboard-entry--first' : ''}`}>
                <span className="leaderboard-rank">#{index + 1}</span>
                <span className="leaderboard-score">{entry.score.toLocaleString()}</span>
                <span className="leaderboard-date">{entry.date}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};
