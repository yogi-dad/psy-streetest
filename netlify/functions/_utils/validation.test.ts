import { describe, it, expect } from 'vitest';
import { validatePssSubmission, validateAnswer } from './validation';

describe('Validation Utilities', () => {
  describe('validateAnswer', () => {
    it('returns true for valid answer values', () => {
      expect(validateAnswer(0)).toBe(true);
      expect(validateAnswer(1)).toBe(true);
      expect(validateAnswer(2)).toBe(true);
      expect(validateAnswer(3)).toBe(true);
    });

    it('returns false for invalid answer values', () => {
      expect(validateAnswer(-1)).toBe(false);
      expect(validateAnswer(4)).toBe(false);
    });
  });

  describe('validatePssSubmission', () => {
    it('returns null for valid submission', () => {
      const validData = {
        userId: 'test-uid',
        answers: [
          { questionId: 1, answerValue: 2 },
          { questionId: 2, answerValue: 1 },
          { questionId: 3, answerValue: 3 },
          { questionId: 4, answerValue: 0 },
          { questionId: 5, answerValue: 2 },
          { questionId: 6, answerValue: 1 },
          { questionId: 7, answerValue: 3 },
          { questionId: 8, answerValue: 0 },
          { questionId: 9, answerValue: 2 },
          { questionId: 10, answerValue: 1 },
        ],
        timestamp: new Date().toISOString(),
      };

      const result = validatePssSubmission(validData);

      expect(result).toBeNull();
    });

    it('returns error for missing userId', () => {
      const invalidData = {
        userId: '',
        answers: Array(10).fill(null).map((_, i) => ({ questionId: i + 1, answerValue: 1 })),
        timestamp: new Date().toISOString(),
      };

      const result = validatePssSubmission(invalidData);

      expect(result?.errors[0].message).toBe('User ID is required');
    });

    it('returns error for incorrect number of answers', () => {
      const invalidData = {
        userId: 'test-uid',
        answers: [
          { questionId: 1, answerValue: 2 },
          { questionId: 2, answerValue: 1 },
        ],
        timestamp: new Date().toISOString(),
      };

      const result = validatePssSubmission(invalidData);

      expect(result?.errors[0].message).toBe('Must have exactly 10 answers');
    });

    it('returns error for invalid answer value', () => {
      const invalidData = {
        userId: 'test-uid',
        answers: [
          { questionId: 1, answerValue: 5 },
          { questionId: 2, answerValue: 1 },
        ],
        timestamp: new Date().toISOString(),
      };

      const result = validatePssSubmission(invalidData);

      expect(result?.errors[0].message).toBe('Answer value must be a number');
    });
  });
});
