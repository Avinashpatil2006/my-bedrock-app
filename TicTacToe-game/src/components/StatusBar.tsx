import type { FC } from 'react';
import type { Player } from '../types';

interface StatusBarProps {
  /** Current player whose turn it is */
  currentPlayer: Player;
  /** Game result: winning player, 'draw', or null if in progress */
  winner: Player | 'draw' | null;
}

export const StatusBar: FC<StatusBarProps> = ({ currentPlayer, winner }) => {
  let message: string;

  if (winner === 'draw') {
    message = "It's a draw!";
  } else if (winner) {
    message = `Player ${winner} wins!`;
  } else {
    message = `Player ${currentPlayer}'s turn`;
  }

  const statusClass = winner
    ? winner === 'draw'
      ? 'status status--draw'
      : `status status--win status--${winner.toLowerCase()}`
    : `status status--turn status--${currentPlayer.toLowerCase()}`;

  return (
    <div className={statusClass} role="status" aria-live="polite">
      {message}
    </div>
  );
};
