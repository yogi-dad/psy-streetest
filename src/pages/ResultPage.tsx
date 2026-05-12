import { ResultCard } from '../components/pss/ResultCard';
import { categorizeScore } from '../constants/pssQuestions';

interface ResultPageProps {
  score: number;
  userEmail: string;
}

export function ResultPage({ score, userEmail }: ResultPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ResultCard score={score} userEmail={userEmail} />
    </div>
  );
}

// Helper component for displaying results from AssessmentPage
export function ResultDisplay({ score, userEmail }: { score: number; userEmail: string }) {
  return <ResultPage score={score} userEmail={userEmail} />;
}
