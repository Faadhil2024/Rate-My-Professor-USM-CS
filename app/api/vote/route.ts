import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { votes } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many votes, slow down." },
      { status: 429 }
    );
  }

  const { voterId, professorId, value } = await req.json();

  if (
    !voterId ||
    typeof voterId !== "string" ||
    voterId.length > 100 ||
    !Number.isInteger(professorId) ||
    !["like", "dislike"].includes(value)
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(votes)
    .where(
      and(eq(votes.voterId, voterId), eq(votes.professorId, professorId))
    )
    .limit(1);

  // Same vote clicked again -> remove it (toggle off)
  if (existing.length > 0 && existing[0].value === value) {
    await db.delete(votes).where(eq(votes.id, existing[0].id));
    return NextResponse.json({ status: "removed" });
  }

  // Opposite vote clicked -> update in place
  if (existing.length > 0) {
    await db
      .update(votes)
      .set({ value, updatedAt: new Date() })
      .where(eq(votes.id, existing[0].id));
    return NextResponse.json({ status: "updated" });
  }

  // No existing vote -> insert
  await db.insert(votes).values({ voterId, professorId, value });
  return NextResponse.json({ status: "created" });
}