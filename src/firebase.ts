import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBN1iWXkbCpcbdQqq-Epb9wneDeMvCzvq4",
  authDomain: "leomessilapulga.firebaseapp.com",
  projectId: "leomessilapulga",
  storageBucket: "leomessilapulga.firebasestorage.app",
  messagingSenderId: "240739279461",
  appId: "1:240739279461:web:916e9fa38ab54430761c8c",
  measurementId: "G-MNEY15XTYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent offline caching
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Initialize Analytics if in browser environment
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, db, analytics };
