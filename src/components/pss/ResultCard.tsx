import { categorizeScore } from '../../constants/pssQuestions';

interface ResultCardProps {
  score: number;
  userEmail: string;
}

export function ResultCard({ score, userEmail }: ResultCardProps) {
  const category = categorizeScore(score);

  const getScoreDetails = (s: number) => {
    if (s <= 10) {
      return {
        title: 'Low Stress',
        color: 'emerald',
        bgGradient: 'from-emerald-50 to-teal-50',
        textColor: 'text-emerald-900',
        badgeColor: 'bg-emerald-100 text-emerald-700',
        interpretation: 'You are managing stress well. Your perceived stress levels are within healthy ranges.',
        suggestions: [
          'Maintain your current stress management practices',
          'Continue with regular exercise and healthy habits',
          'Keep up with social connections and support systems',
        ],
      };
    } else if (s <= 25) {
      return {
        title: 'Moderate Stress',
        color: 'amber',
        bgGradient: 'from-amber-50 to-orange-50',
        textColor: 'text-amber-900',
        badgeColor: 'bg-amber-100 text-amber-700',
        interpretation: 'You are experiencing moderate stress levels. Consider implementing stress-reduction techniques.',
        suggestions: [
          'Practice mindfulness or meditation',
          'Prioritize sleep and exercise',
          'Talk to someone you trust about your concerns',
          'Take regular breaks from stressful activities',
        ],
      };
    } else {
      return {
        title: 'High Stress',
        color: 'rose',
        bgGradient: 'from-rose-50 to-pink-50',
        textColor: 'text-rose-900',
        badgeColor: 'bg-rose-100 text-rose-700',
        interpretation: 'You are experiencing high levels of stress. It may be helpful to seek professional support.',
        suggestions: [
          'Consider speaking with a mental health professional',
          'Develop a stress management plan',
          'Prioritize self-care activities',
          'Reach out to support networks or counseling services',
        ],
      };
    }
  };

  const details = getScoreDetails(score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
      {/* Main Result Card */}
      <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-500">
        {/* Score Section */}
        <div className={`bg-gradient-to-br ${details.bgGradient} rounded-3xl p-10 md:p-12 mb-6 shadow-lg border border-white`}>
          <div className="text-center">
            {/* Badge */}
            <span className={`inline-block px-4 py-2 ${details.badgeColor} rounded-full text-sm font-bold mb-6`}>
              ✓ Assessment Complete
            </span>

            {/* Score Display */}
            <div className="mb-8">
              <div className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                {score}
              </div>
              <div className="text-sm text-gray-600 font-medium">out of 40</div>
            </div>

            {/* Stress Level */}
            <h1 className={`text-4xl md:text-5xl font-bold ${details.textColor} mb-4`}>
              {details.title}
            </h1>

            {/* Score Range Indicator */}
            <div className="mt-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-2 flex-1 bg-emerald-300 rounded-full"></div>
                <div className="h-2 flex-1 bg-amber-300 rounded-full"></div>
                <div className="h-2 flex-1 bg-rose-300 rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 font-medium px-2">
                <span>Low (0-10)</span>
                <span>Moderate (11-25)</span>
                <span>High (26-40)</span>
              </div>
              {/* Your position indicator */}
              <div className="mt-3 h-1 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${
                    score <= 10
                      ? 'from-emerald-400 to-emerald-500'
                      : score <= 25
                      ? 'from-amber-400 to-amber-500'
                      : 'from-rose-400 to-rose-500'
                  }`}
                  style={{ width: `${(score / 40) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interpretation Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What This Means</h2>
          <p className={`${details.textColor} font-medium text-lg leading-relaxed mb-6`}>
            {details.interpretation}
          </p>

          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Suggestions</h3>
          <ul className="space-y-3">
            {details.suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${details.badgeColor} flex-shrink-0 mt-0.5 text-sm font-bold`}>
                  {idx + 1}
                </span>
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Email Confirmation Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-2xl">📧</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Results Sent</h3>
              <p className="text-sm text-gray-700 mb-2">A detailed report has been sent to:</p>
              <p className="text-sm font-mono bg-white px-3 py-2 rounded border border-blue-200 text-blue-900">
                {userEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Disclaimer:</strong> The Perceived Stress Scale (PSS-10) is a self-assessment tool for personal understanding only.
            It is not a diagnostic tool and should not replace professional medical or psychological evaluation. If you are experiencing
            significant stress or mental health concerns, please consult with a qualified healthcare professional.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.href = '/assessment'}
            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition"
          >
            Take Another Assessment
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  );
}
