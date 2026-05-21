import type { FC } from 'react';
import type { Board as BoardType } from '../types';
import { Tile } from './Tile';

interface BoardProps {
  board: BoardType;
}

/**
 * Game board component that renders all tiles
 */
export const Board: FC<BoardProps> = ({ board }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Tile key={`${rowIndex}-${colIndex}`} value={value} />
        ))
      )}
    </div>
  );
};
