const videoOptions: Record<string, string[]> = {
  getafe: ["K7ylwMki3mw"],
  liverpool: ["D6Oeo-i6Enc"],
  worldcup: ["mb5ZyDAyM74"],
  boateng: ["Eo3q6ckCXrc", "G4wTERfoPfA", "IgtK-_wXfm8", "Jq4ZpjLBt4I", "HRUSzDucCGw"],
  molina: ["kYJjF46_Q0Y", "4-q4z2u-FmE", "i9Y_JjV6_yM", "F3S8N2bO4x4"]
};

async function verify(videoId: string) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (res.ok) {
      const data = await res.json();
      return { status: "OK", title: data.title, author: data.author_name };
    } else {
      return { status: `FAILED (${res.status})`, error: res.statusText };
    }
  } catch (err: any) {
    return { status: "ERROR", error: err.message };
  }
}

async function main() {
  console.log("Verifying YouTube Video IDs...");
  for (const [key, ids] of Object.entries(videoOptions)) {
    console.log(`\nCategory: ${key.toUpperCase()}`);
    for (const id of ids) {
      const result = await verify(id);
      console.log(`- ID ${id}: ${result.status} ${result.title ? `- "${result.title}" (by ${result.author})` : ""}`);
    }
  }
  process.exit(0);
}

main();
