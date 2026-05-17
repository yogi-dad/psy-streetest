import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PssForm } from './PssForm';

describe('PssForm', () => {
  it('renders the first question and initial progress state', () => {
    render(<PssForm onFormComplete={vi.fn()} />);

    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
    expect(screen.getByText('Answered: 0')).toBeInTheDocument();
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('enables moving forward after selecting an answer', () => {
    render(<PssForm onFormComplete={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sometimes' }));

    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    expect(screen.getByText('Answered: 1')).toBeInTheDocument();
    expect(screen.getByText('Score: 2')).toBeInTheDocument();
  });

  it('submits the completed questionnaire with the total score', () => {
    const onFormComplete = vi.fn();
    render(<PssForm onFormComplete={onFormComplete} />);

    for (let index = 0; index < 10; index += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Sometimes' }));

      const nextButton = screen.queryByRole('button', { name: 'Next' });
      if (nextButton) {
        fireEvent.click(nextButton);
      }
    }

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onFormComplete).toHaveBeenCalledWith(
      20,
      expect.arrayContaining([
        { questionId: 1, answerValue: 2 },
        { questionId: 10, answerValue: 2 },
      ])
    );
  });
});
