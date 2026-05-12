import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppShell } from './AppShell';

describe('AppShell Component', () => {
  const mockChildren = <div data-testid="children">Child content</div>;

  it('renders header by default', () => {
    render(<AppShell>{mockChildren}</AppShell>);

    expect(screen.getByText('Perceived Stress Scale')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<AppShell>{mockChildren}</AppShell>);
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('has gray background', () => {
    const { container } = render(<AppShell>{mockChildren}</AppShell>);
    const main = container.querySelector('main');
    expect(main).toHaveClass('bg-gray-50');
  });

  it('can hide header', () => {
    render(<AppShell showHeader={false}>{mockChildren}</AppShell>);

    expect(screen.queryByText('Perceived Stress Scale')).not.toBeInTheDocument();
  });

  it('renders main content area', () => {
    const { container } = render(<AppShell>{mockChildren}</AppShell>);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});
