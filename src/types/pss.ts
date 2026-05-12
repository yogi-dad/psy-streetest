import { pssQuestions } from '../constants/pssQuestions';

export interface PSSQuestion {
  id: number;
  text: string;
  reverseScore: boolean;
}

export interface PSSAnswer {
  questionId: number;
  answerValue: number;
}

export interface PSSResult {
  answers: PSSAnswer[];
  score: number;
  percentiles: {
    low: number;
    mid: number;
    high: number;
  };
}

// Initialize with all answers at value 0 (Strongly disagree)
export const initialAnswers: PSSAnswer[] = pssQuestions.map((q) => ({
  questionId: q.id,
  answerValue: 0,
}));

// Calculate raw score (sum of points)
export function calculateScore(answers: PSSAnswer[]): number {
  return answers.reduce((sum, answer) => sum + answer.answerValue, 0);
}

// PSS-10 scoring: 0-40 scale, typically categorized as:
// 0-10: Low stress
// 11-25: Moderate stress
// 26-40: High stress
export function categorizeScore(score: number): string {
  if (score <= 10) return 'Low Stress';
  if (score <= 25) return 'Moderate Stress';
  return 'High Stress';
}
