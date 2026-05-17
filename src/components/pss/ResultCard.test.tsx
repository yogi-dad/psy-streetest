import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResultCard } from './ResultCard';

describe('ResultCard', () => {
  it('renders the stress category for the score', () => {
    render(<ResultCard score={30} />);

    expect(screen.getByText('High Stress')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('does not show a frontend submission email panel', () => {
    render(<ResultCard score={15} />);

    expect(screen.queryByText('Submission Requested')).not.toBeInTheDocument();
    expect(screen.queryByText('The assessment was submitted for:')).not.toBeInTheDocument();
  });
});
