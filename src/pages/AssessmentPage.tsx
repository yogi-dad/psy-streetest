import { useMemo, useState } from 'react';
import { Header } from '../components/layout/Header';
import { PssForm } from '../components/pss/PssForm';
import { ResultCard } from '../components/pss/ResultCard';
import { prevalidateAssessmentEmail, submitAssessmentToGoogleScript } from '../lib/googleScript';
import type { Demographics } from '../types/demographics';
import type { PSSAnswer } from '../types/pss';

const SUBMITTED_EMAILS_KEY = 'pss-submitted-emails';

const emptyDemographics: Demographics = {
  fullName: '',
  email: '',
  age: '',
  gender: '',
  location: '',
  employeeId: '',
};

const genderOptions = [
  'Female',
  'Male',
  'Non-binary',
  'Prefer not to say',
] as const;

const fieldHelperText: Record<keyof Demographics, string> = {
  fullName: 'Enter your first and last name as it should appear in the assessment record.',
  email: 'Use an active email address. It is used for duplicate checks and result delivery.',
  age: 'Enter your age in whole years. Allowed range: 18 to 80.',
  gender: 'Select the option that best represents you.',
  location: 'Enter your current city, region, or country.',
  employeeId: 'Enter your employee ID exactly as assigned by your organization.',
};

type DemographicFieldErrors = Partial<Record<keyof Demographics, string>>;
type DemographicFieldTouched = Record<keyof Demographics, boolean>;

