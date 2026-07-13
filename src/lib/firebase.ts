// Client-side Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAI5hky2hNAgzxaHheCxcMTxDCp9nAoL4E",
  authDomain: "pportfolio-a820b.firebaseapp.com",
  projectId: "pportfolio-a820b",
  storageBucket: "pportfolio-a820b.firebasestorage.app",
  messagingSenderId: "823970815096",
  appId: "1:823970815096:web:2358b68b159c624cc0e18d",
  measurementId: "G-FQ7N8X1QGF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
