// scripts/backup.mjs
// Run before any schema change or risky operation: node scripts/backup.mjs
// Dumps professors + votes tables to a timestamped JSON file in /backups.

import postgres from "postgres";
import { config } from "dotenv";
import fs from "fs";

config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

async function main() {
  const professors = await sql`SELECT * FROM professors`;
  const votes = await sql`SELECT * FROM votes`;

  if (!fs.existsSync("backups")) fs.mkdirSync("backups");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `backups/backup-${timestamp}.json`;

  fs.writeFileSync(
    filename,
    JSON.stringify({ professors, votes }, null, 2)
  );

  console.log(`Backed up ${professors.length} professors and ${votes.length} votes to ${filename}`);
  await sql.end();
}

main();
