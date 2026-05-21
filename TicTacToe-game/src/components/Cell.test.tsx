import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cell } from './Cell';

describe('Cell', () => {
  it('renders empty cell with no text', () => {
    render(<Cell value={null} isWinning={false} onClick={vi.fn()} disabled={false} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('');
  });

  it('renders X value', () => {
    render(<Cell value="X" isWinning={false} onClick={vi.fn()} disabled={false} />);
    expect(screen.getByRole('button')).toHaveTextContent('X');
  });

  it('renders O value', () => {
    render(<Cell value="O" isWinning={false} onClick={vi.fn()} disabled={false} />);
    expect(screen.getByRole('button')).toHaveTextContent('O');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Cell value={null} isWinning={false} onClick={onClick} disabled={false} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Cell value={null} isWinning={false} onClick={onClick} disabled={true} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is disabled when it already has a value', async () => {
    const onClick = vi.fn();
    render(<Cell value="X" isWinning={false} onClick={onClick} disabled={false} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies winning class when isWinning is true', () => {
    render(<Cell value="X" isWinning={true} onClick={vi.fn()} disabled={false} />);
    expect(screen.getByRole('button')).toHaveClass('cell--winning');
  });
});
