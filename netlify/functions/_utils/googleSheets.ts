import * as admin from 'firebase-admin';

export async function initializeFirebaseAdmin(): Promise<admin.App> {
  const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  return admin.apps[0];
}

export async function getOrCreatePssSheet(
  admin: admin.App
): Promise<admin.DocumentReference> {
  const db = admin.database();
  const sheetRef = db.ref('pss_assessments');
  return sheetRef;
}

export async function savePssResult(
  admin: admin.App,
  result: { userId: string; answers: any[]; score: number; timestamp: string }
): Promise<void> {
  const db = admin.database();
  const sheetRef = db.ref('pss_assessments');

  // Generate unique key for this result
  const resultKey = `result_${result.userId}_${Date.now()}`;
  const resultRef = sheetRef.child(resultKey);

  await resultRef.set({
    userId: result.userId,
    answers: result.answers,
    score: result.score,
    category: result.category,
    timestamp: result.timestamp,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

export async function listRecentResults(
  admin: admin.App,
  limit: number = 100
): Promise<any[]> {
  const db = admin.database();
  const sheetRef = db.ref('pss_assessments');

  const snapshot = await sheetRef.limitToFirst(limit).once('value');

  if (!snapshot.exists()) {
    return [];
  }

  return Object.values(snapshot.val());
}
