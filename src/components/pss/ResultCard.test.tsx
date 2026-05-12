import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResultCard } from './ResultCard';

describe('ResultCard Component', () => {
  it('renders high stress message for score > 25', () => {
    render(<ResultCard score={30} userEmail="test@example.com" />);
    expect(screen.getByText('High Stress')).toBeInTheDocument();
  });

  it('renders moderate stress message for score between 11-25', () => {
    render(<ResultCard score={18} userEmail="test@example.com" />);
    expect(screen.getByText('Moderate Stress')).toBeInTheDocument();
  });

  it('renders low stress message for score <= 10', () => {
    render(<ResultCard score={5} userEmail="test@example.com" />);
    expect(screen.getByText('Low Stress')).toBeInTheDocument();
  });

  it('displays score number', () => {
    render(<ResultCard score={20} userEmail="test@example.com" />);
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('displays email address', () => {
    render(<ResultCard score={20} userEmail="test@example.com" />);
    expect(screen.getByText('Results email sent to: test@example.com')).toBeInTheDocument();
  });

  it('shows about score information', () => {
    render(<ResultCard score={20} userEmail="test@example.com" />);
    expect(
      screen.getByText(
        'The Perceived Stress Scale (PSS-10) measures perceived stress levels.'
      )
    ).toBeInTheDocument();
  });

  it('shows secure submission notice', () => {
    render(<ResultCard score={20} userEmail="test@example.com" />);
    expect(
      screen.getByText(
        'Your responses will be sent securely via Netlify Functions'
      )
    ).toBeInTheDocument();
  });

  it('renders low stress with green styling', () => {
    const { container } = render(<ResultCard score={8} userEmail="test@example.com" />);
    const card = container.querySelector('[class*="shadow"]');
    expect(card).toHaveStyle('color: green');
  });

  it('renders score range text', () => {
    render(<ResultCard score={15} userEmail="test@example.com" />);
    expect(screen.getByText('Score Range: 0 - 40')).toBeInTheDocument();
  });
});
