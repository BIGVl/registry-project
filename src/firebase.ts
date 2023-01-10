// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBKakKkeNB5uHu2JKv2QrjMTZxUWD_yG18',
  authDomain: 'hotel-registry-16f87.firebaseapp.com',
  projectId: 'hotel-registry-16f87',
  storageBucket: 'hotel-registry-16f87.appspot.com',
  messagingSenderId: '109587570797',
  appId: '1:109587570797:web:02632e13232278e5065f64',
  measurementId: 'G-YE2CVPX7WK'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
