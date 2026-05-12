import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PssQuestion } from './PssQuestion';

describe('PssQuestion Component', () => {
  const defaultProps = {
    questionId: 1,
    questionText: 'Sample question text',
    selectedAnswer: 0,
    onAnswerChange: vi.fn(),
  };

  it('renders question with correct ID', () => {
    render(<PssQuestion {...defaultProps} />);
    expect(screen.getByText(`Question ${defaultProps.questionId}`)).toBeInTheDocument();
  });

  it('renders question text', () => {
    render(<PssQuestion {...defaultProps} />);
    expect(screen.getByText(defaultProps.questionText)).toBeInTheDocument();
  });

  it('displays answer options', () => {
    render(<PssQuestion {...defaultProps} />);

    expect(screen.getByText('Strongly disagree')).toBeInTheDocument();
    expect(screen.getByText('Disagree')).toBeInTheDocument();
    expect(screen.getByText('Agree')).toBeInTheDocument();
    expect(screen.getByText('Strongly agree')).toBeInTheDocument();
  });

  it('has select element with correct value', () => {
    render(<PssQuestion {...defaultProps} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue(defaultProps.selectedAnswer);
  });

  it('calls onAnswerChange when option is selected', () => {
    const onAnswerChange = vi.fn();
    render(<PssQuestion {...defaultProps} onAnswerChange={onAnswerChange} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '2' },
    });

    expect(onAnswerChange).toHaveBeenCalledWith(1, 2);
  });

  it('shows hover shadow effect', () => {
    const { container } = render(<PssQuestion {...defaultProps} />);
    const questionCard = container.querySelector('[class*="shadow"]');
    expect(questionCard).toBeInTheDocument();
  });

  it('shows badge with question number', () => {
    render(<PssQuestion {...defaultProps} />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent(`Question ${defaultProps.questionId}`);
  });
});
