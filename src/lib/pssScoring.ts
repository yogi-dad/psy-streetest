// Remove unused imports

export function getAnswerFromOption(value: number) {
  return Object.values({
    0: 'Never',
    1: 'Almost never',
    2: 'Sometimes',
    3: 'Fairly often',
    4: 'Very often',
  })[value] ?? 'Never';
}

export function formatScoreDisplay(score: number, total: number): string {
  const percentage = Math.round((score / total) * 100);
  return `${percentage}% - ${getCategoryLabel(score)}`;
}

export function getCategoryLabel(score: number): string {
  if (score <= 13) return 'Low Stress';
  if (score <= 26) return 'Moderate Stress';
  return 'High Stress';
}

// Validation helper
export function validateAnswers(answers: any[]): boolean {
  return answers.every(
    (answer) => answer.questionId >= 1 && answer.questionId <= 10
  );
}
