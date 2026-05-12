const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';

export interface GoogleScriptSubmissionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function submitAssessmentToGoogleScript(
  email: string,
  score: number,
  answers: unknown[]
): Promise<GoogleScriptSubmissionResult> {
  if (!SCRIPT_URL) {
    console.warn('VITE_GOOGLE_APPS_SCRIPT_URL not configured');
    return {
      success: false,
      error: 'Google Apps Script URL not configured',
    };
  }

  try {
    const timestamp = new Date().toISOString();
    const payload = {
      email,
      score,
      answers,
      timestamp,
    };

    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Assessment request sent to Google Apps Script',
    };
  } catch (error) {
    console.error('Error submitting assessment to Google Apps Script:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit assessment',
    };
  }
}
