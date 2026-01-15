/**
 * Firebase Authentication utilities
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider, db } from './config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * Register a new user
 * @param {string} email
 * @param {string} password
 * @param {string} role - 'admin' or 'student'
 */
export const registerUser = async (email, password, role = 'student') => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // Store user role in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role: role,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign in with email and password
 */
export const loginUser = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign in with Google
 */
export const loginWithGoogle = async () => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);

    // Check if user exists in Firestore, if not create profile
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'student',
        createdAt: new Date().toISOString(),
      });
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign out current user
 */
export const logoutUser = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Get user role from Firestore
 */
export const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role || 'student';
    }
    return 'student';
  } catch (error) {
    console.warn('Could not fetch user role, defaulting to student:', error.message);
    return 'student';
  }
};

/**
 * Watch auth state changes
 */
export const watchAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};
