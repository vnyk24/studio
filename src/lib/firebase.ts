
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth, browserLocalPersistence, initializeAuth, indexedDBLocalPersistence, inMemoryPersistence } from 'firebase/auth';

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

console.log("FirebaseConfig Check: API Key and Project ID are present?", essentialVarsPresent);
if (!essentialVarsPresent) {
  const missingVars: string[] = [];
  if (!firebaseConfig.apiKey) missingVars.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!firebaseConfig.projectId) missingVars.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  console.warn(
    `Firebase Initialization SKIPPED. Critical environment variable(s) missing: ${missingVars.join(', ')}. ` +
    "Check .env.local and restart Next.js server. Firebase features WILL NOT WORK."
  );
} else {
  console.log("Attempting Firebase app initialization with config:", firebaseConfig);
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      console.log("Firebase app initialized successfully with initializeApp().");
    } catch (error: any) {
      console.error("CRITICAL: Firebase app initialization FAILED directly with initializeApp(config). Error Code:", error.code, "Message:", error.message, "Config used:", firebaseConfig);
      app = null; 
    }
  } else {
    app = getApp();
    console.log("Firebase app obtained successfully with getApp().");
  }

  if (app) {
    let authInitializedSuccessfully = false;
    console.log("Firebase app object is valid, attempting Auth initialization.");
    if (typeof window !== 'undefined') {
      console.log("Client-side: Attempting initializeAuth...");
      try {
        auth = initializeAuth(app, {
          persistence: [indexedDBLocalPersistence, browserLocalPersistence, inMemoryPersistence]
        });
        authInitializedSuccessfully = true;
        console.log("Firebase Auth initialized client-side via initializeAuth.");
      } catch (error: any) {
        console.error("Firebase Auth (initializeAuth) client-side error. Code:", error.code, "Message:", error.message);
        // Fallback to getAuth if initializeAuth failed (e.g., unsupported environment)
        console.log("Attempting client-side fallback to getAuth...");
        try {
            auth = getAuth(app);
            authInitializedSuccessfully = true;
            console.log("Firebase Auth initialized client-side via getAuth (fallback).");
        } catch (getAuthError: any) {
            console.error("Firebase Auth (getAuth fallback) client-side error. Code:", getAuthError.code, "Message:", getAuthError.message);
            auth = null; 
        }
      }
    } else {
      console.log("Server-side: Attempting getAuth...");
      try {
        auth = getAuth(app);
        authInitializedSuccessfully = true;
        console.log("Firebase Auth initialized server-side via getAuth.");
      } catch (error: any) {
        console.error("Firebase Auth (getAuth) server-side error. Code:", error.code, "Message:", error.message);
        auth = null;
      }
    }

    if (!authInitializedSuccessfully || !auth) {
      console.error("CRITICAL: Firebase Auth object is NULL or authInitializedSuccessfully is FALSE after all attempts. Auth WILL NOT WORK.");
      auth = null; // Ensure auth is null if something went critically wrong
    } else {
      console.log("Firebase Auth object appears to be successfully initialized.");
    }
  } else {
    console.error("CRITICAL: Firebase app object is null (initializeApp likely failed). Firebase Auth cannot be initialized.");
    auth = null; 
  }
}

if (!auth) {
  if (essentialVarsPresent) {
    console.error(
      "CRITICAL Firebase Auth Initialization Failure: The 'auth' object is null DESPITE API Key & Project ID being present. " +
      "This points to a deeper issue (e.g., incorrect values in .env.local, misconfigured Firebase project, network issues, or sign-in providers not enabled in Firebase console). " +
      "Authentication WILL NOT WORK. Review console logs above this message from Firebase SDKs. Ensure .env.local is correct and server was restarted."
    );
  } else {
    // This case was already logged above, but reinforces it.
    console.warn(
        "Firebase Auth is not initialized because essential configuration variables (API Key, Project ID) were missing from the start. Authentication will not work."
    );
  }
}

export { app, auth };
