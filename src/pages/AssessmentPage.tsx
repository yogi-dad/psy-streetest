import { useState } from 'react';
import { auth } from '../lib/firebase';
import { Header } from '../components/layout/Header';
import { PssForm } from '../components/pss/PssForm';
import { ResultCard } from '../components/pss/ResultCard';
import { submitAssessmentToGoogleScript } from '../lib/googleScript';

export function AssessmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [answers, setAnswers] = useState<any[]>([]);

  const handleFormComplete = async (s: number, a: any[]) => {
    setIsSubmitting(true);
    setScore(s);
    setAnswers(a);

    const userEmail = auth.currentUser?.email || 'user@example.com';
    const result = await submitAssessmentToGoogleScript(userEmail, s, a);

    if (result.success) {
      console.log('Assessment submitted successfully');
      setSubmitted(true);
    } else {
      console.error('Submission failed:', result.error);
    }

    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <>
        <Header />
        <ResultCard score={score} userEmail={auth.currentUser?.email || 'your-email@example.com'} />
      </>
    );
  }

  return (
    <>
      <Header />
      <PssForm onFormComplete={handleFormComplete} isSubmitting={isSubmitting} />
    </>
  );
}
