"use client";

import { useEffect, useState } from "react";
import { useVoterId } from "@/lib/hooks/use-voter-id";
import { VoteCard } from "@/components/vote-card";
import { SilkBackground } from "@/components/ui/silk-background";

type Professor = {
  id: number;
  name: string;
  department: string | null;
  imageUrl: string | null;
  likes: number;
  dislikes: number;
  userVote: "like" | "dislike" | null;
};

export default function VotePage() {
  const voterId = useVoterId();
  const [professors, setProfessors] = useState<Professor[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!voterId) return;
    fetch(`/api/professors?voterId=${voterId}`)
      .then((res) => res.json())
      .then(setProfessors);
  }, [voterId]);

  if (!professors) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-base p-8">
        <SilkBackground className="h-screen" />
        <p className="relative z-10 text-white/50">Loading professors...</p>
      </div>
    );
  }

  const filtered = professors.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-base p-6 md:p-10">
      <SilkBackground className="h-screen" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <h1 className="text-2xl font-medium text-white">Rate My Professor</h1>
        <p className="mt-1 text-sm text-white/50">
          Anonymous. No login. Vote on none, some, or all of them.
        </p>

        <input
          type="text"
          placeholder="Search professors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-6 w-full rounded-control border border-white/10 bg-surface px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
        />

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {filtered.map((p, i) => (
            <VoteCard
              key={p.id}
              professor={{
                id: p.id,
                name: p.name,
                department: p.department,
                imageUrl: p.imageUrl,
              }}
              initialLikes={p.likes}
              initialDislikes={p.dislikes}
              initialUserVote={p.userVote}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
