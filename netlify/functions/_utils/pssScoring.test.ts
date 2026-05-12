import { describe, it, expect } from 'vitest';
import {
  calculateServerScore,
  categorizeServerScore,
  validateServerAnswers,
  detectManipulation,
} from './pssScoring';

describe('Server-side Scoring Utilities', () => {
  describe('calculateServerScore', () => {
    it('calculates score for all answers', () => {
      const answers = [
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
      ];

      const score = calculateServerScore(answers);

      expect(score).toBe(15);
    });

    it('handles all max answers', () => {
      const answers = Array(10)
        .fill(null)
        .map((_, i) => ({ questionId: i + 1, answerValue: 3 }));
      const score = calculateServerScore(answers);
      expect(score).toBe(30);
    });

    it('handles all min answers', () => {
      const answers = Array(10)
        .fill(null)
        .map((_, i) => ({ questionId: i + 1, answerValue: 0 }));
      const score = calculateServerScore(answers);
      expect(score).toBe(0);
    });
  });

  describe('categorizeServerScore', () => {
    it('returns Low Stress for score <= 10', () => {
      expect(categorizeServerScore(10)).toBe('Low Stress');
      expect(categorizeServerScore(5)).toBe('Low Stress');
      expect(categorizeServerScore(0)).toBe('Low Stress');
    });

    it('returns Moderate Stress for score 11-25', () => {
      expect(categorizeServerScore(11)).toBe('Moderate Stress');
      expect(categorizeServerScore(25)).toBe('Moderate Stress');
    });

    it('returns High Stress for score >= 26', () => {
      expect(categorizeServerScore(26)).toBe('High Stress');
      expect(categorizeServerScore(40)).toBe('High Stress');
    });
  });

  describe('validateServerAnswers', () => {
    it('returns true for valid answers array', () => {
      const answers = Array(10)
        .fill(null)
        .map((_, i) => ({ questionId: i + 1, answerValue: 1 }));
      expect(validateServerAnswers(answers)).toBe(true);
    });

    it('returns false for empty array', () => {
      expect(validateServerAnswers([])).toBe(false);
    });

    it('returns false for array with wrong length', () => {
      expect(validateServerAnswers([{ questionId: 1, answerValue: 1 }])).toBe(false);
    });

    it('returns false for answer with invalid value', () => {
      const answers = [
        { questionId: 1, answerValue: 5 },
        { questionId: 2, answerValue: 1 },
      ];
      expect(validateServerAnswers(answers)).toBe(false);
    });
  });

  describe('detectManipulation', () => {
    it('returns true when all answers are the same max value', () => {
      const answers = Array(10)
        .fill(null)
        .map((_, i) => ({ questionId: i + 1, answerValue: 3 }));
      expect(detectManipulation(answers)).toBe(true);
    });

    it('returns true when all answers are Strongly agree', () => {
      const answers = Array(10)
        .fill(null)
        .map((_, i) => ({ questionId: i + 1, answerValue: 3 }));
      expect(detectManipulation(answers)).toBe(true);
    });

    it('returns false for normal answer patterns', () => {
      const answers = [
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
      ];
      expect(detectManipulation(answers)).toBe(false);
    });
  });
});
