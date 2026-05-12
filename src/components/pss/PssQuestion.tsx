import { ChangeEvent } from 'react';
import { pssOptions } from '../../constants/pssQuestions';

interface PssQuestionProps {
  questionId: number;
  questionText: string;
  selectedAnswer: number;
  onAnswerChange: (questionId: number, answerValue: number) => void;
}

export function PssQuestion({
  questionId,
  questionText,
  selectedAnswer,
  onAnswerChange,
}: PssQuestionProps) {
  const handleAnswerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onAnswerChange(questionId, parseInt(e.target.value, 10));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition">
      <div className="mb-3">
        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
          Question {questionId}
        </span>
      </div>
      <p className="text-gray-800 mb-4 text-base leading-relaxed">
        {questionText}
      </p>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          How often have you felt this way?
        </label>
        <select
          value={selectedAnswer}
          onChange={handleAnswerChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
        >
          {pssOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
