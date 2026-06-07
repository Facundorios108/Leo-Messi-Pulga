import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { seedDatabaseIfNeeded } from "./firestoreSeeder";
import * as rawData from "./messiRawData";
import type { PlayerProfile, CareerTotals, Trophy, Milestone, RecordItem, TriviaQuestion, SeasonStats } from "../types";

// Helper to check if collections are empty and trigger seeder
async function ensureDataIsSeeded() {
  await seedDatabaseIfNeeded();
}

export async function fetchPlayerProfile(): Promise<PlayerProfile> {
  try {
    await ensureDataIsSeeded();
    const docRef = doc(db, "player", "profile");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as PlayerProfile;
    }
  } catch (error) {
    console.error("Failed to fetch player profile from Firestore, falling back to local bundle: ", error);
  }
  return rawData.playerProfile;
}

export async function fetchCareerTotals(): Promise<{
  career: CareerTotals;
  clubs: typeof rawData.clubTotals;
  internationalBreakdown: typeof rawData.internationalStatsBreakdown;
  internationalYearly: typeof rawData.internationalYearlyStats;
}> {
  try {
    await ensureDataIsSeeded();
    const docRef = doc(db, "player", "totals");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as any;
    }
  } catch (error) {
    console.error("Failed to fetch career totals from Firestore, falling back to local bundle: ", error);
  }
  return {
    career: rawData.careerTotals,
    clubs: rawData.clubTotals,
    internationalBreakdown: rawData.internationalStatsBreakdown,
    internationalYearly: rawData.internationalYearlyStats
  };
}

export async function fetchTrophies(): Promise<Trophy[]> {
  try {
    await ensureDataIsSeeded();
    const colRef = collection(db, "trophies");
    const querySnap = await getDocs(colRef);
    if (!querySnap.empty) {
      return querySnap.docs.map(doc => doc.data() as Trophy);
    }
  } catch (error) {
    console.error("Failed to fetch trophies from Firestore, falling back to local bundle: ", error);
  }
  return rawData.trophies;
}

export async function fetchMilestones(): Promise<Milestone[]> {
  try {
    await ensureDataIsSeeded();
    const colRef = collection(db, "milestones");
    const querySnap = await getDocs(colRef);
    if (!querySnap.empty) {
      // Sort milestones chronologically by year/date
      const list = querySnap.docs.map(doc => doc.data() as Milestone);
      return list.sort((a, b) => a.year - b.year);
    }
  } catch (error) {
    console.error("Failed to fetch milestones from Firestore, falling back to local bundle: ", error);
  }
  return rawData.milestones.sort((a, b) => a.year - b.year);
}

export async function fetchRecords(): Promise<RecordItem[]> {
  try {
    await ensureDataIsSeeded();
    const colRef = collection(db, "records");
    const querySnap = await getDocs(colRef);
    if (!querySnap.empty) {
      return querySnap.docs.map(doc => doc.data() as RecordItem);
    }
  } catch (error) {
    console.error("Failed to fetch records from Firestore, falling back to local bundle: ", error);
  }
  return rawData.keyRecords;
}

export async function fetchTriviaQuestions(): Promise<TriviaQuestion[]> {
  try {
    await ensureDataIsSeeded();
    const colRef = collection(db, "trivia");
    const querySnap = await getDocs(colRef);
    if (!querySnap.empty) {
      return querySnap.docs.map(doc => doc.data() as TriviaQuestion);
    }
  } catch (error) {
    console.error("Failed to fetch trivia from Firestore, falling back to local bundle: ", error);
  }
  return rawData.triviaQuestions;
}

export async function fetchSeasonsStats(): Promise<SeasonStats[]> {
  try {
    await ensureDataIsSeeded();
    const colRef = collection(db, "seasons");
    const querySnap = await getDocs(colRef);
    if (!querySnap.empty) {
      return querySnap.docs.map(doc => doc.data() as SeasonStats);
    }
  } catch (error) {
    console.error("Failed to fetch seasons stats from Firestore, falling back to local bundle: ", error);
  }
  return rawData.seasonsStats;
}
