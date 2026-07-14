/* eslint-disable */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, writeBatch, collection } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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

// Seed data for videos
const seedVideos = [
  {
    id: "ankara-messi-2007",
    title: "Solo Goal vs Getafe (Ankara Messi)",
    date: "2007-04-18",
    category: "dribbles",
    youtubeId: "K7ylwMki3mw",
    duration: "0:45",
    description: "Con solo 19 años de edad, Messi replica el legendario Gol del Siglo de Diego Maradona, gambeteando a 5 defensores y al arquero desde la mitad de la cancha.",
    ratingSum: 49022,
    ratingCount: 10004,
    stats: {
      distanceYards: 62,
      defendersBeaten: 5,
      maxSpeedKmph: 31.2
    }
  },
  {
    id: "freekick-liverpool-2019",
    title: "Tiro Libre vs Liverpool (Champions 2019)",
    date: "2019-05-01",
    category: "freekicks",
    youtubeId: "D6Oeo-i6Enc",
    duration: "0:50",
    description: "Un tiro libre majestuoso y quirúrgico desde más de 30 metros de distancia directo al ángulo de Alisson Becker en las semifinales de la Champions League.",
    ratingSum: 48900,
    ratingCount: 10000,
    stats: {
      distanceYards: 33,
      defendersBeaten: 0,
      maxSpeedKmph: 92.4
    }
  },
  {
    id: "worldcup-final-2022",
    title: "Doblete en Final del Mundo vs Francia",
    date: "2022-12-18",
    category: "worldcup",
    youtubeId: "mb5ZyDAyM74",
    duration: "1:00",
    description: "El desempeño consagratorio definitivo de Lionel Messi en Lusail, marcando un gol de penal, un gol de jugada en tiempo extra y guiando el triunfo histórico de Argentina.",
    ratingSum: 50000,
    ratingCount: 10000,
    stats: {
      distanceYards: 12,
      defendersBeaten: 0,
      maxSpeedKmph: 24.5
    }
  },
  {
    id: "boateng-dribble-2015",
    title: "El Quiebre de Cadera a Boateng vs Bayern",
    date: "2015-05-06",
    category: "dribbles",
    youtubeId: "jgcGaoJhNRI",
    duration: "0:35",
    description: "Messi recibe de Dani Alves, amaga hacia adentro y se va hacia afuera, provocando la icónica caída de Jérôme Boateng para picársela sutilmente a Manuel Neuer.",
    ratingSum: 49400,
    ratingCount: 10000,
    stats: {
      distanceYards: 8,
      defendersBeaten: 2,
      maxSpeedKmph: 28.1
    }
  },
  {
    id: "assist-molina-2022",
    title: "Pase Imposible vs Países Bajos (Catar)",
    date: "2022-12-09",
    category: "assists",
    youtubeId: "1OsIsJNAaSs",
    duration: "0:40",
    description: "Un pase filtrado de fantasía sin mirar ('no-look assist') que atravesó a cinco defensores para asistir a Nahuel Molina en cuartos de final del Mundial.",
    ratingSum: 49200,
    ratingCount: 10000,
    stats: {
      distanceYards: 38,
      defendersBeaten: 5,
      maxSpeedKmph: 42.0
    }
  }
];

// Seed data for competitors
const seedCompetitors = [
  {
    id: "ronaldo",
    name: "Cristiano Ronaldo",
    country: "Portugal",
    themeClass: "theme-cr7",
    stats: {
      appearances: 1325,
      goals: 973,
      assists: 261,
      titles: 37,
      ballondor: 5,
      goalsPerGame: 0.73,
      worldCups: 0
    },
    radarAttributes: {
      goalscoring: 96,
      playmaking: 78,
      dribbling: 84,
      setPieces: 88,
      legacy: 95
    },
    headToHeadMatches: {
      wins: 11,
      goals: 21,
      assists: 1
    }
  },
  {
    id: "pele",
    name: "Pelé",
    country: "Brasil",
    themeClass: "theme-pele",
    stats: {
      appearances: 831,
      goals: 767,
      assists: 343,
      titles: 37,
      ballondor: 0,
      goalsPerGame: 0.92,
      worldCups: 3
    },
    radarAttributes: {
      goalscoring: 98,
      playmaking: 85,
      dribbling: 94,
      setPieces: 75,
      legacy: 98
    },
    headToHeadMatches: {
      wins: 0,
      goals: 0,
      assists: 0
    }
  },
  {
    id: "maradona",
    name: "Diego Maradona",
    country: "Argentina",
    themeClass: "theme-maradona",
    stats: {
      appearances: 680,
      goals: 345,
      assists: 240,
      titles: 12,
      ballondor: 0,
      goalsPerGame: 0.51,
      worldCups: 1
    },
    radarAttributes: {
      goalscoring: 88,
      playmaking: 97,
      dribbling: 99,
      setPieces: 92,
      legacy: 99
    },
    headToHeadMatches: {
      wins: 0,
      goals: 0,
      assists: 0
    }
  }
];

async function seedLocal() {
  console.log("Starting secure local database seeding...");
  
  const password = process.env.UPDATER_PASSWORD;
  if (!password) {
    console.error("ERROR: UPDATER_PASSWORD environment variable is required to write to Firestore.");
    console.error("Please run as: UPDATER_PASSWORD=your_password npx tsx scripts/seedLocal.ts");
    process.exit(1);
  }

  try {
    // 1. Authenticate
    console.log("Authenticating as updater@leomessipulga.com...");
    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, "updater@leomessipulga.com", password);
    console.log("Authenticated successfully.");

    const batch = writeBatch(db);

    // Seed metadata
    const metaRef = doc(db, "metadata", "app");
    batch.set(metaRef, { seeded: true, lastUpdated: new Date().toISOString() });

    // Seed profile
    const profileRef = doc(db, "player", "profile");
    batch.set(profileRef, rawData.playerProfile);

    // Seed totals
    const totalsRef = doc(db, "player", "totals");
    batch.set(totalsRef, {
      career: rawData.careerTotals,
      clubs: rawData.clubTotals,
      internationalBreakdown: rawData.internationalStatsBreakdown,
      internationalYearly: rawData.internationalYearlyStats,
      detailed: rawData.detailedStats
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

    // Seed the new videos collection
    seedVideos.forEach(video => {
      const ref = doc(db, "videos", video.id);
      batch.set(ref, video);
    });

    // Seed the new competitors collection
    seedCompetitors.forEach(comp => {
      const ref = doc(db, "competitors", comp.id);
      batch.set(ref, comp);
    });

    await batch.commit();
    console.log("Core batch committed successfully. Seeding seasons stats...");

    // Seeding seasons stats requires a separate batch
    const seasonsBatch = writeBatch(db);
    rawData.seasonsStats.forEach((stat, index) => {
      const docId = `s_${index}`;
      const ref = doc(db, "seasons", docId);
      seasonsBatch.set(ref, stat);
    });

    await seasonsBatch.commit();
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error during database seed: ", err);
    process.exit(1);
  }
}

seedLocal();
