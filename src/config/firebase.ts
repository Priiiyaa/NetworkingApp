import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import type { Persistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase v12 does not expose getReactNativePersistence in its public TypeScript types,
// but it IS present in Metro's React Native bundle at runtime.
// This augmentation patches the types to match the actual runtime exports.
declare module 'firebase/auth' {
  export function getReactNativePersistence(
    storage: typeof ReactNativeAsyncStorage
  ): Persistence;
}

// eslint-disable-next-line import/no-duplicates
import { getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Guard against re-initialization on hot reloads
const isNew = getApps().length === 0;
const app = isNew ? initializeApp(firebaseConfig) : getApp();

// initializeAuth with AsyncStorage persistence on first load, getAuth on subsequent reloads
export const auth = isNew
  ? initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    })
  : getAuth(app);

export const db = getFirestore(app);
