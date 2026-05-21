import type { FC } from 'react';

interface GameHeaderProps {
  score: number;
  bestScore: number;
  onReset: () => void;
}

/**
 * Game header displaying scores and reset button
 */
export const GameHeader: FC<GameHeaderProps> = ({ score, bestScore, onReset }) => {
  return (
    <div className="game-header">
      <div className="title-section">
        <h1 className="game-title">2048</h1>
        <div className="scores">
          <div className="score-box">
            <div className="score-label">SCORE</div>
            <div className="score-value">{score}</div>
          </div>
          <div className="score-box">
            <div className="score-label">BEST</div>
            <div className="score-value">{bestScore}</div>
          </div>
        </div>
      </div>
      <div className="game-intro">
        <p>Join the numbers and get to the <strong>2048 tile!</strong></p>
        <button className="reset-button" onClick={onReset}>
          New Game
        </button>
      </div>
    </div>
  );
};
