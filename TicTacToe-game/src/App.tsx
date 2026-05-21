import { useGame } from './hooks/useGame';
import { Board, ScoreBoard, StatusBar } from './components';
import './styles/App.css';

const App = () => {
  const {
    board,
    currentPlayer,
    winner,
    winningLine,
    xScore,
    oScore,
    draws,
    handleCellClick,
    resetRound,
    resetGame,
  } = useGame();

  return (
    <div className="app">
      <h1 className="app__title">TIC TAC TOE</h1>
      <ScoreBoard xScore={xScore} oScore={oScore} draws={draws} />
      <StatusBar currentPlayer={currentPlayer} winner={winner} />
      <Board
        board={board}
        winningLine={winningLine}
        gameOver={winner !== null}
        onCellClick={handleCellClick}
      />
      <div className="button-row">
        <button className="btn btn--next" onClick={resetRound}>
          {winner !== null ? 'Play Again' : 'New Round'}
        </button>
        <button className="btn btn--reset" onClick={resetGame}>
          Reset Scores
        </button>
      </div>
    </div>
  );
};

export default App;
