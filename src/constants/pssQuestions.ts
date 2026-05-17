import type { PSSAnswer } from '../types/pss';

export const pssQuestions = [
  {
    id: 1,
    text: 'In the last month, how often have you been upset because of something that happened unexpectedly?',
    reverseScore: false,
  },
  {
    id: 2,
    text: 'In the last month, how often have you felt that you were unable to control the important things in your life?',
    reverseScore: false,
  },
  {
    id: 3,
    text: 'In the last month, how often have you felt nervous and stressed?',
    reverseScore: false,
  },
  {
    id: 4,
    text: 'In the last month, how often have you felt confident about your ability to handle your personal problems?',
    reverseScore: true,
  },
  {
    id: 5,
    text: 'In the last month, how often have you felt that things were going your way?',
    reverseScore: true,
  },
  {
    id: 6,
    text: 'In the last month, how often have you found that you could not cope with all the things that you had to do?',
    reverseScore: false,
  },
  {
    id: 7,
    text: 'In the last month, how often have you been able to control irritations in your life?',
    reverseScore: true,
  },
  {
    id: 8,
    text: 'In the last month, how often have you felt that you were on top of things?',
    reverseScore: true,
  },
  {
    id: 9,
    text: 'In the last month, how often have you been angered because of things that happened that were outside of your control?',
    reverseScore: false,
  },
  {
    id: 10,
    text: 'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?',
    reverseScore: false,
  },
] as const;

export const pssOptions = [
  { value: 0, label: 'Never', points: 0 },
  { value: 1, label: 'Almost never', points: 1 },
  { value: 2, label: 'Sometimes', points: 2 },
  { value: 3, label: 'Fairly often', points: 3 },
  { value: 4, label: 'Very often', points: 4 },
] as const;

export const initialAnswers: PSSAnswer[] = pssQuestions.map((question) => ({
  questionId: question.id,
  answerValue: 0,
}));

function getQuestionById(questionId: number) {
  return pssQuestions.find((question) => question.id === questionId);
}

export function scoreAnswer(answer: PSSAnswer): number {
  const question = getQuestionById(answer.questionId);
  if (!question) {
    return answer.answerValue;
  }

  return question.reverseScore ? 4 - answer.answerValue : answer.answerValue;
}

export function calculateScore(answers: PSSAnswer[]): number {
  return answers.reduce((sum, answer) => sum + scoreAnswer(answer), 0);
}

export function categorizeScore(score: number): string {
  if (score <= 13) return 'Low Stress';
  if (score <= 26) return 'Moderate Stress';
  return 'High Stress';
}
