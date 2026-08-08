import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { professors, votes } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const voterId = req.nextUrl.searchParams.get("voterId");

  const allProfessors = await db.select().from(professors);

  const counts = await db
    .select({
      professorId: votes.professorId,
      value: votes.value,
      count: sql<number>`count(*)`.as("count"),
    })
    .from(votes)
    .groupBy(votes.professorId, votes.value);

  const myVotes = voterId
    ? await db.select().from(votes).where(eq(votes.voterId, voterId))
    : [];

  const result = allProfessors.map((p) => {
    const likes =
      counts.find((c) => c.professorId === p.id && c.value === "like")
        ?.count ?? 0;
    const dislikes =
      counts.find((c) => c.professorId === p.id && c.value === "dislike")
        ?.count ?? 0;
    const mine = myVotes.find((v) => v.professorId === p.id)?.value ?? null;

    return {
      id: p.id,
      name: p.name,
      department: p.department,
      imageUrl: p.imageUrl,
      likes: Number(likes),
      dislikes: Number(dislikes),
      userVote: mine,
    };
  });

  return NextResponse.json(result);
}