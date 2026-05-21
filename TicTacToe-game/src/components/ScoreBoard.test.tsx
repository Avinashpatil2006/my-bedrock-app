import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreBoard } from './ScoreBoard';

describe('ScoreBoard', () => {
  it('renders all three score labels', () => {
    render(<ScoreBoard xScore={0} oScore={0} draws={0} />);
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('O')).toBeInTheDocument();
    expect(screen.getByText('Draw')).toBeInTheDocument();
  });

  it('displays the correct scores', () => {
    render(<ScoreBoard xScore={3} oScore={1} draws={2} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
