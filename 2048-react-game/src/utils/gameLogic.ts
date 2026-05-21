import type { Board, Direction } from '../types';

const GRID_SIZE = 4;

/**
 * Creates an empty game board
 */
export const createEmptyBoard = (): Board => {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(0));
};

/**
 * Gets all empty cell positions on the board
 */
export const getEmptyCells = (board: Board): Array<{ row: number; col: number }> => {
  const emptyCells: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells;
};

/**
 * Adds a random tile (2 or 4) to an empty cell
 */
export const addRandomTile = (board: Board): Board => {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return board;

  const newBoard = board.map((row) => [...row]);
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  newBoard[randomCell.row][randomCell.col] = value;

  return newBoard;
};

/**
 * Initializes a new game board with two random tiles
 */
export const initializeBoard = (): Board => {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

/**
 * Moves and merges tiles in a single row to the left
 */
const slideRow = (row: number[]): { row: number[]; score: number } => {
  // Remove zeros
  let newRow = row.filter((val) => val !== 0);
  let score = 0;

  // Merge adjacent equal values
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      score += newRow[i];
      newRow[i + 1] = 0;
    }
  }

  // Remove zeros again after merging
  newRow = newRow.filter((val) => val !== 0);

  // Pad with zeros to maintain row length
  while (newRow.length < GRID_SIZE) {
    newRow.push(0);
  }

  return { row: newRow, score };
};

/**
 * Rotates the board 90 degrees clockwise
 */
const rotateBoard = (board: Board): Board => {
  const newBoard = createEmptyBoard();
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      newBoard[col][GRID_SIZE - 1 - row] = board[row][col];
    }
  }
  return newBoard;
};

/**
 * Moves tiles in the specified direction and returns new board state
 */
export const move = (
  board: Board,
  direction: Direction
): { board: Board; score: number; moved: boolean } => {
  let workingBoard = board.map((row) => [...row]);
  let totalScore = 0;

  // Rotate board to make all moves work as "left"
  const rotations: Record<Direction, number> = {
    left: 0,
    down: 1,
    right: 2,
    up: 3,
  };

  for (let i = 0; i < rotations[direction]; i++) {
    workingBoard = rotateBoard(workingBoard);
  }

  // Slide all rows to the left
  const newBoard = createEmptyBoard();
  for (let row = 0; row < GRID_SIZE; row++) {
    const { row: newRow, score } = slideRow(workingBoard[row]);
    newBoard[row] = newRow;
    totalScore += score;
  }

  // Rotate back
  let finalBoard = newBoard;
  for (let i = 0; i < 4 - rotations[direction]; i++) {
    finalBoard = rotateBoard(finalBoard);
  }

  // Check if board changed
  const moved = !boardsEqual(board, finalBoard);

  return { board: finalBoard, score: totalScore, moved };
};

/**
 * Checks if two boards are equal
 */
const boardsEqual = (board1: Board, board2: Board): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board1[row][col] !== board2[row][col]) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Checks if any moves are possible
 */
export const canMove = (board: Board): boolean => {
  // Check for empty cells
  if (getEmptyCells(board).length > 0) return true;

  // Check for possible merges horizontally
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE - 1; col++) {
      if (board[row][col] === board[row][col + 1]) return true;
    }
  }

  // Check for possible merges vertically
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE - 1; row++) {
      if (board[row][col] === board[row + 1][col]) return true;
    }
  }

  return false;
};

/**
 * Checks if the board contains a winning tile (2048)
 */
export const hasWon = (board: Board): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 2048) return true;
    }
  }
  return false;
};
