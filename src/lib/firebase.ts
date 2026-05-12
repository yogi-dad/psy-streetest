import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Use type assertion to access env variables (vite will handle this)
const env = (import.meta as any).env;

// Firebase config - these would be loaded from .env
const firebaseConfig = {
  apiKey: env?.VITE_FIREBASE_API_KEY || 'your-api-key',
  authDomain: env?.VITE_FIREBASE_AUTH_DOMAIN || 'your-auth-domain',
  projectId: env?.VITE_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: env?.VITE_FIREBASE_STORAGE_BUCKET || 'your-storage-bucket',
  messagingSenderId: env?.VITE_FIREBASE_MESSAGING_SENDER_ID || 'your-messaging-sender-id',
  appId: env?.VITE_FIREBASE_APP_ID || 'your-app-id',
};

// Initialize Firebase
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth: Auth = getAuth(app);
export default app;
