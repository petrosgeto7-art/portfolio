// Client-side Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBfakdbU5uHjc13H0tVCD73E_bilkJWF9s",
  authDomain: "pportfolioo-a8286.firebaseapp.com",
  projectId: "pportfolioo-a8286",
  storageBucket: "pportfolioo-a8286.firebasestorage.app",
  messagingSenderId: "1042362084213",
  appId: "1:1042362084213:web:63199a4c7a136b8852413c",
  measurementId: "G-81CZ8QNL95"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
