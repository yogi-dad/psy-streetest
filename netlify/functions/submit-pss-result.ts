import * as admin from 'firebase-admin';
import { initializeFirebaseAdmin } from './_utils/googleSheets';
import { calculateServerScore, categorizeServerScore, detectManipulation } from './_utils/pssScoring';
import { validatePssSubmission } from './_utils/validation';
import { successResponse, errorResponse } from './_utils/response';
import { sendResultEmail } from './_utils/email';

export const handler = async (request: Request): Promise<Response> => {
  try {
    // Only allow POST requests
    if (request.method !== 'POST') {
      return errorResponse('Method not allowed', 'Only POST requests are allowed', 405);
    }

    const body = await request.json();

    // Verify Firebase ID token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('Missing or invalid authentication token', 'Valid Firebase ID token required', 401);
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify token
    const adminInstance = await initializeFirebaseAdmin();
    const tokenResult = await adminInstance.auth().verifyIdToken(token);

    if (!tokenResult || !tokenResult.uid) {
      return errorResponse('Invalid token', 'Token verification failed', 401);
    }

    // Validate submission
    const validationError = validatePssSubmission(body);
    if (validationError) {
      return errorResponse(validationError.errors[0].message, 'Invalid submission', 400);
    }

    const { userId, answers, timestamp } = body;

    // Calculate score
    const score = calculateServerScore(answers);
    const category = categorizeServerScore(score);

    // Check for potential manipulation (optional)
    const isManipulated = detectManipulation(answers);
    if (isManipulated) {
      console.warn('Potential manipulation detected for user:', userId);
    }

    // Format result data
    const resultData = {
      userId,
      answers,
      score,
      category,
      timestamp,
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore (using Firebase Admin)
    await adminInstance.database().ref('pss_assessments').push(resultData).set({
      userId,
      answers,
      score,
      category,
      timestamp,
      createdAt: adminInstance.firestore.FieldValue.serverTimestamp(),
    });

    // Send email notification
    const userEmail = body.userEmail || await adminInstance.auth().getUser(tokenResult.uid);
    if (userEmail?.email) {
      const emailSent = await sendResultEmail(userEmail.email, {
        userId,
        score,
        category,
      });
      console.log('Email sent:', emailSent ? 'success' : 'failed');
    }

    // Return success
    return successResponse(
      {
        score,
        category,
        userId: tokenResult.uid,
      },
      'Assessment results submitted successfully'
    );
  } catch (error) {
    console.error('Error in submit-pss-result function:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      'Failed to process assessment submission',
      500
    );
  }
};

export const config = {
  region: 'us-east-1', // Set to match your Netlify region
  maxDuration: 30,
};
