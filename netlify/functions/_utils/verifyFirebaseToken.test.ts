import * as admin from 'firebase-admin';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyFirebaseToken, getUserIdFromToken } from './verifyFirebaseToken';

describe('verifyFirebaseToken', () => {
  let mockAdminAuth: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminAuth = vi.mocked(admin.auth().verifyIdToken);
  });

  it('returns valid token result when verification succeeds', async () => {
    const validTokenResult = {
      uid: 'test-uid',
      email: 'test@example.com',
      emailVerified: false,
    };
    mockAdminAuth.mockResolvedValue(validTokenResult);

    const result = await verifyFirebaseToken('valid-token');

    expect(result).toEqual({
      isValid: true,
      uid: 'test-uid',
    });
  });

  it('returns null when token verification fails', async () => {
    mockAdminAuth.mockRejectedValue(new Error('Invalid token'));

    const result = await verifyFirebaseToken('invalid-token');

    expect(result).toBeNull();
  });

  it('logs error when verification fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockAdminAuth.mockRejectedValue(new Error('Invalid token'));

    await verifyFirebaseToken('invalid-token');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Token verification failed')
    );

    consoleSpy.mockRestore();
  });

  describe('getUserIdFromToken', () => {
    it('extracts userId from valid token', async () => {
      mockAdminAuth.mockResolvedValue({ uid: 'test-uid' });

      const result = await getUserIdFromToken('valid-token');

      expect(result).toBe('test-uid');
    });

    it('returns null when token is invalid', async () => {
      mockAdminAuth.mockRejectedValue(new Error('Invalid token'));

      const result = await getUserIdFromToken('invalid-token');

      expect(result).toBeNull();
    });
  });
});
