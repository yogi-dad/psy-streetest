import type { Demographics } from '../types/demographics';

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';

export interface GoogleScriptSubmissionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface GoogleScriptPrevalidationResult {
  success: boolean;
  canSubmit?: boolean;
  exists?: boolean;
  message?: string;
  error?: string;
}

export async function prevalidateAssessmentEmail(email: string): Promise<GoogleScriptPrevalidationResult> {
  if (!SCRIPT_URL) {
    console.warn('VITE_GOOGLE_APPS_SCRIPT_URL not configured');
    return {
      success: false,
      error: 'Google Apps Script URL not configured',
    };
  }

  try {
    const url = new URL(SCRIPT_URL);
    url.searchParams.set('action', 'prevalidate');
    url.searchParams.set('email', email);

    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to prevalidate email',
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error prevalidating assessment email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to prevalidate email',
    };
  }
}

export async function submitAssessmentToGoogleScript(
  demographics: Demographics,
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
      ...demographics,
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
