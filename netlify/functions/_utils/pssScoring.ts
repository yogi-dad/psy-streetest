import { pssQuestions, pssOptions, initialAnswers } from '../constants/pssQuestions';

export function calculateServerScore(answers: any[]): number {
  return answers.reduce((sum, answer) => sum + answer.answerValue, 0);
}

export function categorizeServerScore(score: number): string {
  if (score <= 10) return 'Low Stress';
  if (score <= 25) return 'Moderate Stress';
  return 'High Stress';
}

// Validate answers before scoring
export function validateServerAnswers(answers: any[]): boolean {
  if (!answers || answers.length !== 10) {
    return false;
  }

  for (const answer of answers) {
    if (answer.answerValue < 0 || answer.answerValue > 3) {
      return false;
    }
  }

  return true;
}

// Detect manipulated answers (optional security enhancement)
export function detectManipulation(answers: any[]): boolean {
  const allSame = answers.every((a) => a.answerValue === answers[0].answerValue);

  if (allSame && answers[0].answerValue === 3) {
    // All "Strongly agree" might indicate manipulation
    return true;
  }

  return false;
}
