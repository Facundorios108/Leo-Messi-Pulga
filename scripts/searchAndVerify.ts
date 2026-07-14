import { writeFileSync } from "fs";

async function getSearchVideoIds(query: string): Promise<string[]> {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) {
      console.error(`YouTube search failed for query "${query}": ${res.statusText}`);
      return [];
    }
    const html = await res.text();
    // Regex to find "videoId":"XXXXXXXXXXX" in the ytInitialData JSON inside the page source
    const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
    const ids: string[] = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      ids.push(match[1]);
    }
    // Also try finding standard watch links
    const regexWatch = /\/watch\?v=([a-zA-Z0-9_-]{11})/g;
    while ((match = regexWatch.exec(html)) !== null) {
      ids.push(match[1]);
    }
    return Array.from(new Set(ids)).slice(0, 15);
  } catch (err: any) {
    console.error(`Error searching YouTube for "${query}":`, err.message);
    return [];
  }
}

async function verify(videoId: string) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (res.ok) {
      const data = await res.json();
      return { status: "OK", title: data.title, author: data.author_name };
    } else {
      return { status: `FAILED (${res.status})` };
    }
  } catch (err: any) {
    return { status: "ERROR", error: err.message };
  }
}

async function main() {
  const queries = {
    boateng: "Messi vs Boateng 2015 slow motion OR fan compilation",
    molina: "Messi assist to Molina vs Netherlands 2022 fan edit"
  };

  for (const [key, q] of Object.entries(queries)) {
    console.log(`\nSearching and verifying for ${key.toUpperCase()}...`);
    const ids = await getSearchVideoIds(q);
    console.log(`Found ${ids.length} unique candidates. Verifying...`);
    for (const id of ids) {
      const res = await verify(id);
      if (res.status === "OK") {
        console.log(`- ID ${id}: OK - "${res.title}" (by ${res.author})`);
      } else {
        console.log(`- ID ${id}: ${res.status}`);
      }
    }
  }
  process.exit(0);
}

main();
