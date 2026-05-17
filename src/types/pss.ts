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
