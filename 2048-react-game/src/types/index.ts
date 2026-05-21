/**
 * Represents a tile on the game board
 */
export interface Tile {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  mergedFrom?: Tile[];
}

/**
 * Game board represented as a 2D array of tile values
 * 0 represents an empty cell
 */
export type Board = number[][];

/**
 * Direction of tile movement
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * A single leaderboard entry
 */
export interface LeaderboardEntry {
  score: number;
  date: string;
}

/**
 * Game state
 */
export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}
