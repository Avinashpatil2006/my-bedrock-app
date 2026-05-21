import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  getEmptyCells,
  addRandomTile,
  initializeBoard,
  move,
  canMove,
  hasWon,
} from './gameLogic';

describe('createEmptyBoard', () => {
  it('creates a 4x4 board filled with zeros', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(4);
    board.forEach((row) => {
      expect(row).toHaveLength(4);
      row.forEach((cell) => expect(cell).toBe(0));
    });
  });
});

describe('getEmptyCells', () => {
  it('returns all 16 cells for empty board', () => {
    expect(getEmptyCells(createEmptyBoard())).toHaveLength(16);
  });

  it('returns correct count after placing tiles', () => {
    const board = createEmptyBoard();
    board[0][0] = 2;
    board[1][1] = 4;
    expect(getEmptyCells(board)).toHaveLength(14);
  });
});

describe('addRandomTile', () => {
  it('adds exactly one tile to an empty board', () => {
    const board = createEmptyBoard();
    const newBoard = addRandomTile(board);
    const filled = newBoard.flat().filter((v) => v !== 0);
    expect(filled).toHaveLength(1);
  });

  it('places a tile with value 2 or 4', () => {
    const board = createEmptyBoard();
    const newBoard = addRandomTile(board);
    const value = newBoard.flat().find((v) => v !== 0);
    expect([2, 4]).toContain(value);
  });

  it('returns unchanged board when no empty cells', () => {
    const board = Array(4).fill(null).map(() => Array(4).fill(2));
    const newBoard = addRandomTile(board);
    expect(newBoard).toEqual(board);
  });
});

describe('initializeBoard', () => {
  it('starts with exactly two tiles', () => {
    const board = initializeBoard();
    const filled = board.flat().filter((v) => v !== 0);
    expect(filled).toHaveLength(2);
  });
});

describe('move', () => {
  it('slides tiles left correctly', () => {
    const board = [
      [0, 0, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, moved } = move(board, 'left');
    expect(result[0][0]).toBe(2);
    expect(moved).toBe(true);
  });

  it('merges two equal tiles', () => {
    const board = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, score } = move(board, 'left');
    expect(result[0][0]).toBe(4);
    expect(result[0][1]).toBe(0);
    expect(score).toBe(4);
  });

  it('does not merge a tile twice in one move', () => {
    const board = [
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result } = move(board, 'left');
    expect(result[0][0]).toBe(4);
    expect(result[0][1]).toBe(4);
  });

  it('slides tiles right correctly', () => {
    const board = [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, moved } = move(board, 'right');
    expect(result[0][3]).toBe(2);
    expect(moved).toBe(true);
  });

  it('slides tiles up correctly', () => {
    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 0, 0],
    ];
    const { board: result, moved } = move(board, 'up');
    expect(result[0][0]).toBe(2);
    expect(moved).toBe(true);
  });

  it('slides tiles down correctly', () => {
    const board = [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, moved } = move(board, 'down');
    expect(result[3][0]).toBe(2);
    expect(moved).toBe(true);
  });

  it('reports moved=false when nothing changes', () => {
    const board = [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { moved } = move(board, 'left');
    expect(moved).toBe(false);
  });
});

describe('canMove', () => {
  it('returns true when empty cells exist', () => {
    expect(canMove(createEmptyBoard())).toBe(true);
  });

  it('returns true when adjacent tiles can merge', () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    board[0][0] = 2;
    board[0][1] = 2;
    expect(canMove(board)).toBe(true);
  });

  it('returns false when no moves possible', () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(canMove(board)).toBe(false);
  });
});

describe('hasWon', () => {
  it('returns false on a fresh board', () => {
    expect(hasWon(initializeBoard())).toBe(false);
  });

  it('returns true when 2048 tile is present', () => {
    const board = createEmptyBoard();
    board[2][2] = 2048;
    expect(hasWon(board)).toBe(true);
  });
});
