
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth, browserLocalPersistence, initializeAuth, indexedDBLocalPersistence, inMemoryPersistence } from 'firebase/auth';

// It's good practice to explicitly type the config structure.
interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

const essentialVarsPresent = firebaseConfig.apiKey && firebaseConfig.projectId;

if (essentialVarsPresent) {
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
  const missingVars: string[] = [];
  if (!firebaseConfig.apiKey) missingVars.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!firebaseConfig.projectId) missingVars.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");

  if (missingVars.length > 0) {
    console.warn(
      `Firebase Initialization SKIPPED. The following critical environment variable(s) are missing: ${missingVars.join(', ')}. ` +
      "Please ensure they are set in your .env.local file and the Next.js development server is restarted. " +
      "Firebase features, including Authentication, will not work."
    );
  }
}

// Final check and warnings after all initialization attempts
if (!auth) {
  if (essentialVarsPresent) {
    // This case is more serious: vars were there, but auth still failed.
    console.error(
      "CRITICAL Firebase Auth Initialization Failure: The 'auth' object is null even though Firebase config variables " +
      "(API Key, Project ID) appear to be present. This indicates a deeper issue with Firebase setup or SDK initialization. " +
      "Authentication WILL NOT WORK. Please check: \n" +
      "1. Your Firebase project settings in the Firebase console (is the project active? are the credentials correct?).\n" +
      "2. Network connectivity to Firebase services from your environment.\n" +
      "3. Any console errors logged above this message from the Firebase SDKs during initialization attempts.\n" +
      "4. Ensure you've enabled necessary Sign-in providers (e.g., Google) in the Firebase Authentication console.\n" +
      "5. Double-check that your .env.local file is correctly formatted and saved, and that you've RESTARTED your Next.js development server after any changes to it."
    );
  } else {
    // This case means essential vars were missing from the start.
    // The earlier warning already covered this, but an additional note here reinforces it.
    console.warn(
        "Firebase Auth is not initialized because essential configuration variables (API Key, Project ID) are missing. Authentication will not work."
    );
  }
}

export { app, auth };
