import { db } from "./index";
import { professors } from "./schema";
import fs from "fs";

async function main() {
  const raw = fs.readFileSync("professors-with-photos.json", "utf-8");
  const data: { name: string; imageUrl: string | null }[] = JSON.parse(raw);

  if (data.length === 0) {
    console.error("professors-with-photos.json is empty, run the scraper first.");
    process.exit(1);
  }

  await db.insert(professors).values(
    data.map((p) => ({ name: p.name, imageUrl: p.imageUrl ?? undefined }))
  );

  console.log(`Seeded ${data.length} professors.`);
  process.exit(0);
}

main();