const emptyTouchedState: DemographicFieldTouched = {
  fullName: false,
  email: false,
  age: false,
  gender: false,
  location: false,
  employeeId: false,
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidFullName(fullName: string) {
  const trimmedName = fullName.trim();
  return /^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(trimmedName) && trimmedName.replace(/\s+/g, ' ').split(' ').length >= 2;
}

function isValidEmail(email: string) {
  const trimmedEmail = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
}

function isValidAge(age: string) {
  const numericAge = Number(age);
  return Number.isInteger(numericAge) && numericAge >= 18 && numericAge <= 80;
}

function getSubmittedEmails() {
  const raw = window.localStorage.getItem(SUBMITTED_EMAILS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function hasSubmitted(email: string) {
  return getSubmittedEmails().includes(normalizeEmail(email));
}

function markSubmitted(email: string) {
  const next = Array.from(new Set([...getSubmittedEmails(), normalizeEmail(email)]));
  window.localStorage.setItem(SUBMITTED_EMAILS_KEY, JSON.stringify(next));
}

function validateDemographics(demographics: Demographics): DemographicFieldErrors {
  const errors: DemographicFieldErrors = {};

  if (!isValidFullName(demographics.fullName)) {
    errors.fullName = 'Enter your full name using letters and at least two words.';
  }

  if (!isValidEmail(demographics.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!isValidAge(demographics.age)) {
    errors.age = 'Age must be a whole number between 18 and 80.';
  }

  if (!demographics.gender) {
    errors.gender = 'Select a gender option to continue.';
  }

  if (!demographics.location.trim()) {
    errors.location = 'Enter your current location.';
  }

  if (!demographics.employeeId.trim()) {
    errors.employeeId = 'Enter your employee ID.';
  }

  return errors;
}

export function AssessmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrevalidating, setIsPrevalidating] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [demographics, setDemographics] = useState<Demographics>(emptyDemographics);
  const [touched, setTouched] = useState<DemographicFieldTouched>(emptyTouchedState);
  const [surveyStarted, setSurveyStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedEmail = useMemo(() => normalizeEmail(demographics.email), [demographics.email]);
  const fieldErrors = useMemo(() => validateDemographics(demographics), [demographics]);
  const isFormValid = Object.keys(fieldErrors).length === 0;

  const handleDemographicsChange = (field: keyof Demographics, value: string) => {
    setDemographics((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleFieldBlur = (field: keyof Demographics) => {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
  };

  const handleStartSurvey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setTouched({
      fullName: true,
      email: true,
      age: true,
      gender: true,
      location: true,
      employeeId: true,
    });

    if (!isFormValid) {
      return;
    }

    setIsPrevalidating(true);

    if (hasSubmitted(trimmedEmail)) {
      setError('A response has already been submitted with this email address.');
      setIsPrevalidating(false);
      return;
    }

    const prevalidation = await prevalidateAssessmentEmail(trimmedEmail);

    if (!prevalidation.success) {
      setError(prevalidation.error || 'Unable to verify this email right now. Please try again.');
      setIsPrevalidating(false);
      return;
    }

    if (!prevalidation.canSubmit) {
      setError(prevalidation.message || 'A response has already been submitted with this email address.');
      markSubmitted(trimmedEmail);
      setIsPrevalidating(false);
      return;
    }

    setSurveyStarted(true);
    setIsPrevalidating(false);
  };

  const handleFormComplete = async (nextScore: number, answers: PSSAnswer[]) => {
    setIsSubmitting(true);
    setScore(nextScore);
    setError(null);

    const result = await submitAssessmentToGoogleScript(
      {
        ...demographics,
        email: trimmedEmail,
      },
      nextScore,
      answers
    );

    if (result.success) {
      markSubmitted(trimmedEmail);
      setSubmitted(true);
    } else {
      setError(result.error || 'Submission failed. Please try again.');
    }

    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <>
        <Header />
        <ResultCard score={score} />
      </>
    );
  }

  if (!surveyStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl items-center px-4 py-10">
          <div className="w-full rounded-3xl bg-white p-8 shadow-xl md:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Participant Details</h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter your demographic details to begin the Perceived Stress Scale survey. Only one submission is allowed per email address on this device.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleStartSurvey} noValidate>
              <div className="grid gap-5 md:grid-cols-2">
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900">
                  Full Name
                  <input
                    id="fullName"
                    required
                    value={demographics.fullName}
                    onChange={(event) => handleDemographicsChange('fullName', event.target.value)}
                    onBlur={() => handleFieldBlur('fullName')}
                    className={`mt-2 w-full rounded-xl border-2 px-4 py-3 font-medium transition focus:outline-none focus:ring-2 ${
                      touched.fullName && fieldErrors.fullName
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                  />
                  <p className={`mt-2 text-xs ${touched.fullName && fieldErrors.fullName ? 'text-red-700' : 'text-gray-500'}`}>
                    {touched.fullName && fieldErrors.fullName ? fieldErrors.fullName : fieldHelperText.fullName}
                  </p>
                </label>

                <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                  Email
                  <input
                    id="email"
                    required
                    type="email"
                    value={demographics.email}
                    onChange={(event) => handleDemographicsChange('email', event.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                    className={`mt-2 w-full rounded-xl border-2 px-4 py-3 font-medium transition focus:outline-none focus:ring-2 ${
                      touched.email && fieldErrors.email
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                  />
                  <p className={`mt-2 text-xs ${touched.email && fieldErrors.email ? 'text-red-700' : 'text-gray-500'}`}>
                    {touched.email && fieldErrors.email ? fieldErrors.email : fieldHelperText.email}
                  </p>
                </label>

                <label htmlFor="age" className="block text-sm font-semibold text-gray-900">
                  Age
                  <input
                    id="age"
                    required
                    type="number"
                    min={18}
                    max={80}
                    value={demographics.age}
                    onChange={(event) => handleDemographicsChange('age', event.target.value)}
                    onBlur={() => handleFieldBlur('age')}
                    className={`mt-2 w-full rounded-xl border-2 px-4 py-3 font-medium transition focus:outline-none focus:ring-2 ${
                      touched.age && fieldErrors.age
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                  />
                  <p className={`mt-2 text-xs ${touched.age && fieldErrors.age ? 'text-red-700' : 'text-gray-500'}`}>
                    {touched.age && fieldErrors.age ? fieldErrors.age : fieldHelperText.age}
                  </p>
                </label>

                <label htmlFor="gender" className="block text-sm font-semibold text-gray-900">
                  Gender
                  <select
                    id="gender"
                    required
                    value={demographics.gender}
                    onChange={(event) => handleDemographicsChange('gender', event.target.value)}
                    onBlur={() => handleFieldBlur('gender')}
                    className={`mt-2 w-full rounded-xl border-2 px-4 py-3 font-medium transition focus:outline-none focus:ring-2 ${
                      touched.gender && fieldErrors.gender
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <p className={`mt-2 text-xs ${touched.gender && fieldErrors.gender ? 'text-red-700' : 'text-gray-500'}`}>
                    {touched.gender && fieldErrors.gender ? fieldErrors.gender : fieldHelperText.gender}
                  </p>
                </label>

                <label htmlFor="location" className="block text-sm font-semibold text-gray-900">
                  Location/Plant
                  <input
                    id="location"
                    required
                    value={demographics.location}
                    onChange={(event) => handleDemographicsChange('location', event.target.value)}
                    onBlur={() => handleFieldBlur('location')}
                    className={`mt-2 w-full rounded-xl border-2 px-4 py-3 font-medium transition focus:outline-none focus:ring-2 ${
                      touched.location && fieldErrors.location
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                  />
                  <p className={`mt-2 text-xs ${touched.location && fieldErrors.location ? 'text-red-700' : 'text-gray-500'}`}>
                    {touched.location && fieldErrors.location ? fieldErrors.location : fieldHelperText.location}
                  </p>
                </label>

                <label htmlFor="employeeId" className="block text-sm font-semibold text-gray-900">
                  Employee ID
                  <input
                    id="employeeId"
                    required
                    value={demographics.employeeId}
                    onChange={(event) => handleDemographicsChange('employeeId', event.target.value)}
                    onBlur={() => handleFieldBlur('employeeId')}
                    className={`mt-2 w-full rounded-xl border-2 px-4 py-3 font-medium transition focus:outline-none focus:ring-2 ${
                      touched.employeeId && fieldErrors.employeeId
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                  />
                  <p className={`mt-2 text-xs ${touched.employeeId && fieldErrors.employeeId ? 'text-red-700' : 'text-gray-500'}`}>
                    {touched.employeeId && fieldErrors.employeeId ? fieldErrors.employeeId : fieldHelperText.employeeId}
                  </p>
                </label>
              </div>

              <button
                type="submit"
                disabled={isPrevalidating || !isFormValid}
                className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 font-semibold text-white transition hover:from-primary-700 hover:to-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPrevalidating ? 'Checking...' : 'Start Survey'}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Header />
      {error && (
        <div className="mx-auto mt-4 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      <PssForm onFormComplete={handleFormComplete} isSubmitting={isSubmitting} />
    </>
  );
}
