/* eslint-disable */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
const db = getFirestore(app);

async function runUpdate() {
  console.log("Starting real-time stats update...");
  try {
    const password = process.env.UPDATER_PASSWORD;
    if (password) {
      console.log("Authenticating as updater@leomessipulga.com...");
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, "updater@leomessipulga.com", password);
      console.log("Authenticated successfully.");
    } else {
      console.warn("WARNING: No UPDATER_PASSWORD found in env. Attempting unauthenticated write...");
    }
    // 1. Fetch main totals JSON
    const totalsRes = await fetch("https://www.messivsronaldo.app/page-data/index/page-data.json");
    if (!totalsRes.ok) throw new Error("Failed to fetch all-time totals");
    const totalsData = await totalsRes.json();
    const allTimeStatsList = totalsData.result.data.allSheetMessiAllTimeStats.edges;

    const careerNode = allTimeStatsList.find((e: any) => e.node.competition === "All Time Career")?.node;
    const clubNode = allTimeStatsList.find((e: any) => e.node.competition === "All Time Club")?.node;
    const intNode = allTimeStatsList.find((e: any) => e.node.competition === "All Time Internationals")?.node;
    const wcNode = allTimeStatsList.find((e: any) => e.node.competition === "World Cup")?.node;
    const caNode = allTimeStatsList.find((e: any) => e.node.competition === "Copa America / Euros")?.node;
    const wcqNode = allTimeStatsList.find((e: any) => e.node.competition === "World Cup Qualifiers")?.node; // may not be in this list
    const frNode = allTimeStatsList.find((e: any) => e.node.competition === "International Friendlies")?.node;

    if (!careerNode || !clubNode || !intNode) {
      throw new Error("Could not parse main stats nodes from JSON");
    }

    const career = {
      appearances: parseInt(careerNode.apps),
      goals: parseInt(careerNode.goals),
      assists: parseInt(careerNode.assists),
      titles: 45 // Handled via updates if trophies list changes
    };

    // Calculate Inter Miami CF stats (Subtracting Barca & PSG static totals)
    const totalClubApps = parseInt(clubNode.apps);
    const totalClubGoals = parseInt(clubNode.goals);
    const totalClubAssists = parseInt(clubNode.assists);

    const barcaApps = 778;
    const barcaGoals = 672;
    const barcaAssists = 269;

    const psgApps = 75;
    const psgGoals = 32;
    const psgAssists = 35;

    const miamiApps = totalClubApps - barcaApps - psgApps;
    const miamiGoals = totalClubGoals - barcaGoals - psgGoals;
    const miamiAssists = totalClubAssists - barcaAssists - psgAssists;

    const clubs = {
      "FC Barcelona": { appearances: barcaApps, goals: barcaGoals, assists: barcaAssists },
      "Paris Saint-Germain": { appearances: psgApps, goals: psgGoals, assists: psgAssists },
      "Inter Miami CF": { appearances: miamiApps, goals: miamiGoals, assists: miamiAssists }
    };

    // 2. Fetch Calendar Year JSON for 2026 breakdowns
    const calendarRes = await fetch("https://www.messivsronaldo.app/page-data/calendar-year-stats/page-data.json");
    if (!calendarRes.ok) throw new Error("Failed to fetch calendar-year stats");
    const calendarData = await calendarRes.json();
    const calendarStatsList = calendarData.result.data.allSheetMessiCalYearStats.edges;

    // Filter nodes for 2026 (or current year)
    const currentYear = new Date().getFullYear().toString();
    const yearNodes = calendarStatsList.filter((e: any) => e.node.year === currentYear);

    const leagueNode = yearNodes.find((e: any) => e.node.competition === "League")?.node;
    const continentalNode = yearNodes.find((e: any) => e.node.competition === "Continental Tournament")?.node;
    const leaguesCupNode = yearNodes.find((e: any) => e.node.competition === "Leagues Cup")?.node;
    const countryNode = yearNodes.find((e: any) => e.node.competition === "Country")?.node;

    // 3. Update Firestore player/totals
    const totalsRef = doc(db, "player", "totals");
    const totalsSnap = await getDoc(totalsRef);
    let internationalYearly = [];
    let internationalBreakdown = {
      "FIFA World Cup": { appearances: 26, goals: 13, assists: 8 },
      "Copa América": { appearances: 39, goals: 14, assists: 18 },
      "FIFA World Cup Qualifiers": { appearances: 65, goals: 36, assists: 11 },
      "Finalissima": { appearances: 1, goals: 0, assists: 2 },
      "International Friendlies": { appearances: 67, goals: 53, assists: 22 }
    };

    if (totalsSnap.exists()) {
      const existingData = totalsSnap.data();
      internationalYearly = existingData.internationalYearly || [];
      if (existingData.internationalBreakdown) {
        internationalBreakdown = existingData.internationalBreakdown;
      }
    }

    // Update international breakdown totals from fetched nodes
    if (wcNode) {
      internationalBreakdown["FIFA World Cup"] = {
        appearances: parseInt(wcNode.apps) || 26,
        goals: parseInt(wcNode.goals) || 13,
        assists: parseInt(wcNode.assists) || 8
      };
    }
    if (caNode) {
      internationalBreakdown["Copa América"] = {
        appearances: parseInt(caNode.apps) || 39,
        goals: parseInt(caNode.goals) || 14,
        assists: parseInt(caNode.assists) || 18
      };
    }
    if (wcqNode) {
      internationalBreakdown["FIFA World Cup Qualifiers"] = {
        appearances: parseInt(wcqNode.apps) || 65,
        goals: parseInt(wcqNode.goals) || 36,
        assists: parseInt(wcqNode.assists) || 11
      };
    }

    // Mathematically calculate Friendlies as the remainder of total internationals
    if (intNode) {
      const totalIntApps = parseInt(intNode.apps) || 199;
      const totalIntGoals = parseInt(intNode.goals) || 117;
      const totalIntAssists = parseInt(intNode.assists) || 61;

      const wc = internationalBreakdown["FIFA World Cup"];
      const ca = internationalBreakdown["Copa América"];
      const wcq = internationalBreakdown["FIFA World Cup Qualifiers"];
      const fin = internationalBreakdown["Finalissima"];

      internationalBreakdown["International Friendlies"] = {
        appearances: Math.max(0, totalIntApps - wc.appearances - ca.appearances - wcq.appearances - fin.appearances),
        goals: Math.max(0, totalIntGoals - wc.goals - ca.goals - wcq.goals - fin.goals),
        assists: Math.max(0, totalIntAssists - wc.assists - ca.assists - wcq.assists - fin.assists)
      };
    }

    // Update 2026 entry in international yearly stats
    if (countryNode) {
      const yearVal = parseInt(currentYear);
      const yearApps = parseInt(countryNode.apps) || 0;
      const yearGoals = parseInt(countryNode.goals) || 0;
      const yearAssists = parseInt(countryNode.assists) || 0;

      const existingIndex = internationalYearly.findIndex((y: any) => y.year === yearVal);
      const yearObj = { year: yearVal, appearances: yearApps, goals: yearGoals, assists: yearAssists };

      if (existingIndex !== -1) {
        internationalYearly[existingIndex] = yearObj;
      } else {
        internationalYearly.push(yearObj);
      }
      // Sort chronologically
      internationalYearly.sort((a: any, b: any) => a.year - b.year);
    }

    // Count titles based on Honours checklist
    const honoursList = totalsData.result.data.allSheetHonours.edges;
    const totalTrophiesNode = honoursList.find((e: any) => e.node.honour === "Total Trophies")?.node;
    if (totalTrophiesNode && totalTrophiesNode.mcount) {
      career.titles = parseInt(totalTrophiesNode.mcount);
      console.log(`Synced total titles to: ${career.titles}`);
    }

    // Fetch detailed statistics
    console.log("Fetching detailed stats (Free Kicks, Penalties, Hat-Tricks, MOTMs)...");
    const [fkRes, penRes, hatRes, motmRes] = await Promise.all([
      fetch("https://www.messivsronaldo.app/page-data/detailed-stats/free-kicks/page-data.json").then(r => r.json()),
      fetch("https://www.messivsronaldo.app/page-data/detailed-stats/penalties/page-data.json").then(r => r.json()),
      fetch("https://www.messivsronaldo.app/page-data/detailed-stats/hat-tricks/page-data.json").then(r => r.json()),
      fetch("https://www.messivsronaldo.app/page-data/detailed-stats/man-of-the-match-awards/page-data.json").then(r => r.json())
    ]);

    const fkEdges = fkRes.result.data.allSheetMessiAllTimeStats.edges;
    const penEdges = penRes.result.data.allSheetMessiAllTimeStats.edges;
    const hatEdges = hatRes.result.data.allSheetMessiAllTimeStats.edges;
    const motmEdges = motmRes.result.data.allSheetMessiAllTimeStats.edges;

    const fkCareer = parseInt(fkEdges.find((e: any) => e.node.competition === "All Time Career")?.node.freeKicks) || 71;
    const fkClub = parseInt(fkEdges.find((e: any) => e.node.competition === "All Time Club")?.node.freeKicks) || 60;
    const fkInt = parseInt(fkEdges.find((e: any) => e.node.competition === "All Time Internationals")?.node.freeKicks) || 11;

    const penCareer = parseInt(penEdges.find((e: any) => e.node.competition === "All Time Career")?.node.pens) || 114;
    const penClub = parseInt(penEdges.find((e: any) => e.node.competition === "All Time Club")?.node.pens) || 90;
    const penInt = parseInt(penEdges.find((e: any) => e.node.competition === "All Time Internationals")?.node.pens) || 24;

    const hatCareer = parseInt(hatEdges.find((e: any) => e.node.competition === "All Time Career")?.node.hatTricks) || 60;
    const hatClub = parseInt(hatEdges.find((e: any) => e.node.competition === "All Time Club")?.node.hatTricks) || 50;
    const hatInt = parseInt(hatEdges.find((e: any) => e.node.competition === "All Time Internationals")?.node.hatTricks) || 10;

    const motmCareer = parseInt(motmEdges.find((e: any) => e.node.competition === "All Time Career")?.node.motm) || 450;
    const motmClub = parseInt(motmEdges.find((e: any) => e.node.competition === "All Time Club")?.node.motm) || 401;
    const motmInt = parseInt(motmEdges.find((e: any) => e.node.competition === "All Time Internationals")?.node.motm) || 49;

    const detailed = {
      freeKicks: {
        career: fkCareer,
        barca: 50,
        psg: 2,
        miami: fkClub - 50 - 2,
        argentina: fkInt
      },
      penalties: {
        career: penCareer,
        barca: 83,
        psg: 2,
        miami: penClub - 83 - 2,
        argentina: penInt
      },
      hatTricks: {
        career: hatCareer,
        barca: 47,
        psg: 0,
        miami: hatClub - 47 - 0,
        argentina: hatInt
      },
      motm: {
        career: motmCareer,
        barca: 366,
        psg: 20,
        miami: motmClub - 366 - 20,
        argentina: motmInt
      }
    };

    // Write totals
    await setDoc(totalsRef, {
      career,
      clubs,
      internationalBreakdown,
      internationalYearly,
      detailed
    });
    console.log("Updated player/totals successfully with detailed stats.");
    // 4. Update Trophies in Firestore dynamically
    console.log("Syncing trophies collection in Firestore...");
    const trophiesUpdates: { id: string; count: number; years: number[] }[] = [];

    // Helper to parse years from comma-separated list
    const parseYears = (yearsStr: string | null): number[] => {
      if (!yearsStr) return [];
      return yearsStr.split(",")
        .map(y => {
          const trimmed = y.trim();
          const matched = trimmed.match(/\b(20\d{2}|19\d{2})\b/); // match 4-digit years
          if (matched) return parseInt(matched[0]);
          const shortYearMatched = trimmed.match(/\b(\d{2})\/(\d{2})\b/); // match "18/19"
          if (shortYearMatched) return 2000 + parseInt(shortYearMatched[2]); // e.g. 2019
          return null;
        })
        .filter((y): y is number => y !== null)
        .sort((a, b) => a - b);
    };

    // Helper counts:
    const laLigaCount = (s: string) => (s.match(/La Liga/g) || []).length;
    const ligue1Count = (s: string) => (s.match(/Ligue 1/g) || []).length;
    const supportersCount = (s: string) => (s.match(/Supporters' Shield/g) || []).length;
    const copaDelReyCount = (s: string) => (s.match(/Copa del Rey/g) || []).length;
    const mlsCupCount = (s: string) => (s.match(/MLS Cup/g) || []).length;
    const supercopaesCount = (s: string) => (s.match(/Supercopa de España/g) || []).length;
    const tropheeCount = (s: string) => (s.match(/Trophée des Champions/g) || []).length;
    const leaguesCupCount = (s: string) => (s.match(/Leagues Cup/g) || []).length;
    const easternConferenceCount = (s: string) => (s.match(/Eastern Conference/g) || []).length;
    const wcCount = (s: string) => (s.match(/World Cup/g) || []).length;
    const caCount = (s: string) => (s.match(/Copa America/g) || []).length;
    const finalissimaCount = (s: string) => (s.match(/Finalissima/g) || []).length;
    const olympicsCount = (s: string) => (s.match(/Olympic/g) || []).length;
    const u20Count = (s: string) => (s.match(/U20|Youth/g) || []).length;

    honoursList.forEach((edge: any) => {
      const h = edge.node;
      const count = parseInt(h.mcount) || 0;
      const years = parseYears(h.myears);

      if (h.honour === "Ballon d'Or") {
        trophiesUpdates.push({ id: "ballondor", count, years });
      } else if (h.honour === "European Golden Shoe") {
        trophiesUpdates.push({ id: "goldenboot", count, years });
      } else if (h.honour === "FIFA World Player of the Year") {
        trophiesUpdates.push({ id: "fifathebest", count, years });
      } else if (h.honour === "Champions League") {
        trophiesUpdates.push({ id: "ucl", count, years });
      } else if (h.honour === "UEFA Super Cup") {
        trophiesUpdates.push({ id: "uefasupercup", count, years });
      } else if (h.honour === "Club World Cup") {
        trophiesUpdates.push({ id: "clubworldcup", count, years });
      } else if (h.honour === "League Titles") {
        const yearsStr = h.myears || "";
        const laLigaYears = yearsStr.split(",").filter((y: string) => y.includes("La Liga")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];
        const ligue1Years = yearsStr.split(",").filter((y: string) => y.includes("Ligue 1")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];
        const supportersYears = yearsStr.split(",").filter((y: string) => y.includes("Supporters' Shield")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];

        trophiesUpdates.push({ id: "laliga", count: laLigaCount(yearsStr), years: laLigaYears });
        trophiesUpdates.push({ id: "ligue1", count: ligue1Count(yearsStr), years: ligue1Years });
        trophiesUpdates.push({ id: "supporters", count: supportersCount(yearsStr), years: supportersYears });
      } else if (h.honour === "Domestic Cup") {
        const yearsStr = h.myears || "";
        const copaYears = yearsStr.split(",").filter((y: string) => y.includes("Copa del Rey")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];
        const mlsCupYears = yearsStr.split(",").filter((y: string) => y.includes("MLS Cup")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];

        trophiesUpdates.push({ id: "copadelrey", count: copaDelReyCount(yearsStr), years: copaYears });
        trophiesUpdates.push({ id: "mlscup", count: mlsCupCount(yearsStr), years: mlsCupYears });
      } else if (h.honour === "Domestic Super Cup") {
        const yearsStr = h.myears || "";
        const supercopaYears = yearsStr.split(",").filter((y: string) => y.includes("Supercopa")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];
        const tropheeYears = yearsStr.split(",").filter((y: string) => y.includes("Trophée")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];

        trophiesUpdates.push({ id: "supercopaes", count: supercopaesCount(yearsStr), years: supercopaYears });
        trophiesUpdates.push({ id: "trophee", count: tropheeCount(yearsStr), years: tropheeYears });
      } else if (h.honour === "Other Official Club Titles") {
        const yearsStr = h.myears || "";
        const leaguesCupYears = yearsStr.split(",").filter((y: string) => y.includes("Leagues Cup")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];
        const easternYears = yearsStr.split(",").filter((y: string) => y.includes("Eastern Conference")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];

        trophiesUpdates.push({ id: "leaguescup", count: leaguesCupCount(yearsStr), years: leaguesCupYears });
        trophiesUpdates.push({ id: "easternconference", count: easternConferenceCount(yearsStr), years: easternYears });
      } else if (h.honour === "Full Senior International") {
        const yearsStr = h.myears || "";
        const wcYears = yearsStr.split(",").filter((y: string) => y.includes("World Cup")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];
        const caYears = yearsStr.split(",").filter((y: string) => y.includes("Copa America")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];
        const finalissimaYears = yearsStr.split(",").filter((y: string) => y.includes("Finalissima")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];

        trophiesUpdates.push({ id: "worldcup", count: wcCount(yearsStr), years: wcYears });
        trophiesUpdates.push({ id: "copaamerica", count: caCount(yearsStr), years: caYears });
        trophiesUpdates.push({ id: "finalissima", count: finalissimaCount(yearsStr), years: finalissimaYears });
      } else if (h.honour === "Other Official International") {
        const yearsStr = h.myears || "";
        const olympicsYears = yearsStr.split(",").filter((y: string) => y.includes("Olympic")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];
        const u20Years = yearsStr.split(",").filter((y: string) => y.includes("U20") || y.includes("Youth")).map((y: string) => parseYears(y)[0]).filter(Boolean) as number[];

        trophiesUpdates.push({ id: "olympics", count: olympicsCount(yearsStr), years: olympicsYears });
        trophiesUpdates.push({ id: "u20worldcup", count: u20Count(yearsStr), years: u20Years });
      }
    });

    // Write all trophies updates to Firestore using setDoc merge
    for (const update of trophiesUpdates) {
      const trophyRef = doc(db, "trophies", update.id);
      await setDoc(trophyRef, {
        count: update.count,
        years: update.years
      }, { merge: true });
      console.log(`Synced trophy "${update.id}" in Firestore: count=${update.count}`);
    }

    // 5. Update Seasons in Firestore
    // For 2026, we create separate docs for each competition if Messi played
    if (leagueNode && parseInt(leagueNode.apps) > 0) {
      await setDoc(doc(db, "seasons", `s_${currentYear}_mls`), {
        season: currentYear,
        team: "Inter Miami CF",
        competition: "MLS",
        appearances: parseInt(leagueNode.apps),
        goals: parseInt(leagueNode.goals),
        assists: parseInt(leagueNode.assists)
      });
      console.log("Synced 2026 MLS stats.");
    }

    if (continentalNode && parseInt(continentalNode.apps) > 0) {
      await setDoc(doc(db, "seasons", `s_${currentYear}_concacaf`), {
        season: currentYear,
        team: "Inter Miami CF",
        competition: "CONCACAF Cup",
        appearances: parseInt(continentalNode.apps),
        goals: parseInt(continentalNode.goals),
        assists: parseInt(continentalNode.assists)
      });
      console.log("Synced 2026 CONCACAF Cup stats.");
    }

    if (leaguesCupNode && parseInt(leaguesCupNode.apps) > 0) {
      await setDoc(doc(db, "seasons", `s_${currentYear}_leaguescup`), {
        season: currentYear,
        team: "Inter Miami CF",
        competition: "Leagues Cup",
        appearances: parseInt(leaguesCupNode.apps),
        goals: parseInt(leaguesCupNode.goals),
        assists: parseInt(leaguesCupNode.assists)
      });
      console.log("Synced 2026 Leagues Cup stats.");
    }

    // 5b. Update Competitor Ronaldo's stats dynamically in Firestore
    console.log("Syncing competitor Cristiano Ronaldo stats...");
    const allTimeRonaldoStatsList = totalsData.result.data.allSheetRonaldoAllTimeStats?.edges || [];
    const ronaldoCareerNode = allTimeRonaldoStatsList.find((e: any) => e.node.competition === "All Time Career")?.node;
    if (ronaldoCareerNode) {
      const rApps = parseInt(ronaldoCareerNode.apps);
      const rGoals = parseInt(ronaldoCareerNode.goals);
      const rAssists = parseInt(ronaldoCareerNode.assists);
      const rGPG = rApps ? parseFloat((rGoals / rApps).toFixed(2)) : 0.73;
      
      const rBallondor = parseInt(honoursList.find((e: any) => e.node.honour === "Ballon d'Or")?.node.rcount) || 5;
      const rTitles = parseInt(honoursList.find((e: any) => e.node.honour === "Total Trophies")?.node.rcount) || 37;

      const competitorRef = doc(db, "competitors", "ronaldo");
      const competitorSnap = await getDoc(competitorRef);
      const existingCompData = competitorSnap.exists() ? competitorSnap.data() : {};

      await setDoc(competitorRef, {
        ...existingCompData,
        id: "ronaldo",
        name: "Cristiano Ronaldo",
        country: "Portugal",
        themeClass: "theme-cr7",
        stats: {
          appearances: rApps,
          goals: rGoals,
          assists: rAssists,
          titles: rTitles,
          ballondor: rBallondor,
          goalsPerGame: rGPG,
          worldCups: 0
        }
      }, { merge: true });
      console.log(`Competitor Ronaldo stats dynamically synced: goals=${rGoals}, apps=${rApps}, titles=${rTitles}`);
    } else {
      console.warn("WARNING: Ronaldo stats node not found in index page-data.json");
    }

    // 6. Update metadata timestamp
    const metaRef = doc(db, "metadata", "app");
    await setDoc(metaRef, {
      seeded: true,
      lastUpdated: new Date().toISOString()
    });

    console.log("All stats successfully synced to Firestore in real-time!");
    process.exit(0); // Exit process successfully to avoid leaving background runner open
  } catch (error) {
    console.error("Error updating stats: ", error);
    process.exit(1);
  }
}

runUpdate();
