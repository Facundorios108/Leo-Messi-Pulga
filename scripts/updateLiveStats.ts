import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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
    const currentYear = "2026";
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
    if (frNode) {
      internationalBreakdown["International Friendlies"] = {
        appearances: parseInt(frNode.apps) || 67,
        goals: parseInt(frNode.goals) || 53,
        assists: parseInt(frNode.assists) || 22
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

    // 4. Update Seasons in Firestore
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

    // 5. Update metadata timestamp
    const metaRef = doc(db, "metadata", "app");
    await setDoc(metaRef, {
      seeded: true,
      lastUpdated: new Date().toISOString()
    });

    console.log("All stats successfully synced to Firestore in real-time!");
  } catch (error) {
    console.error("Error updating stats: ", error);
  }
}

runUpdate();
