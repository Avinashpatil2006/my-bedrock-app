import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  it('shows current player turn when no winner', () => {
    render(<StatusBar currentPlayer="X" winner={null} />);
    expect(screen.getByText("Player X's turn")).toBeInTheDocument();
  });

  it('shows winner message for X', () => {
    render(<StatusBar currentPlayer="O" winner="X" />);
    expect(screen.getByText('Player X wins!')).toBeInTheDocument();
  });

  it('shows winner message for O', () => {
    render(<StatusBar currentPlayer="X" winner="O" />);
    expect(screen.getByText('Player O wins!')).toBeInTheDocument();
  });

  it("shows draw message", () => {
    render(<StatusBar currentPlayer="X" winner="draw" />);
    expect(screen.getByText("It's a draw!")).toBeInTheDocument();
  });
});
