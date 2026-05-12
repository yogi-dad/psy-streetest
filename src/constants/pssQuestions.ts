export const pssQuestions = [
  {
    id: 1,
    text: "During the past month, how often have you felt that you were unable to control the important things in your life?",
    reverseScore: false,
  },
  {
    id: 2,
    text: "During the past month, how often have you felt nervous and stressed?",
    reverseScore: false,
  },
  {
    id: 3,
    text: "During the past month, how often have you felt lonely?",
    reverseScore: false,
  },
  {
    id: 4,
    text: "During the past month, how often have you felt afraid as if something bad might happen?",
    reverseScore: false,
  },
  {
    id: 5,
    text: "During the past month, how often have you felt that things you were doing were interfering with your life?",
    reverseScore: false,
  },
  {
    id: 6,
    text: "During the past month, how often have you felt like everything you did was an effort?",
    reverseScore: false,
  },
  {
    id: 7,
    text: "During the past month, how often have you felt upset because of something that happened fairly soon?",
    reverseScore: false,
  },
  {
    id: 8,
    text: "During the past month, how often have you felt restless?",
    reverseScore: false,
  },
  {
    id: 9,
    text: "During the past month, how often have you felt confused about something?",
    reverseScore: false,
  },
  {
    id: 10,
    text: "During the past month, how often have you felt that you could not cope with all the things that you had to do?",
    reverseScore: false,
  },
];

export const pssOptions = [
  { value: 0, label: 'Strongly disagree', points: 0 },
  { value: 1, label: 'Disagree', points: 1 },
  { value: 2, label: 'Agree', points: 2 },
  { value: 3, label: 'Strongly agree', points: 3 },
];

// Initialize with all answers at value 0 (Strongly disagree)
export const initialAnswers = pssQuestions.map((q) => ({
  questionId: q.id,
  answerValue: 0,
}));

// Calculate raw score (sum of points)
export function calculateScore(answers: any[]): number {
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
