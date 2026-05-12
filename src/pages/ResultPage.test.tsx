import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ResultPage } from './ResultPage';

describe('ResultPage Component', () => {
  const mockAnswers = [
    { questionId: 1, answerValue: 2 },
    { questionId: 2, answerValue: 1 },
  ];

  it('renders high stress result', () => {
    render(
      <MemoryRouter>
        <ResultPage score={30} answers={mockAnswers} userEmail="test@example.com" />
      </MemoryRouter>
    );

    expect(screen.getByText('High Stress')).toBeInTheDocument();
  });

  it('renders moderate stress result', () => {
    render(
      <MemoryRouter>
        <ResultPage score={15} answers={mockAnswers} userEmail="test@example.com" />
      </MemoryRouter>
    );

    expect(screen.getByText('Moderate Stress')).toBeInTheDocument();
  });

  it('renders low stress result', () => {
    render(
      <MemoryRouter>
        <ResultPage score={5} answers={mockAnswers} userEmail="test@example.com" />
      </MemoryRouter>
    );

    expect(screen.getByText('Low Stress')).toBeInTheDocument();
  });

  it('displays score value', () => {
    render(
      <MemoryRouter>
        <ResultPage score={20} answers={mockAnswers} userEmail="test@example.com" />
      </MemoryRouter>
    );

    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('displays email confirmation', () => {
    render(
      <MemoryRouter>
        <ResultPage score={20} answers={mockAnswers} userEmail="test@example.com" />
      </MemoryRouter>
    );

    expect(screen.getByText('Results email sent to: test@example.com')).toBeInTheDocument();
  });

  it('renders score range text', () => {
    render(
      <MemoryRouter>
        <ResultPage score={15} answers={mockAnswers} userEmail="test@example.com" />
      </MemoryRouter>
    );

    expect(screen.getByText('Score Range: 0 - 40')).toBeInTheDocument();
  });
});
