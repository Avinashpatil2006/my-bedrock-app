import type { FC } from 'react';

interface GameOverlayProps {
  won: boolean;
  gameOver: boolean;
  onRestart: () => void;
  onContinue?: () => void;
}

/**
 * Overlay displayed when game is won or lost
 */
export const GameOverlay: FC<GameOverlayProps> = ({
  won,
  gameOver,
  onRestart,
  onContinue,
}) => {
  if (!won && !gameOver) return null;

  return (
    <div className="game-overlay">
      <div className="overlay-content">
        <h2 className="overlay-title">
          {won ? 'You Win!' : 'Game Over!'}
        </h2>
        <div className="overlay-buttons">
          {won && onContinue && (
            <button className="overlay-button" onClick={onContinue}>
              Keep Playing
            </button>
          )}
          <button className="overlay-button" onClick={onRestart}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};
