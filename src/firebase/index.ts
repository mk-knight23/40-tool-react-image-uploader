import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCTHVvejKd59JqHj5V1kLuVJE3WMoUOB6s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mkclock.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://mkclock.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mkclock",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mkclock.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "622121225035",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:622121225035:web:be70eb91eb4af1f8f3f6ce"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
export default app;
