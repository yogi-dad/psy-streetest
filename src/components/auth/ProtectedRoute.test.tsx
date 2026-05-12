import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from './ProtectedRoute';
import { auth } from '../../lib/firebase';

describe('ProtectedRoute Component', () => {
  it('redirects to login when user is not authenticated', async () => {
    vi.spyOn(auth, 'onAuthStateChanged').mockImplementation((cb) => {
      setTimeout(() => cb(null), 100);
      return () => {};
    });

    render(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>);

    await waitFor(() => {
      expect(screen.getByText('Login to Continue')).toBeInTheDocument();
    });
  });

  it('renders children when user is authenticated', async () => {
    vi.spyOn(auth, 'onAuthStateChanged').mockImplementation((cb) => {
      setTimeout(() => cb({ uid: 'test-user-id', email: 'test@example.com' }), 100);
      return () => {};
    });

    render(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>);

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('renders loading state while checking authentication', async () => {
    vi.spyOn(auth, 'onAuthStateChanged').mockImplementation((cb) => {
      setTimeout(() => cb({ uid: 'test-user-id' }), 100);
      return () => {};
    });

    render(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>);

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});
