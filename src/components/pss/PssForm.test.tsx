import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PssForm } from './PssForm';

// Mock constants
vi.mock('../../constants/pssQuestions', () => ({
  pssQuestions: [
    { id: 1, text: 'Question 1', reverseScore: false },
    { id: 2, text: 'Question 2', reverseScore: false },
  ],
  initialAnswers: [
    { questionId: 1, answerValue: 0 },
    { questionId: 2, answerValue: 0 },
  ],
}));

describe('PssForm Component', () => {
  const mockOnFormComplete = vi.fn();

  it('renders all questions', () => {
    render(<PssForm onFormComplete={mockOnFormComplete} />);

    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Question 2')).toBeInTheDocument();
  });

  it('renders progress preview section', () => {
    render(<PssForm onFormComplete={mockOnFormComplete} />);

    expect(screen.getByText('Your Score Preview')).toBeInTheDocument();
    expect(screen.getByText('You\'ve answered 0 of 2 questions')).toBeInTheDocument();
  });

  it('renders current score display', () => {
    render(<PssForm onFormComplete={mockOnFormComplete} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('calls onFormComplete when all questions are answered', async () => {
    const mockOnFormComplete = vi.fn();

    // Answer question 1
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '2' },
    });

    // Answer question 2
    const question2Select = screen.getAllByRole('combobox')[1];
    fireEvent.change(question2Select, {
      target: { value: '1' },
    });

    // Wait for completion
    await waitFor(() => {
      expect(mockOnFormComplete).toHaveBeenCalled();
    });
  });

  it('updates completed question count', async () => {
    render(<PssForm onFormComplete={mockOnFormComplete} />);

    // Answer question 1
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '2' },
    });

    await waitFor(() => {
      expect(screen.getByText('You\'ve answered 1 of 2 questions')).toBeInTheDocument();
    });
  });

  it('displays score category', () => {
    render(<PssForm onFormComplete={mockOnFormComplete} />);

    expect(screen.getByText('Low Stress')).toBeInTheDocument();
  });

  it('shows disclaimer at bottom', () => {
    render(<PssForm onFormComplete={mockOnFormComplete} />);

    expect(
      screen.getByText(
        'This assessment is for personal use only. Consult a healthcare professional for medical advice.'
      )
    ).toBeInTheDocument();
  });

  it('has gradient header', () => {
    const { container } = render(<PssForm onFormComplete={mockOnFormComplete} />);
    const header = container.querySelector('[class*="gradient"]');
    expect(header).toBeInTheDocument();
  });
});
