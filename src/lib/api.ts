import { auth } from './firebase';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Submit PSS result to Netlify Function
export async function submitPssResult(
  answers: any[],
  userId: string
): Promise<ApiResponse<{ score: number; category: string }>> {
  try {
    const user = auth?.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    const token = await user.getIdToken();

    const response = await fetch('/.netlify/functions/submit-pss-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        answers,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || 'Failed to submit results',
      };
    }

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    console.error('Error submitting PSS result:', error);
    return {
      success: false,
      error: 'Network error submitting results',
    };
  }
}
