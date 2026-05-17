import { describe, expect, it } from 'vitest';
import { calculateScore, scoreAnswer } from './pssQuestions';

describe('pssQuestions scoring', () => {
  it('reverse scores the positive-response questions', () => {
    expect(scoreAnswer({ questionId: 4, answerValue: 0 })).toBe(4);
    expect(scoreAnswer({ questionId: 4, answerValue: 4 })).toBe(0);
    expect(scoreAnswer({ questionId: 5, answerValue: 1 })).toBe(3);
    expect(scoreAnswer({ questionId: 7, answerValue: 2 })).toBe(2);
    expect(scoreAnswer({ questionId: 8, answerValue: 3 })).toBe(1);
  });

  it('keeps direct-scored questions unchanged', () => {
    expect(scoreAnswer({ questionId: 1, answerValue: 4 })).toBe(4);
    expect(scoreAnswer({ questionId: 6, answerValue: 2 })).toBe(2);
  });

  it('calculates the full questionnaire total with reverse scoring', () => {
    const answers = [
      { questionId: 1, answerValue: 4 },
      { questionId: 2, answerValue: 4 },
      { questionId: 3, answerValue: 4 },
      { questionId: 4, answerValue: 0 },
      { questionId: 5, answerValue: 0 },
      { questionId: 6, answerValue: 4 },
      { questionId: 7, answerValue: 0 },
      { questionId: 8, answerValue: 0 },
      { questionId: 9, answerValue: 4 },
      { questionId: 10, answerValue: 4 },
    ];

    expect(calculateScore(answers)).toBe(40);
  });
});
