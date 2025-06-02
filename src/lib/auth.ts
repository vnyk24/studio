
'use client';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, User, onAuthStateChanged as firebaseOnAuthStateChanged, AuthProvider } from 'firebase/auth';
import { auth } from './firebase'; // auth instance from firebase.ts

const createFirebaseError = (message: string, originalError?: any): Error => {
  let detailedMessage = message;
  if (originalError && originalError.message) {
    detailedMessage += ` Details: ${originalError.message}`;
  }
  if (originalError && originalError.code) {
    detailedMessage += ` (Code: ${originalError.code})`;
  }
  console.error(detailedMessage, originalError || ''); // Log detailed error for developers
  // Return a more generic error for UI, but include key info if helpful
  return new Error(`Firebase operation failed. Please check your setup or try again. ${originalError?.code ? `(${originalError.code})` : ''}`);
};

const getGoogleProvider = (): AuthProvider | null => {
  // Provider can be created even if auth is null, but operations will fail.
  // It's better to check auth before attempting operations.
  return new GoogleAuthProvider();
};

export const signInWithGoogle = async (): Promise<User> => {
  if (!auth) {
    throw createFirebaseError("Firebase Auth is not initialized. Cannot sign in. Check your Firebase configuration and .env.local file.");
  }
  const provider = getGoogleProvider();
  if (!provider) {
     // This case should ideally not be reached if GoogleAuthProvider itself is always constructible.
     throw createFirebaseError("Failed to initialize Google Auth provider. Cannot sign in.");
  }
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    throw createFirebaseError("Google Sign-In Failed.", error);
  }
};

// For Firebase, sign-up with Google is the same flow as sign-in
export const signUpWithGoogle = signInWithGoogle;

export const signOutUser = async (): Promise<void> => {
  if (!auth) {
    console.warn("Firebase Auth is not initialized. Cannot sign out. User might not be signed in or Firebase is not configured.");
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
    console.warn("Firebase Auth is not initialized. Auth state listener will not be active. Assuming no user is signed in.");
    // Call callback with null to ensure UI reflects no user state if auth isn't ready
    callback(null);
    return () => {}; // Return a no-op unsubscribe function
  }
  try {
    return firebaseOnAuthStateChanged(auth, callback);
  } catch (error: any) {
    console.error("Error setting up onAuthStateChanged listener:", error);
    // Call callback with null in case of error during setup
    callback(null);
    return () => {}; // Return a no-op unsubscribe function
  }
};
