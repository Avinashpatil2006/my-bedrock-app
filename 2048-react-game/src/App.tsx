import { useState } from 'react';
import { useGame } from './hooks/useGame';
import { Board, GameHeader, GameOverlay, Leaderboard } from './components';
import './styles/App.css';

const App = () => {
  const {
    board,
    score,
    bestScore,
    gameOver,
    won,
    leaderboard,
    resetGame,
    continueGame,
    refreshLeaderboard,
  } = useGame();

  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const openLeaderboard = () => {
    refreshLeaderboard();
    setShowLeaderboard(true);
  };

  return (
    <div className="app">
      <div className="container">
        <GameHeader score={score} bestScore={bestScore} onReset={resetGame} />
        <div className="game-container">
          <Board board={board} />
          <GameOverlay
            won={won}
            gameOver={gameOver}
            onRestart={resetGame}
            onContinue={won ? continueGame : undefined}
          />
        </div>
        <div className="game-instructions">
          <p><strong>HOW TO PLAY:</strong> Use arrow keys or WASD to move tiles.</p>
          <p>When two tiles with the same number touch, they merge into one!</p>
        </div>
        <button className="leaderboard-button" onClick={openLeaderboard}>
          Leaderboard
        </button>
        <Leaderboard
          isOpen={showLeaderboard}
          entries={leaderboard}
          onClose={() => setShowLeaderboard(false)}
        />
      </div>
    </div>
  );
};

export default App;
