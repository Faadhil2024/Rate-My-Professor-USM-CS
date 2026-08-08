"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

type Row = {
  id: number;
  name: string;
  department: string | null;
  likes: number;
  dislikes: number;
  total: number;
};

type Data = {
  totalVotes: number;
  mostLiked: Row[];
  mostDisliked: Row[];
  mostControversial: Row[];
};

function Board({ title, rows, tone }: { title: string; rows: Row[]; tone: "like" | "dislike" | "neutral" }) {
  return (
    <div className="rounded-card border border-white/10 bg-surface p-5 shadow-card">
      <h2 className="text-sm font-medium text-white/70">{title}</h2>
      <ol className="mt-3 space-y-2">
        {rows.map((r, i) => (
          <li key={r.id} className="flex items-center justify-between text-sm">
            <span className="text-white/40 w-5">{i + 1}</span>
            <span className="flex-1 text-white">{r.name}</span>
            <span
              className={
                tone === "like"
                  ? "text-like"
                  : tone === "dislike"
                  ? "text-dislike"
                  : "text-white/50"
              }
            >
              {tone === "like" && `${r.likes} 👍`}
              {tone === "dislike" && `${r.dislikes} 👎`}
              {tone === "neutral" && `${r.likes}👍 / ${r.dislikes}👎`}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function LeaderboardPage() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-base p-8">
        <p className="text-white/50">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-medium text-white">Leaderboard</h1>

        <motion.p
          key={data.totalVotes}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-white/50"
        >
          {data.totalVotes} votes cast by your classmates
        </motion.p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Board title="Most Liked" rows={data.mostLiked} tone="like" />
          <Board title="Most Disliked" rows={data.mostDisliked} tone="dislike" />
          <Board
            title="Most Controversial"
            rows={data.mostControversial}
            tone="neutral"
          />
        </div>
      </div>
    </div>
  );
}