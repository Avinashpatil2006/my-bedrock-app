import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameHeader } from './GameHeader';

describe('GameHeader', () => {
  it('displays score and best score', () => {
    render(<GameHeader score={200} bestScore={500} onReset={vi.fn()} />);
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('calls onReset when New Game is clicked', async () => {
    const onReset = vi.fn();
    render(<GameHeader score={0} bestScore={0} onReset={onReset} />);
    await userEvent.click(screen.getByRole('button', { name: /new game/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
