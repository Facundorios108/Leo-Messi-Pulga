/* eslint-disable */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";

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

async function runCheck() {
  console.log("--------------------------------------------------");
  console.log("INICIANDO PRUEBA DE CONSISTENCIA DE DATOS DE MESSI");
  console.log("--------------------------------------------------");
  let errorCount = 0;

  try {
    // 1. Fetch Totals
    const totalsRef = doc(db, "player", "totals");
    const totalsSnap = await getDoc(totalsRef);
    if (!totalsSnap.exists()) {
      throw new Error("No se pudo cargar el documento de totals del jugador.");
    }
    const totalsData = totalsSnap.data();
    const careerTitles = totalsData.career.titles;
    const careerGoals = totalsData.career.goals;
    const careerAssists = totalsData.career.assists;
    const careerApps = totalsData.career.appearances;

    // 2. Fetch Trophies collection
    const trophiesCol = collection(db, "trophies");
    const trophiesSnap = await getDocs(trophiesCol);
    const trophiesList = trophiesSnap.docs.map(d => d.data());

    // Calculate sum of collective trophies
    const collectiveTrophies = trophiesList.filter(t => t.category !== "individual");
    const collectiveTrophiesSum = collectiveTrophies.reduce((sum, t) => sum + (t.count || 0), 0);

    console.log(`Títulos en totals.career.titles: ${careerTitles}`);
    console.log(`Suma de trofeos en colección "trophies" (colectivos): ${collectiveTrophiesSum}`);

    if (careerTitles !== collectiveTrophiesSum) {
      console.error("❌ ERROR: Mismatch de títulos detectado!");
      console.error(`Diferencia de: ${Math.abs(careerTitles - collectiveTrophiesSum)} título(s)`);
      errorCount++;
    } else {
      console.log("✅ OK: Los títulos colectivos coinciden perfectamente.");
    }

    // 3. Verify Stats sums (Clubs + International vs Career)
    const clubsData = totalsData.clubs;
    const intBreakdown = totalsData.internationalBreakdown;

    const clubGoals = Object.values(clubsData).reduce((sum: number, c: any) => sum + c.goals, 0);
    const clubAssists = Object.values(clubsData).reduce((sum: number, c: any) => sum + c.assists, 0);
    const clubApps = Object.values(clubsData).reduce((sum: number, c: any) => sum + c.appearances, 0);

    const intGoals = Object.values(intBreakdown).reduce((sum: number, i: any) => sum + i.goals, 0);
    const intAssists = Object.values(intBreakdown).reduce((sum: number, i: any) => sum + i.assists, 0);
    const intApps = Object.values(intBreakdown).reduce((sum: number, i: any) => sum + i.appearances, 0);

    const calculatedGoals = clubGoals + intGoals;
    const calculatedAssists = clubAssists + intAssists;
    const calculatedApps = clubApps + intApps;

    console.log("\n--- Consistencia de Estadísticas ---");
    console.log(`Goles de Carrera: ${careerGoals} | Calculado (Clubes+Selección): ${calculatedGoals}`);
    console.log(`Asistencias de Carrera: ${careerAssists} | Calculado (Clubes+Selección): ${calculatedAssists}`);
    console.log(`Partidos de Carrera: ${careerApps} | Calculado (Clubes+Selección): ${calculatedApps}`);

    if (careerGoals !== calculatedGoals) {
      console.error("❌ ERROR: Mismatch de goles detectado!");
      errorCount++;
    }
    if (careerAssists !== calculatedAssists) {
      console.error("❌ ERROR: Mismatch de asistencias detectado!");
      errorCount++;
    }
    if (careerApps !== calculatedApps) {
      console.error("❌ ERROR: Mismatch de partidos detectado!");
      errorCount++;
    }

    if (errorCount === 0) {
      console.log("\n🎉 EXCELENTE: Todos los datos son perfectamente consistentes en la base de datos.");
      process.exit(0);
    } else {
      console.error(`\n❌ VERIFICACIÓN FALLIDA: Se encontraron ${errorCount} errores de consistencia.`);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Ocurrió un error ejecutando la prueba: ", error);
    process.exit(1);
  }
}

runCheck();
