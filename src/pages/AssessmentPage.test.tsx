import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AssessmentPage } from './AssessmentPage';

describe('AssessmentPage Component', () => {
  it('renders assessment form', () => {
    render(
      <MemoryRouter>
        <AssessmentPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Question 2')).toBeInTheDocument();
  });

  it('renders score preview section', () => {
    render(
      <MemoryRouter>
        <AssessmentPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Your Score Preview')).toBeInTheDocument();
  });

  it('renders thank you message after form completion', async () => {
    const mockOnFormComplete = vi.fn();
    render(
      <MemoryRouter>
        <AssessmentPage />
      </MemoryRouter>
    );

    // Simulate form completion
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Wait for submission
    await waitFor(() => {
      expect(screen.getByText('Thank You')).toBeInTheDocument();
    });
  });

  it('shows submission error message', () => {
    render(
      <MemoryRouter>
        <AssessmentPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Check your email for confirmation.')).toBeInTheDocument();
  });

  it('displays submit another assessment button', async () => {
    render(
      <MemoryRouter>
        <AssessmentPage />
      </MemoryRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const button = screen.getByRole('button', { name: /submit another assessment/i });
    expect(button).toBeInTheDocument();
  });
});
