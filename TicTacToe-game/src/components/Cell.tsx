import type { FC } from 'react';
import type { CellValue } from '../types';

interface CellProps {
  /** The value to display in this cell */
  value: CellValue;
  /** Whether this cell is part of the winning line */
  isWinning: boolean;
  /** Called when the cell is clicked */
  onClick: () => void;
  /** Whether clicking is disabled (game over or cell taken) */
  disabled: boolean;
}

export const Cell: FC<CellProps> = ({ value, isWinning, onClick, disabled }) => {
  const classes = [
    'cell',
    value ? `cell--${value.toLowerCase()}` : '',
    isWinning ? 'cell--winning' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={value ?? 'empty cell'}
    >
      {value}
    </button>
  );
};
