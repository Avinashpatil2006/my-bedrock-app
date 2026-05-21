import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Leaderboard } from './Leaderboard';

const entries = [
  { score: 4096, date: '5/21/2026' },
  { score: 2048, date: '5/20/2026' },
  { score: 512, date: '5/19/2026' },
];

describe('Leaderboard', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Leaderboard isOpen={false} entries={entries} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the popup when open', () => {
    render(<Leaderboard isOpen={true} entries={entries} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
  });

  it('displays all entries', () => {
    render(<Leaderboard isOpen={true} entries={entries} onClose={vi.fn()} />);
    expect(screen.getByText('4,096')).toBeInTheDocument();
    expect(screen.getByText('2,048')).toBeInTheDocument();
    expect(screen.getByText('512')).toBeInTheDocument();
  });

  it('shows empty state when no entries', () => {
    render(<Leaderboard isOpen={true} entries={[]} onClose={vi.fn()} />);
    expect(screen.getByText(/no scores yet/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<Leaderboard isOpen={true} entries={entries} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: /close leaderboard/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    render(<Leaderboard isOpen={true} entries={entries} onClose={onClose} />);
    await userEvent.click(screen.getByRole('presentation'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = vi.fn();
    render(<Leaderboard isOpen={true} entries={entries} onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ranks entries with #1 first', () => {
    render(<Leaderboard isOpen={true} entries={entries} onClose={vi.fn()} />);
    const ranks = screen.getAllByText(/^#\d+$/);
    expect(ranks[0]).toHaveTextContent('#1');
    expect(ranks[1]).toHaveTextContent('#2');
  });
});
