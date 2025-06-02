
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
    return new GoogleAuthProvider();
  } catch (e) {
    console.error("Failed to create GoogleAuthProvider:", e);
    return null;
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  console.log("signInWithGoogle: Attempting Google sign-in. Current auth object state:", auth);

  if (!auth) {
    console.error("signInWithGoogle: Firebase Auth object is null or undefined. Throwing error.");
    throw createFirebaseError("Firebase Auth is not initialized. Cannot sign in. Check your Firebase configuration and .env.local file.");
  }

  const provider = getGoogleProvider();
  console.log("signInWithGoogle: Google Auth Provider object state:", provider);

  if (!provider) {
     console.error("signInWithGoogle: Google Auth Provider is null or undefined. Throwing error.");
     throw createFirebaseError("Failed to initialize Google Auth provider. Cannot sign in.");
  }

  try {
    console.log("signInWithGoogle: Calling signInWithPopup with auth and provider.");
    const result = await signInWithPopup(auth, provider);
    console.log("signInWithGoogle: signInWithPopup successful. User:", result.user);
    return result.user;
  } catch (error: any) {
    console.error("signInWithGoogle: signInWithPopup failed. Error:", error);
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
    console.warn("onAuthStateChanged: Firebase Auth is not initialized. Auth state listener will not be active. Assuming no user is signed in.");
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
