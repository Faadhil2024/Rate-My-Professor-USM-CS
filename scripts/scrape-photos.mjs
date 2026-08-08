// scripts/scrape-photos.mjs
// Run once: node scripts/scrape-photos.mjs
// Produces professors-with-photos.json in the project root.

const BASE = "https://cs.usm.my";
const LISTING_STARTS = [0, 10, 20, 30, 40]; // 5 pages of the faculty listing

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getListingPage(start) {
  const url =
    start === 0
      ? `${BASE}/index.php/faculty-member/`
      : `${BASE}/index.php/faculty-member?start=${start}`;
  const res = await fetch(url);
  const html = await res.text();

  // Match links like /index.php/faculty-member/803-chong-yung-wey-dr
  const linkRegex =
    /<a href="(\/index\.php\/faculty-member\/\d+-[a-z0-9-]+)"[^>]*>([^<]+)<\/a>/gi;

  const entries = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const [, path, name] = match;
    entries.push({ name: name.trim(), url: BASE + path });
  }
  return entries;
}

async function getPhotoUrl(detailUrl) {
  const res = await fetch(detailUrl);
  const html = await res.text();

  const allMatches = [
    ...html.matchAll(
      /images\/(?:[A-Za-z0-9_]+\/)?[^"'\s)]+\.(?:jpg|jpeg|png|JPG|JPEG|PNG)/g
    ),
  ].map((m) => m[0]);

  const excludePatterns = [
    "icon_admin",
    "/01csj4/",
    "/yootheme/",
    "favicon",
    "apple-touch-icon",
    "touch-icon",
    "logo",
  ];

  const realPhoto = allMatches.find(
    (m) => !excludePatterns.some((p) => m.toLowerCase().includes(p))
  );
  const imgMatch = realPhoto ? { 0: realPhoto } : null;
  return imgMatch ? `${BASE}/${imgMatch[0]}` : null;
}

async function main() {
  let all = [];
  for (const start of LISTING_STARTS) {
    const entries = await getListingPage(start);
    all = all.concat(entries);
    await sleep(500); // be polite to their server
  }

  // Drop the dummy "testing" entry
  all = all.filter((e) => e.name.toLowerCase() !== "testing");

  console.log(`Found ${all.length} professors, fetching photos...`);

  const results = [];
  for (const entry of all) {
    const imageUrl = await getPhotoUrl(entry.url);
    results.push({ name: entry.name, imageUrl });
    console.log(`${entry.name}: ${imageUrl ?? "NO PHOTO FOUND"}`);
    await sleep(500); // be polite, avoid hammering the server
  }

  const fs = await import("fs");
  fs.writeFileSync(
    "professors-with-photos.json",
    JSON.stringify(results, null, 2)
  );
  console.log(`\nDone. Wrote ${results.length} entries to professors-with-photos.json`);
}

main();