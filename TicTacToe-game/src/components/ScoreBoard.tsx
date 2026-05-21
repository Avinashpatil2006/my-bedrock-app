import type { FC } from 'react';

interface ScoreBoardProps {
  /** X player score */
  xScore: number;
  /** O player score */
  oScore: number;
  /** Number of draws */
  draws: number;
}

export const ScoreBoard: FC<ScoreBoardProps> = ({ xScore, oScore, draws }) => (
  <div className="scoreboard">
    <div className="scoreboard__item scoreboard__item--x">
      <span className="scoreboard__label">X</span>
      <span className="scoreboard__value">{xScore}</span>
    </div>
    <div className="scoreboard__item scoreboard__item--draw">
      <span className="scoreboard__label">Draw</span>
      <span className="scoreboard__value">{draws}</span>
    </div>
    <div className="scoreboard__item scoreboard__item--o">
      <span className="scoreboard__label">O</span>
      <span className="scoreboard__value">{oScore}</span>
    </div>
  </div>
);
