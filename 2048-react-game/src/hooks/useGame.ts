import { useState, useEffect, useCallback } from 'react';
import type { Direction, GameState, LeaderboardEntry } from '../types';
import {
  initializeBoard,
  move,
  addRandomTile,
  canMove,
  hasWon,
} from '../utils/gameLogic';
import { getLeaderboard, saveScore } from '../utils/leaderboard';
import { useTouchSwipe } from './useTouchSwipe';

const BEST_SCORE_KEY = 'bestScore2048';

/**
 * Custom hook for managing 2048 game state and logic
 */
export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const bestScore = parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10);
    return {
      board: initializeBoard(),
      score: 0,
      bestScore,
      gameOver: false,
      won: false,
    };
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => getLeaderboard());

  // Save best score to localStorage
  useEffect(() => {
    if (gameState.score > gameState.bestScore) {
      localStorage.setItem(BEST_SCORE_KEY, gameState.score.toString());
      setGameState((prev) => ({ ...prev, bestScore: gameState.score }));
    }
  }, [gameState.score, gameState.bestScore]);

  /**
   * Handles tile movement in the specified direction
   */
  const handleMove = useCallback(
    (direction: Direction) => {
      if (gameState.gameOver) return;

      const { board: newBoard, score: moveScore, moved } = move(gameState.board, direction);

      if (!moved) return;

      // Add new tile after successful move
      const boardWithNewTile = addRandomTile(newBoard);
      const newScore = gameState.score + moveScore;

      // Check win condition
      const won = !gameState.won && hasWon(boardWithNewTile);

      // Check game over condition
      const gameOver = !canMove(boardWithNewTile);

      if (gameOver) {
        saveScore(newScore);
        setLeaderboard(getLeaderboard());
      }

      setGameState({
        board: boardWithNewTile,
        score: newScore,
        bestScore: Math.max(newScore, gameState.bestScore),
        gameOver,
        won,
      });
    },
    [gameState]
  );

  /**
   * Resets the game to initial state
   */
  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      board: initializeBoard(),
      score: 0,
      bestScore: prev.bestScore,
      gameOver: false,
      won: false,
    }));
  }, []);

  /**
   * Continues playing after winning
   */
  const continueGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      won: false,
    }));
  }, []);

  // Touch/swipe controls
  useTouchSwipe(handleMove);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      };

      const direction = keyMap[event.key];
      if (direction) {
        event.preventDefault();
        handleMove(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  const refreshLeaderboard = useCallback(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  return {
    ...gameState,
    leaderboard,
    handleMove,
    resetGame,
    continueGame,
    refreshLeaderboard,
  };
};
