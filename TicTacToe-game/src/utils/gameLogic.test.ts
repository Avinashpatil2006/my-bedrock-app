import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  checkWinner,
  isBoardFull,
  makeMove,
  getNextPlayer,
} from './gameLogic';
import type { Board } from '../types';

const b = (rows: (string | null)[][]): Board =>
  rows.map((row) => row.map((v) => (v === 'X' || v === 'O' ? v : null)));

describe('createEmptyBoard', () => {
  it('creates a 3x3 board of nulls', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(3);
    board.forEach((row) => {
      expect(row).toHaveLength(3);
      row.forEach((cell) => expect(cell).toBeNull());
    });
  });
});

describe('checkWinner', () => {
  it('returns null on empty board', () => {
    expect(checkWinner(createEmptyBoard())).toBeNull();
  });

  it('detects row wins', () => {
    const board = b([['X', 'X', 'X'], [null, null, null], [null, null, null]]);
    const result = checkWinner(board);
    expect(result?.winner).toBe('X');
    expect(result?.line).toEqual([[0, 0], [0, 1], [0, 2]]);
  });

  it('detects column wins', () => {
    const board = b([['O', null, null], ['O', null, null], ['O', null, null]]);
    expect(checkWinner(board)?.winner).toBe('O');
  });

  it('detects diagonal win top-left to bottom-right', () => {
    const board = b([['X', null, null], [null, 'X', null], [null, null, 'X']]);
    expect(checkWinner(board)?.winner).toBe('X');
  });

  it('detects diagonal win top-right to bottom-left', () => {
    const board = b([[null, null, 'O'], [null, 'O', null], ['O', null, null]]);
    expect(checkWinner(board)?.winner).toBe('O');
  });

  it('returns null when no winner yet', () => {
    const board = b([['X', 'O', null], [null, null, null], [null, null, null]]);
    expect(checkWinner(board)).toBeNull();
  });
});

describe('isBoardFull', () => {
  it('returns false for empty board', () => {
    expect(isBoardFull(createEmptyBoard())).toBe(false);
  });

  it('returns true when all cells are filled', () => {
    const board = b([['X', 'O', 'X'], ['O', 'X', 'O'], ['O', 'X', 'O']]);
    expect(isBoardFull(board)).toBe(true);
  });

  it('returns false when one cell remains', () => {
    const board = b([['X', 'O', 'X'], ['O', 'X', 'O'], ['O', 'X', null]]);
    expect(isBoardFull(board)).toBe(false);
  });
});

describe('makeMove', () => {
  it('places a player marker on the board', () => {
    const board = createEmptyBoard();
    const newBoard = makeMove(board, 1, 2, 'X');
    expect(newBoard[1][2]).toBe('X');
  });

  it('does not mutate the original board', () => {
    const board = createEmptyBoard();
    makeMove(board, 0, 0, 'O');
    expect(board[0][0]).toBeNull();
  });
});

describe('getNextPlayer', () => {
  it('returns O when current is X', () => {
    expect(getNextPlayer('X')).toBe('O');
  });

  it('returns X when current is O', () => {
    expect(getNextPlayer('O')).toBe('X');
  });
});
