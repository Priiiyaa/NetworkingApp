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
  apiKey: 'AIzaSyBcpEflqUP4-3WxUpbreFptvreMNRUGM28',
  authDomain: 'um-hackathon-networking.firebaseapp.com',
  projectId: 'um-hackathon-networking',
  storageBucket: 'um-hackathon-networking.firebasestorage.app',
  messagingSenderId: '816246361759',
  appId: '1:816246361759:ios:b00168055803f3ee539caa',
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
