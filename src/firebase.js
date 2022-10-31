// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

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
const analytics = getAnalytics(app);

async function createDB() {
  await setDoc(doc(db, '2021', '1'), {});
}
