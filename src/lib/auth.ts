
'use client';

// Using the User type from firebase/auth for structural consistency in the UI,
// but the functions here do not interact with Firebase.
import type { User } from 'firebase/auth';

const createPlaceholderError = (message: string): Error => {
  const fullMessage = `${message} - Backend not implemented in this version.`;
  console.warn(fullMessage); // Use warn for placeholder messages
  return new Error(fullMessage);
};

export const signInWithGoogle = async (): Promise<User> => {
  console.warn("signInWithGoogle: Placeholder function. Google Sign-In not implemented.");
  // This will cause the .catch() in the UI to trigger.
  throw createPlaceholderError("Google Sign-In functionality is not implemented");
  // If you want to simulate a successful login for UI development:
  // return { uid: 'mockuser', email: 'mock@example.com', displayName: 'Mock User', photoURL: null } as User;
};

export const signUpWithGoogle = async (): Promise<User> => {
  console.warn("signUpWithGoogle: Placeholder function. Google Sign-Up not implemented.");
  throw createPlaceholderError("Google Sign-Up functionality is not implemented");
};

export const signOutUser = async (): Promise<void> => {
  console.warn("signOutUser: Placeholder function. Sign out not implemented.");
  // Simulate logout by doing nothing that would throw an error
  return Promise.resolve();
};

export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  console.warn("onAuthStateChanged: Placeholder. Immediately calling callback with null (no user logged in).");
  // Simulate no user being logged in for placeholder purposes
  callback(null);
  // Return a no-op unsubscribe function
  return () => {
    console.warn("onAuthStateChanged: Unsubscribe called for placeholder.");
  };
};
