import { describe, it, expect } from 'vitest';
import { getAnswerFromOption, formatScoreDisplay, getCategoryLabel } from './pssScoring';

describe('PSS Scoring Utilities', () => {
  describe('getAnswerFromOption', () => {
    it('returns correct label for value 0', () => {
      expect(getAnswerFromOption(0)).toBe('Never');
    });

    it('returns correct label for value 1', () => {
      expect(getAnswerFromOption(1)).toBe('Almost never');
    });

    it('returns correct label for value 2', () => {
      expect(getAnswerFromOption(2)).toBe('Sometimes');
    });

    it('returns correct label for value 3', () => {
      expect(getAnswerFromOption(3)).toBe('Fairly often');
    });

    it('returns correct label for value 4', () => {
      expect(getAnswerFromOption(4)).toBe('Very often');
    });

    it('returns "Never" for invalid value', () => {
      expect(getAnswerFromOption(-1)).toBe('Never');
    });
  });

  describe('formatScoreDisplay', () => {
    it('formats low score correctly', () => {
      expect(formatScoreDisplay(5, 40)).toBe('13% - Low Stress');
    });

    it('formats moderate score correctly', () => {
      expect(formatScoreDisplay(15, 40)).toBe('38% - Moderate Stress');
    });

    it('formats high score correctly', () => {
      expect(formatScoreDisplay(35, 40)).toBe('88% - High Stress');
    });

    it('handles zero score', () => {
      expect(formatScoreDisplay(0, 40)).toBe('0% - Low Stress');
    });

    it('handles maximum score', () => {
      expect(formatScoreDisplay(40, 40)).toBe('100% - High Stress');
    });
  });

  describe('getCategoryLabel', () => {
    it('returns Low Stress for score 0-13', () => {
      expect(getCategoryLabel(13)).toBe('Low Stress');
      expect(getCategoryLabel(5)).toBe('Low Stress');
      expect(getCategoryLabel(0)).toBe('Low Stress');
    });

    it('returns Moderate Stress for score 14-26', () => {
      expect(getCategoryLabel(14)).toBe('Moderate Stress');
      expect(getCategoryLabel(26)).toBe('Moderate Stress');
      expect(getCategoryLabel(18)).toBe('Moderate Stress');
    });

    it('returns High Stress for score 27-40', () => {
      expect(getCategoryLabel(27)).toBe('High Stress');
      expect(getCategoryLabel(40)).toBe('High Stress');
      expect(getCategoryLabel(35)).toBe('High Stress');
    });
  });
});
