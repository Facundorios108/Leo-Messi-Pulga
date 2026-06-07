import { doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import * as rawData from "./messiRawData";

export async function seedDatabaseIfNeeded() {
  try {
    const metaRef = doc(db, "metadata", "app");
    const metaSnap = await getDoc(metaRef);
    
    if (metaSnap.exists() && metaSnap.data().seeded) {
      console.log("Database already seeded in Firestore.");
      return;
    }
    
    console.log("Seeding Firestore database...");
    
    // Batch writes to avoid multiple round-trips
    const batch = writeBatch(db);
    
    // Seed metadata
    batch.set(metaRef, { seeded: true, lastUpdated: new Date().toISOString() });
    
    // Seed player profile
    const profileRef = doc(db, "player", "profile");
    batch.set(profileRef, rawData.playerProfile);
    
    // Seed player totals
    const totalsRef = doc(db, "player", "totals");
    batch.set(totalsRef, {
      career: rawData.careerTotals,
      clubs: rawData.clubTotals,
      internationalBreakdown: rawData.internationalStatsBreakdown,
      internationalYearly: rawData.internationalYearlyStats
    });
    
    // Seed trophies
    rawData.trophies.forEach(trophy => {
      const ref = doc(db, "trophies", trophy.id);
      batch.set(ref, trophy);
    });
    
    // Seed milestones
    rawData.milestones.forEach(milestone => {
      const ref = doc(db, "milestones", milestone.id);
      batch.set(ref, milestone);
    });
    
    // Seed records
    rawData.keyRecords.forEach(rec => {
      const ref = doc(db, "records", rec.id);
      batch.set(ref, rec);
    });
    
    // Seed trivia
    rawData.triviaQuestions.forEach(question => {
      const ref = doc(db, "trivia", question.id);
      batch.set(ref, question);
    });

    // Commit the first batch (Firestore limits batch size to 500 writes)
    await batch.commit();
    console.log("First batch committed. Seeding seasons...");

    // Seeding seasons stats requires a separate batch
    const seasonsBatch = writeBatch(db);
    rawData.seasonsStats.forEach((stat, index) => {
      const docId = `s_${index}`;
      const ref = doc(db, "seasons", docId);
      seasonsBatch.set(ref, stat);
    });
    
    await seasonsBatch.commit();
    console.log("Firestore database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database: ", error);
  }
}
