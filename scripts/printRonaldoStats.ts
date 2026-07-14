async function main() {
  try {
    const res = await fetch("https://www.messivsronaldo.app/page-data/index/page-data.json");
    if (!res.ok) throw new Error("Fetch failed: " + res.statusText);
    const data = await res.json();
    
    const ronaldoStatsList = data.result.data.allSheetRonaldoAllTimeStats.edges;
    console.log("Ronaldo All Time Stats:");
    ronaldoStatsList.forEach((e: any) => {
      console.log(`- ${e.node.competition}: apps=${e.node.apps}, goals=${e.node.goals}, assists=${e.node.assists}`);
    });
    
    // Check if there are other keys or honours for Ronaldo
    const honours = data.result.data.allSheetHonours.edges;
    console.log("\nHonours with Ronaldo counts:");
    honours.forEach((e: any) => {
      console.log(`- ${e.node.honour}: messi=${e.node.mcount}, ronaldo=${e.node.rcount}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();
