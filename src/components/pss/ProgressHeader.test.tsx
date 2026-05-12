import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressHeader } from './ProgressHeader';

describe('ProgressHeader Component', () => {
  it('renders application title', () => {
    render(<ProgressHeader />);
    expect(screen.getByText('Perceived Stress Scale')).toBeInTheDocument();
  });

  it('renders instructions text', () => {
    render(<ProgressHeader />);
    expect(
      screen.getByText(
        'Rate how often you have experienced each situation over the past month'
      )
    ).toBeInTheDocument();
  });

  it('renders question counter', () => {
    render(<ProgressHeader />);
    expect(screen.getByText('Questions Remaining:')).toBeInTheDocument();
  });

  it('has correct border styling', () => {
    const { container } = render(<ProgressHeader />);
    const header = container.querySelector('[class*="border-b"]');
    expect(header).toBeInTheDocument();
  });

  it('has background color', () => {
    const { container } = render(<ProgressHeader />);
    const header = container.querySelector('[class*="bg-white"]');
    expect(header).toBeInTheDocument();
  });
});
