import { describe, it, expect, vi } from 'vitest';
import {
  successResponse,
  errorResponse,
  jsonSuccess,
  jsonError,
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
} from './response';

describe('Response Utilities', () => {
  describe('successResponse', () => {
    it('returns success response with data and default message', () => {
      const data = { score: 15, category: 'Moderate Stress' };
      const result = successResponse(data);

      expect(result).toEqual({
        success: true,
        data: { score: 15, category: 'Moderate Stress' },
        message: 'Success',
      });
    });

    it('returns success response with custom message', () => {
      const data = { score: 5 };
      const result = successResponse(data, 'Results submitted successfully');

      expect(result.message).toBe('Results submitted successfully');
    });
  });

  describe('errorResponse', () => {
    it('returns error response with error and default message', () => {
      const result = errorResponse('Token expired');

      expect(result).toEqual({
        success: false,
        error: 'Token expired',
        message: undefined,
      });
    });

    it('returns error response with custom message', () => {
      const result = errorResponse('Invalid request', 'Request validation failed');

      expect(result.message).toBe('Request validation failed');
    });
  });

  describe('jsonSuccess', () => {
    it('returns Response with correct headers and status', () => {
      const response = jsonSuccess(new Response(), { score: 15 }, 200);

      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.status).toBe(200);
    });

    it('returns Response with custom status code', () => {
      const response = jsonSuccess(new Response(), { score: 25 }, 201);

      expect(response.status).toBe(201);
    });
  });

  describe('jsonError', () => {
    it('returns Response with correct headers and status', () => {
      const response = jsonError(new Response(), 'Invalid token', 401);

      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.status).toBe(401);
    });
  });
});
