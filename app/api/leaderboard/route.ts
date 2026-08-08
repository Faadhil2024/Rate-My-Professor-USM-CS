import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { professors, votes } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select({
      id: professors.id,
      name: professors.name,
      department: professors.department,
      likes: sql<number>`count(*) filter (where ${votes.value} = 'like')`.as(
        "likes"
      ),
      dislikes: sql<number>`count(*) filter (where ${votes.value} = 'dislike')`.as(
        "dislikes"
      ),
    })
    .from(professors)
    .leftJoin(votes, sql`${votes.professorId} = ${professors.id}`)
    .groupBy(professors.id, professors.name, professors.department);

  const withScores = rows.map((r) => {
    const likes = Number(r.likes);
    const dislikes = Number(r.dislikes);
    const total = likes + dislikes;
    // Controversy: closest to a 50/50 split, only counts if there's meaningful volume
    const controversy = total >= 5 ? 1 - Math.abs(likes - dislikes) / total : -1;
    return { ...r, likes, dislikes, total, controversy };
  });

  const mostLiked = [...withScores].sort((a, b) => b.likes - a.likes).slice(0, 5);
  const mostDisliked = [...withScores]
    .sort((a, b) => b.dislikes - a.dislikes)
    .slice(0, 5);
  const mostControversial = [...withScores]
    .filter((r) => r.total >= 5)
    .sort((a, b) => b.controversy - a.controversy)
    .slice(0, 5);

  const totalVotes = withScores.reduce((sum, r) => sum + r.total, 0);

  return NextResponse.json({
    totalVotes,
    mostLiked,
    mostDisliked,
    mostControversial,
  });
}