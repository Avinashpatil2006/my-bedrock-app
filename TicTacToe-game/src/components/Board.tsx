import type { FC } from 'react';
import type { Board as BoardType } from '../types';
import { Cell } from './Cell';

interface BoardProps {
  /** Current board state */
  board: BoardType;
  /** Cells that form the winning line, or null */
  winningLine: number[][] | null;
  /** Whether the game is over */
  gameOver: boolean;
  /** Called when a cell is clicked */
  onCellClick: (row: number, col: number) => void;
}

export const Board: FC<BoardProps> = ({ board, winningLine, gameOver, onCellClick }) => {
  const isWinningCell = (row: number, col: number): boolean =>
    winningLine?.some(([r, c]) => r === row && c === col) ?? false;

  return (
    <div className="board" role="grid" aria-label="Tic-tac-toe board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            isWinning={isWinningCell(rowIndex, colIndex)}
            onClick={() => onCellClick(rowIndex, colIndex)}
            disabled={gameOver}
          />
        ))
      )}
    </div>
  );
};
