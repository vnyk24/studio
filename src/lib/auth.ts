
'use client';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, User, onAuthStateChanged as firebaseOnAuthStateChanged, AuthProvider } from 'firebase/auth';
import { auth } from './firebase'; // auth instance from firebase.ts

const createFirebaseError = (message: string, originalError?: any): Error => {
  let detailedMessage = message;
  if (originalError) {
    if (originalError.message) {
      detailedMessage += ` Details: ${originalError.message}`;
    }
    if (originalError.code) {
      detailedMessage += ` (Code: ${originalError.code})`;
    }
    // Log the original error object itself for more context
    console.error("Original Firebase Error Object:", originalError);
  }
  console.error(detailedMessage, originalError || ''); // Log detailed message for developers
  return new Error(`Firebase operation failed. Please check your setup or try again. ${originalError?.code ? `(${originalError.code})` : ''}`);
};

const getGoogleProvider = (): AuthProvider | null => {
  try {
    const provider = new GoogleAuthProvider();
    // You could add custom parameters here if needed, e.g.:
    // provider.addScope('profile');
    // provider.setCustomParameters({ 'login_hint': 'user@example.com' });
    return provider;
  } catch (e) {
    console.error("Failed to create GoogleAuthProvider:", e);
    return null;
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  console.log("signInWithGoogle: Attempting Google sign-in.");

  if (!auth) {
    console.error("signInWithGoogle: Firebase Auth object (from lib/firebase) is NULL. This means Firebase app/auth initialization in 'src/lib/firebase.ts' FAILED. Check server logs & browser console for errors from 'firebase.ts' regarding missing .env.local variables or other initialization problems.");
    throw createFirebaseError("Firebase Auth is not initialized. Crucial setup step failed. Check console logs for details from 'firebase.ts' and ensure '.env.local' is correct & server was restarted.");
  } else {
    // Log details about the existing auth object
    // Using 'auth.app.options' might expose the full config, be mindful in shared logs.
    // However, for local debugging, apiKey is key.
    console.log("signInWithGoogle: Firebase Auth object IS NOT NULL. Details:", {
      appName: auth.app?.name, // Should be '[DEFAULT]'
      appApiKey: auth.app?.options?.apiKey, // CRUCIAL: This should match your NEXT_PUBLIC_FIREBASE_API_KEY
      authInitialized: (auth as any)._isInitialized, // Internal flag, but can be indicative
    });
  }

  const provider = getGoogleProvider();
  if (!provider) {
     console.error("signInWithGoogle: Google Auth Provider is NULL. This suggests an issue with the Firebase SDK itself or an unexpected error during GoogleAuthProvider instantiation.");
     throw createFirebaseError("Failed to initialize Google Auth provider. Cannot sign in.");
  } else {
    console.log("signInWithGoogle: Google Auth Provider IS NOT NULL. Provider ID:", provider.providerId);
  }

  try {
    console.log("signInWithGoogle: Calling signInWithPopup with the auth object and provider object logged above.");
    const result = await signInWithPopup(auth, provider);
    console.log("signInWithGoogle: signInWithPopup successful. User:", result.user?.uid);
    return result.user;
  } catch (error: any) {
    console.error("signInWithGoogle: signInWithPopup FAILED. Error Code:", error.code, "Error Message:", error.message);
    // Log the auth object again on error to see if it changed or provides more context
    console.error("signInWithGoogle: Auth object state at time of signInWithPopup failure:", {
        appName: auth?.app?.name,
        appApiKey: auth?.app?.options?.apiKey,
    });
    throw createFirebaseError("Google Sign-In Failed.", error);
  }
};

// For Firebase, sign-up with Google is the same flow as sign-in
export const signUpWithGoogle = signInWithGoogle;

export const signOutUser = async (): Promise<void> => {
  if (!auth) {
    console.warn("signOutUser: Firebase Auth is not initialized. Cannot sign out. User might not be signed in or Firebase is not configured.");
    return; // Gracefully do nothing if auth isn't available
  }
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw createFirebaseError("Sign Out Failed.", error);
  }
};

// Wrapper for onAuthStateChanged to be used in client components
export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  if (!auth) {
    console.warn("onAuthStateChanged: Firebase Auth is not initialized. Auth state listener will not be active. Assuming no user is signed in. Check 'firebase.ts' logs.");
    callback(null);
    return () => {}; 
  }
  try {
    return firebaseOnAuthStateChanged(auth, callback);
  } catch (error: any) {
    console.error("Error setting up onAuthStateChanged listener:", error);
    callback(null);
    return () => {};
  }
};
