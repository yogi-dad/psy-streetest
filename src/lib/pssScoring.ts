// Remove unused imports

export function getAnswerFromOption(value: number) {
  return Object.values({ 0: 'Strongly disagree', 1: 'Disagree', 2: 'Agree', 3: 'Strongly agree' })[value];
}

export function formatScoreDisplay(score: number, total: number): string {
  const percentage = Math.round((score / total) * 100);
  return `${percentage}% - ${getCategoryLabel(score)}`;
}

export function getCategoryLabel(score: number): string {
  if (score <= 10) return 'Low Stress';
  if (score <= 25) return 'Moderate Stress';
  return 'High Stress';
}

// Validation helper
export function validateAnswers(answers: any[]): boolean {
  return answers.every(
    (answer) => answer.questionId >= 1 && answer.questionId <= 10
  );
}
