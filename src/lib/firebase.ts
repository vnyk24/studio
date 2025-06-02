
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth, browserLocalPersistence, initializeAuth, indexedDBLocalPersistence, inMemoryPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

// Only attempt to initialize if the API key and Project ID are present
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error("Firebase app initialization error:", error);
      // If app initialization fails, we can't proceed to initialize auth
    }
  } else {
    app = getApp();
  }

  if (app) {
    if (typeof window !== 'undefined') {
      // Client-side: use initializeAuth for persistence options
      try {
        // Attempt with indexedDB first, then local, then inMemory as fallbacks
        auth = initializeAuth(app, {
          persistence: [indexedDBLocalPersistence, browserLocalPersistence, inMemoryPersistence]
        });
      } catch (error) {
        console.error("Firebase Auth (initializeAuth) client-side error:", error);
        // Fallback to getAuth if initializeAuth has issues
        try {
            auth = getAuth(app);
        } catch (getAuthError) {
            console.error("Firebase Auth (getAuth fallback) client-side error:", getAuthError);
        }
      }
    } else {
      // Server-side: use getAuth
      try {
        auth = getAuth(app);
      } catch (error) {
        console.error("Firebase Auth (getAuth) server-side error:", error);
      }
    }
  }
} else {
  if (!firebaseConfig.apiKey) {
    console.warn(
      "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing. Firebase will not be initialized. " +
      "Please ensure it is set in your .env.local file and the Next.js development server is restarted."
    );
  }
  if (!firebaseConfig.projectId) {
    console.warn(
      "Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing. Firebase will not be initialized. " +
      "Please ensure it is set in your .env.local file and the Next.js development server is restarted."
    );
  }
}

export { app, auth };
