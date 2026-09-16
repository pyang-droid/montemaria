import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import this

const firebaseConfig = {
  apiKey: "AIzaSyAE0fspY9xXQBBwcHPtvs523L1vZS-C1CE",
  authDomain: "monte-maria.firebaseapp.com",
  projectId: "monte-maria",
  storageBucket: "monte-maria.firebasestorage.app",
  messagingSenderId: "381198821409",
  appId: "1:381198821409:web:b17cb90e0184d4c35fdb60",
  measurementId: "G-VZ13LW8K94"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app); // Add this export
export { app };