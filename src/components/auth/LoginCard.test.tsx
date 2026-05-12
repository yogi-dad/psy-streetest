/** @vitest-disable-types */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginCard } from './LoginCard';
import { auth } from '../../lib/firebase';

describe('LoginCard Component', () => {
  it('renders login form with email and password fields', () => {
    render(<LoginCard onSuccess={() => {}} onError={() => {}} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('displays success message after successful login', async () => {
    const mockOnSuccess = vi.fn();
    vi.spyOn(auth, 'signInWithEmailAndPassword').mockResolvedValue({ user: { email: 'test@example.com' } });

    render(<LoginCard onSuccess={mockOnSuccess} onError={() => {}} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message after failed login', async () => {
    const mockOnError = vi.fn();
    vi.spyOn(auth, 'signInWithEmailAndPassword').mockRejectedValue(new Error('Invalid email or password'));

    render(<LoginCard onSuccess={() => {}} onError={mockOnError} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Invalid email or password');
    });
  });

  it('shows loading state during authentication', async () => {
    vi.spyOn(auth, 'signInWithEmailAndPassword').mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ user: { email: 'test@example.com' } }), 1000);
      });
    });

    render(<LoginCard onSuccess={() => {}} onError={() => {}} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    expect(submitButton).toHaveTextContent('Signing in...');

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Sign In');
    });
  });

  it('shows generic error message for unknown errors', async () => {
    vi.spyOn(auth, 'signInWithEmailAndPassword').mockRejectedValue({});

    render(<LoginCard onSuccess={() => {}} onError={() => {}} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });
  });
});
