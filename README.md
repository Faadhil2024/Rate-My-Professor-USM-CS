# Rate My Professor (USM CS)
**Live: [rate-my-professor-usm-cs.onrender.com](https://rate-my-professor-usm-cs.onrender.com/)**

An anonymous, no-login voting tool for USM Computer Science students to react to their professors with a simple 👍 or 👎. Built as a class side-project, not affiliated with the official RateMyProfessors.com.

> No comments, no reviews, no accounts. Just anonymous reactions.

## Why this exists

Built as a side project for my CS classmates at USM, we wanted a lightweight, anonymous way to react to professors without the weight of full reviews. It started as a class tool and became a chance to work through some real product and engineering trade-offs: how do you build "anonymous" without a login, how do you keep a public leaderboard fair when there's no identity to check, and how do you make a 45-item voting flow feel good instead of like filling out a form.

## Technical highlights

- **Anonymous identity without accounts.** Each browser gets a random client-side UUID (`localStorage`), used only to enforce "one active vote per professor per voter" at the database level. No PII is ever collected or stored.
- **Live-updating leaderboard, no polling.** The "Most Loved" spotlight is derived state, computed client-side from the same vote data already in memory. Clicking a vote updates one array, and the current leader recalculates instantly via `useMemo`, no extra API call, no delay.
- **The anonymity/fairness trade-off, handled deliberately, not ignored.** No-login voting means there's no way to fully stop someone from mass-voting with fake identities. Rather than pretend this away, I added a basic IP-based rate limiter and documented the actual threat model in this README instead of overselling the tool's security.
- **A resilient scraping pipeline for real data.** Professor names and photos are pulled live from USM's public CS faculty directory. The scraper had to handle inconsistent HTML across ~45 individual staff pages (photos living in different folder structures, false positives from favicons/template assets), solved with iterative pattern refinement rather than assuming one regex would work everywhere.

## Screenshots

**Hero**

![Hero](./docs/screenshot-hero.png)

**Most Loved (live leaderboard spotlight)**

![Most Loved](./docs/screenshot-mostloved.png)

**Vote grid**

![Vote grid](./docs/screenshot-grid.png)


## Features

- Anonymous voting: like, dislike, or skip any professor, no account needed
- Change your vote anytime, one active vote per professor per anonymous voter
- Live "Most Loved Right Now" spotlight, updates instantly as votes come in
- Keyboard shortcuts: `J`/`K` or arrow keys to move between cards, `L` to like, `D` to dislike
- Search/filter across all professors
- Basic rate limiting to deter mass fake voting

## Tech stack

- **Framework:** Next.js 14+ (App Router), TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Motion (Framer Motion)
- **Database:** PostgreSQL via [Nhost](https://nhost.io)
- **ORM:** Drizzle ORM
- **Icons:** lucide-react

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd rate-my-professor
npm install
```

### 2. Set up the database

Create a free [Nhost](https://nhost.io) project (or any Postgres provider). Enable **Public access** under Settings → Database if connecting from your local machine. Generate a database password and copy the connection string.

Create `.env.local` in the project root:

```
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres
```

### 3. Push the schema

```bash
npx drizzle-kit push
```

> Once real vote data exists, switch to the safer `generate` + `migrate` workflow instead of `push` for future schema changes (see `migration-workflow.txt` in this repo, or ask before making schema changes).

### 4. Seed professor data

This project scrapes professor names and photos from USM's public CS faculty directory:

```bash
node scripts/scrape-photos.mjs
npx tsx lib/db/seed.ts
```

### 5. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Backing up data

Before any schema change or risky deploy, back up the database:

```bash
node scripts/backup.mjs
```

Writes a timestamped JSON snapshot to `backups/` (git-ignored, not meant to be committed).

## Project structure

```
app/
  page.tsx              # Homepage: Hero + Most Loved + Vote grid, all in one scroll
  api/
    vote/route.ts        # Vote submission (rate-limited)
    professors/route.ts  # Fetch professors + vote counts
    leaderboard/route.ts # Aggregate leaderboard stats
components/
  hero.tsx
  spotlight-card.tsx     # "Most Loved" live leaderboard card
  vote-card.tsx
  vote-button.tsx
  ui/                    # Background effects, spotlight components
lib/
  db/
    schema.ts             # Drizzle schema
    index.ts               # DB client
    seed.ts                 # Seeds scraped professor data
  hooks/
    use-voter-id.ts         # Anonymous client-side voter identity (localStorage)
  rate-limit.ts             # In-memory IP rate limiter
scripts/
  scrape-photos.mjs         # One-time scraper for USM faculty photos
  backup.mjs                # Database backup utility
```

## A note on anonymity and fairness

Voting is fully anonymous by design, there's no login. This means there's an inherent tension between "no barriers to vote" and "no way to stop someone from voting many times with fake identities." A basic IP rate limiter is in place to raise the bar above a trivial script, but this is not bulletproof, and isn't meant to be, this is a fun class tool, not a security-critical system.

## Disclaimer

This project is a student-built, unofficial tool for informal, anonymous reactions. It is not affiliated with, endorsed by, or connected to RateMyProfessors.com or USM in any official capacity.