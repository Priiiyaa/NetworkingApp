import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBcpEflqUP4-3WxUpbreFptvreMNRUGM28',
  authDomain: 'um-hackathon-networking.firebaseapp.com',
  projectId: 'um-hackathon-networking',
  storageBucket: 'um-hackathon-networking.firebasestorage.app',
  messagingSenderId: '816246361759',
  appId: '1:816246361759:ios:b00168055803f3ee539caa',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
