import { useState, useCallback } from 'react';
import type { GameState } from '../types';
import {
  createEmptyBoard,
  checkWinner,
  isBoardFull,
  makeMove,
  getNextPlayer,
} from '../utils/gameLogic';

const initialState = (): GameState => ({
  board: createEmptyBoard(),
  currentPlayer: 'X',
  winner: null,
  winningLine: null,
  xScore: 0,
  oScore: 0,
  draws: 0,
});

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const handleCellClick = useCallback((row: number, col: number) => {
    setGameState((prev) => {
      if (prev.winner !== null || prev.board[row][col] !== null) return prev;

      const newBoard = makeMove(prev.board, row, col, prev.currentPlayer);
      const result = checkWinner(newBoard);

      if (result) {
        return {
          ...prev,
          board: newBoard,
          winner: result.winner,
          winningLine: result.line,
          xScore: result.winner === 'X' ? prev.xScore + 1 : prev.xScore,
          oScore: result.winner === 'O' ? prev.oScore + 1 : prev.oScore,
        };
      }

      if (isBoardFull(newBoard)) {
        return {
          ...prev,
          board: newBoard,
          winner: 'draw',
          winningLine: null,
          draws: prev.draws + 1,
        };
      }

      return {
        ...prev,
        board: newBoard,
        currentPlayer: getNextPlayer(prev.currentPlayer),
      };
    });
  }, []);

  const resetRound = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      board: createEmptyBoard(),
      currentPlayer: 'X',
      winner: null,
      winningLine: null,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialState());
  }, []);

  return { ...gameState, handleCellClick, resetRound, resetGame };
};
