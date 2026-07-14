import { initializeApp } from "firebase/app";
import { getFirestore, doc, writeBatch } from "firebase/firestore";
import * as rawData from "../src/data/messiRawData";

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

async function forceSeed() {
  console.log("Starting force-seeding of all collections to Firestore...");
  try {
    const batch = writeBatch(db);
    
    // 1. Seed metadata
    const metaRef = doc(db, "metadata", "app");
    batch.set(metaRef, { seeded: true, lastUpdated: new Date().toISOString() });
    console.log("Queued metadata...");
    
    // 2. Seed player profile
    const profileRef = doc(db, "player", "profile");
    batch.set(profileRef, rawData.playerProfile);
    console.log("Queued profile...");
    
    // 3. Seed player totals
    const totalsRef = doc(db, "player", "totals");
    batch.set(totalsRef, {
      career: rawData.careerTotals,
      clubs: rawData.clubTotals,
      internationalBreakdown: rawData.internationalStatsBreakdown,
      internationalYearly: rawData.internationalYearlyStats,
      detailed: rawData.detailedStats
    });
    console.log("Queued career totals...");
    
    // 4. Seed trophies
    rawData.trophies.forEach(trophy => {
      const ref = doc(db, "trophies", trophy.id);
      batch.set(ref, trophy);
    });
    console.log(`Queued ${rawData.trophies.length} trophies...`);
    
    // 5. Seed milestones
    rawData.milestones.forEach(milestone => {
      const ref = doc(db, "milestones", milestone.id);
      batch.set(ref, milestone);
    });
    console.log(`Queued ${rawData.milestones.length} milestones...`);
    
    // 6. Seed records
    rawData.keyRecords.forEach(rec => {
      const ref = doc(db, "records", rec.id);
      batch.set(ref, rec);
    });
    console.log(`Queued ${rawData.keyRecords.length} records...`);
    
    // 7. Seed trivia
    rawData.triviaQuestions.forEach(question => {
      const ref = doc(db, "trivia", question.id);
      batch.set(ref, question);
    });
    console.log(`Queued ${rawData.triviaQuestions.length} trivia questions...`);

    // Commit first batch
    await batch.commit();
    console.log("First batch successfully committed to Firestore.");

    // 8. Seed seasons (large array, needs a separate batch)
    const seasonsBatch = writeBatch(db);
    rawData.seasonsStats.forEach((stat, index) => {
      const docId = `s_${index}`;
      const ref = doc(db, "seasons", docId);
      seasonsBatch.set(ref, stat);
    });
    
    await seasonsBatch.commit();
    console.log(`Seeded ${rawData.seasonsStats.length} seasons successfully to Firestore.`);
    console.log("Force-seeding completed successfully!");
  } catch (error) {
    console.error("Error force-seeding database: ", error);
  }
}

forceSeed();
