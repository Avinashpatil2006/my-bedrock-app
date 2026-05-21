import type { Board, CellValue, Player } from '../types';

const WINNING_LINES = [
  // rows
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  // cols
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  // diagonals
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]],
];

export const createEmptyBoard = (): Board =>
  Array(3).fill(null).map(() => Array(3).fill(null));

export const checkWinner = (board: Board): { winner: Player; line: number[][] } | null => {
  for (const line of WINNING_LINES) {
    const [[r0, c0], [r1, c1], [r2, c2]] = line;
    const a = board[r0][c0];
    const b = board[r1][c1];
    const c = board[r2][c2];
    if (a && a === b && b === c) {
      return { winner: a as Player, line };
    }
  }
  return null;
};

export const isBoardFull = (board: Board): boolean =>
  board.every((row) => row.every((cell) => cell !== null));

export const makeMove = (
  board: Board,
  row: number,
  col: number,
  player: Player
): Board => {
  const newBoard = board.map((r) => [...r]) as CellValue[][];
  newBoard[row][col] = player;
  return newBoard;
};

export const getNextPlayer = (current: Player): Player =>
  current === 'X' ? 'O' : 'X';
