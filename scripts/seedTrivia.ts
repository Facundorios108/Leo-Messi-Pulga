import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { triviaQuestions } from "../src/data/messiRawData";

const firebaseConfig = {
  apiKey: "AIzaSyBN1iWXkbCpcbdQqq-Epb9wneDeMvCzvq4",
  authDomain: "leomessilapulga.firebaseapp.com",
  projectId: "leomessilapulga",
  storageBucket: "leomessilapulga.firebasestorage.app",
  messagingSenderId: "240739279461",
  appId: "1:240739279461:web:916e9fa38ab54430761c8c",
  measurementId: "G-MNEY15XTYF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedTrivia() {
  console.log(`Starting seeding of ${triviaQuestions.length} trivia questions...`);
  try {
    for (const q of triviaQuestions) {
      const ref = doc(db, "trivia", q.id);
      await setDoc(ref, q);
      console.log(`Uploaded trivia question: ${q.id} - ${q.question.substring(0, 30)}...`);
    }
    console.log("All trivia questions successfully seeded to Cloud Firestore!");
  } catch (error) {
    console.error("Error seeding trivia: ", error);
  }
}

seedTrivia();
