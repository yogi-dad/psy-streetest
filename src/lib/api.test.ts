import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitPssResult, ApiResponse } from './api';

describe('API Functions', () => {
  // Mock auth
  const mockGetIdToken = vi.fn();
  const mockAuth = {
    getIdToken: mockGetIdToken,
  };
  vi.mock('../firebase', () => ({
    auth: mockAuth,
  }));

  const mockUserId = 'test-user-id';
  const mockAnswers = [
    { questionId: 1, answerValue: 2 },
    { questionId: 2, answerValue: 1 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetIdToken.mockResolvedValue('mock-jwt-token');
  });

  describe('submitPssResult', () => {
    it('returns success with data when submission works', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ score: 5, category: 'Low Stress' }),
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await submitPssResult(mockAnswers, mockUserId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ score: 5, category: 'Low Stress' });
      expect(mockGetIdToken).toHaveBeenCalled();
    });

    it('returns error when fetch fails with 400', async () => {
      const mockResponse = {
        ok: false,
        text: async () => 'Invalid request',
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await submitPssResult(mockAnswers, mockUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid request');
    });

    it('returns error when fetch fails with 500', async () => {
      const mockResponse = {
        ok: false,
        text: async () => 'Server error',
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await submitPssResult(mockAnswers, mockUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Server error');
    });

    it('returns error when fetch throws network error', async () => {
      const mockResponse = null;
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await submitPssResult(mockAnswers, mockUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error submitting results');
    });

    it('sends correct request headers with token', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({}),
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      await submitPssResult(mockAnswers, mockUserId);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-jwt-token',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('sends answers and user data in request body', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({}),
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      await submitPssResult(mockAnswers, mockUserId);

      const args = global.fetch.mock.calls[0][1];
      expect(JSON.parse(args.body)).toEqual(
        expect.objectContaining({
          answers: mockAnswers,
          userId: mockUserId,
        })
      );
    });

    it('logs error when submission fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockResponse = null;
      global.fetch = vi.fn().mockRejectedValue(new Error('Connection failed'));

      await submitPssResult(mockAnswers, mockUserId);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error submitting PSS result')
      );

      consoleSpy.mockRestore();
    });
  });
});
