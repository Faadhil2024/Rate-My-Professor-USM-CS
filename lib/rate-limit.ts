// Simple in-memory rate limiter. Good enough for a single-instance
// free-tier deployment. Resets if the server restarts, that's fine here,
// the goal is raising the bar above "trivial script," not perfect security.

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20; // max votes per IP per window

const hits = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = hits.get(ip) ?? [];

  // Drop timestamps outside the current window
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);
  return false;
}