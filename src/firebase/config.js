/**
 * Firebase Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Enable Firestore Database and Firebase Authentication (Email/Password)
 * 3. Replace the config values below with your project credentials
 * 4. Enable Google Sign-In in Firebase Console > Authentication > Sign-in method
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// ⚠️ IMPORTANT: Replace with your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKey123456789Demo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'college-scheduling.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'college-scheduling',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'college-scheduling.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// For development: Use Firestore emulator (optional)
// Uncomment below to test locally without real Firebase
// if (window.location.hostname === 'localhost') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export { signInWithPopup, signOut };
