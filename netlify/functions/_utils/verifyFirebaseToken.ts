import * as admin from 'firebase-admin';

export async function verifyFirebaseToken(
  token: string
): Promise<{ isValid: boolean; uid: string | null } | null> {
  try {
    const tokenResult = await admin.auth().verifyIdToken(token);
    return {
      isValid: true,
      uid: tokenResult.uid,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function getUserIdFromToken(token: string): string | null {
  const result = verifyFirebaseToken(token);
  return result?.uid || null;
}
