import { beforeEach, describe, expect, it, vi } from 'vitest';

async function loadGoogleScriptModule() {
  vi.resetModules();
  return import('./googleScript');
}

describe('submitAssessmentToGoogleScript', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns an error when the script URL is missing', async () => {
    vi.stubEnv('VITE_GOOGLE_APPS_SCRIPT_URL', '');
    const { submitAssessmentToGoogleScript } = await loadGoogleScriptModule();

    const result = await submitAssessmentToGoogleScript(
      {
        fullName: 'Test User',
        email: 'test@example.com',
        age: '29',
        gender: 'Female',
        location: 'Mumbai',
        employeeId: 'EMP-123',
      },
      12,
      []
    );

    expect(result).toEqual({
      success: false,
      error: 'Google Apps Script URL not configured',
    });
  });

  it('sends the assessment payload with no-cors mode', async () => {
    vi.stubEnv('VITE_GOOGLE_APPS_SCRIPT_URL', 'https://script.google.com/macros/s/test/exec');
    const fetchSpy = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', fetchSpy);
    const { submitAssessmentToGoogleScript } = await loadGoogleScriptModule();

    const answers = [{ questionId: 1, answerValue: 2 }];
    const result = await submitAssessmentToGoogleScript(
      {
        fullName: 'Test User',
        email: 'test@example.com',
        age: '29',
        gender: 'Female',
        location: 'Mumbai',
        employeeId: 'EMP-123',
      },
      12,
      answers
    );

    expect(result.success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://script.google.com/macros/s/test/exec',
      expect.objectContaining({
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      })
    );

    const [, request] = fetchSpy.mock.calls[0];
    expect(JSON.parse(request.body)).toEqual(
      expect.objectContaining({
        fullName: 'Test User',
        email: 'test@example.com',
        age: '29',
        gender: 'Female',
        location: 'Mumbai',
        employeeId: 'EMP-123',
        score: 12,
        answers,
      })
    );
  });

  it('returns an error when fetch throws', async () => {
    vi.stubEnv('VITE_GOOGLE_APPS_SCRIPT_URL', 'https://script.google.com/macros/s/test/exec');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    const { submitAssessmentToGoogleScript } = await loadGoogleScriptModule();

    const result = await submitAssessmentToGoogleScript(
      {
        fullName: 'Test User',
        email: 'test@example.com',
        age: '29',
        gender: 'Female',
        location: 'Mumbai',
        employeeId: 'EMP-123',
      },
      12,
      []
    );

    expect(result).toEqual({
      success: false,
      error: 'network down',
    });
  });
});

describe('prevalidateAssessmentEmail', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns an error when the script URL is missing', async () => {
    vi.stubEnv('VITE_GOOGLE_APPS_SCRIPT_URL', '');
    const { prevalidateAssessmentEmail } = await loadGoogleScriptModule();

    const result = await prevalidateAssessmentEmail('test@example.com');

    expect(result).toEqual({
      success: false,
      error: 'Google Apps Script URL not configured',
    });
  });

  it('calls the prevalidate action with the email', async () => {
    vi.stubEnv('VITE_GOOGLE_APPS_SCRIPT_URL', 'https://script.google.com/macros/s/test/exec');
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        canSubmit: true,
        exists: false,
      }),
    });
    vi.stubGlobal('fetch', fetchSpy);
    const { prevalidateAssessmentEmail } = await loadGoogleScriptModule();

    const result = await prevalidateAssessmentEmail('test@example.com');

    expect(result).toEqual({
      success: true,
      canSubmit: true,
      exists: false,
    });
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://script.google.com/macros/s/test/exec?action=prevalidate&email=test%40example.com',
      expect.objectContaining({
        method: 'GET',
      })
    );
  });
});
