import { useState } from 'react';
import { calculateScore, categorizeScore, pssQuestions, pssOptions } from '../../constants/pssQuestions';
import type { PSSAnswer } from '../../types/pss';

type DraftAnswer = {
  questionId: number;
  answerValue: number | null;
};

type PssFormProps = {
  onFormComplete: (score: number, answers: PSSAnswer[]) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function PssForm({ onFormComplete, isSubmitting = false }: PssFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<DraftAnswer[]>(
    pssQuestions.map((q) => ({
      questionId: q.id,
      answerValue: null,
    }))
  );

  const currentQuestion = pssQuestions[currentQuestionIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id)?.answerValue ?? null;
  const completedCount = answers.filter((a) => a.answerValue !== null).length;
  const scoredAnswers = answers.filter((answer): answer is PSSAnswer => answer.answerValue !== null);
  const totalScore = calculateScore(scoredAnswers);
  const isAllAnswered = completedCount === pssQuestions.length;
  const isLastQuestion = currentQuestionIndex === pssQuestions.length - 1;

  const handleAnswer = (value: number) => {
    if (isSubmitting) {
      return;
    }

    setAnswers((prev) =>
      prev.map((a) => (a.questionId === currentQuestion.id ? { ...a, answerValue: value } : a))
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < pssQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (!isAllAnswered || isSubmitting) {
      return;
    }

    onFormComplete(totalScore, scoredAnswers);
  };

  const progress = ((currentQuestionIndex + 1) / pssQuestions.length) * 100;
  const stressCategory = categorizeScore(totalScore);
  const stressLevel = stressCategory.replace(' Stress', '');
  const stressColor = stressCategory === 'Low Stress' ? 'emerald' : stressCategory === 'Moderate Stress' ? 'amber' : 'rose';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
            Stress Scale
          </h1>
          <p className="text-gray-600">Understand your stress level</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Question {currentQuestionIndex + 1} of {pssQuestions.length}
            </span>
            <span className={`text-sm font-bold text-${stressColor}-600`}>
              {stressLevel} Stress
            </span>
          </div>
          <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Answered: {completedCount}</span>
            <span>Score: {totalScore}</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {isSubmitting && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/85 backdrop-blur-sm">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
              <p className="text-sm font-semibold text-gray-700">Submitting your assessment...</p>
            </div>
          )}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
              Question {currentQuestionIndex + 1}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-tight">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3 mb-10">
            {pssOptions.map((option) => {
              const isSelected = currentAnswer === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  disabled={isSubmitting}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left font-medium ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50 text-primary-900 shadow-md scale-105'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                        isSelected ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0 || isSubmitting}
              className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <div className="text-sm text-gray-500">
              {isSubmitting ? 'Submitting...' : currentAnswer !== null ? 'Answered' : 'Select an option'}
            </div>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!isAllAnswered || isSubmitting}
                className="px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentAnswer === null || isSubmitting}
                className="px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            )}
          </div>

          {isAllAnswered && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
              <p className="text-sm text-emerald-800 font-medium">
                All questions answered. Submit to view results.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500 max-w-2xl">
        <p>This assessment is for personal understanding. Consult a healthcare professional for medical advice.</p>
      </div>
    </div>
  );
}
