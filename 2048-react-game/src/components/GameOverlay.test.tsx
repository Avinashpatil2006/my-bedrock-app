import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameOverlay } from './GameOverlay';

describe('GameOverlay', () => {
  it('renders nothing when not won or game over', () => {
    const { container } = render(
      <GameOverlay won={false} gameOver={false} onRestart={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows "You Win!" when won', () => {
    render(<GameOverlay won={true} gameOver={false} onRestart={vi.fn()} onContinue={vi.fn()} />);
    expect(screen.getByText('You Win!')).toBeInTheDocument();
  });

  it('shows "Game Over!" when game over', () => {
    render(<GameOverlay won={false} gameOver={true} onRestart={vi.fn()} />);
    expect(screen.getByText('Game Over!')).toBeInTheDocument();
  });

  it('calls onContinue when Keep Playing is clicked', async () => {
    const onContinue = vi.fn();
    render(<GameOverlay won={true} gameOver={false} onRestart={vi.fn()} onContinue={onContinue} />);
    await userEvent.click(screen.getByRole('button', { name: /keep playing/i }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('calls onRestart when Try Again is clicked', async () => {
    const onRestart = vi.fn();
    render(<GameOverlay won={false} gameOver={true} onRestart={onRestart} />);
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
