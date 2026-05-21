import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tile } from './Tile';

describe('Tile', () => {
  it('renders nothing visible for value 0', () => {
    const { container } = render(<Tile value={0} />);
    expect(container.firstChild).toHaveClass('tile-empty');
    expect(screen.queryByText('0')).toBeNull();
  });

  it('renders the tile value', () => {
    render(<Tile value={128} />);
    expect(screen.getByText('128')).toBeInTheDocument();
  });

  it('applies correct background color for known values', () => {
    const { container } = render(<Tile value={2} />);
    const tile = container.firstChild as HTMLElement;
    expect(tile.style.backgroundColor).toBe('rgb(238, 228, 218)');
  });

  it('uses dark fallback color for large values', () => {
    const { container } = render(<Tile value={4096} />);
    const tile = container.firstChild as HTMLElement;
    expect(tile.style.backgroundColor).toBe('rgb(60, 58, 50)');
  });
});
