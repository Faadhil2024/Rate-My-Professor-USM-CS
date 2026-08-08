"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useVoterId } from "@/lib/hooks/use-voter-id";
import { Hero } from "@/components/hero";
import { MostLoved } from "@/components/spotlight-card";
import { VoteCard } from "@/components/vote-card";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { Search } from "lucide-react";

type Professor = {
  id: number;
  name: string;
  department: string | null;
  imageUrl: string | null;
  likes: number;
  dislikes: number;
  userVote: "like" | "dislike" | null;
};

export default function HomePage() {
  const voterId = useVoterId();
  const [professors, setProfessors] = useState<Professor[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!voterId) return;
    fetch(`/api/professors?voterId=${voterId}`)
      .then((res) => res.json())
      .then(setProfessors);
  }, [voterId]);

  // Alphabetical for the grid, regardless of vote counts
  const alphabetical = useMemo(() => {
    if (!professors) return [];
    return [...professors]
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [professors, query]);

  // Derived live, recalculates the instant `professors` state changes
  const topProfessor = useMemo(() => {
    if (!professors || professors.length === 0) return null;
    const withVotes = professors.filter((p) => p.likes > 0);
    if (withVotes.length === 0) return null;
    return withVotes.reduce((top, p) =>
      p.likes > top.likes ? p : top
    );
  }, [professors]);

  // Keyboard shortcuts: J/K or arrows to move focus, L to like, D to dislike
  const [focusedIndex, setFocusedIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return; // don't hijack search typing

      if (["ArrowDown", "j", "J"].includes(e.key)) {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, alphabetical.length - 1));
      } else if (["ArrowUp", "k", "K"].includes(e.key)) {
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "l" || e.key === "L") {
        const p = alphabetical[focusedIndex];
        if (p) handleVote(p.id, "like");
      } else if (e.key === "d" || e.key === "D") {
        const p = alphabetical[focusedIndex];
        if (p) handleVote(p.id, "dislike");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [alphabetical, focusedIndex]);

  useEffect(() => {
    cardRefs.current[focusedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusedIndex]);

  async function handleVote(professorId: number, value: "like" | "dislike") {
    if (!voterId || !professors) return;

    setProfessors((prev) => {
      if (!prev) return prev;
      return prev.map((p) => {
        if (p.id !== professorId) return p;
        const wasSame = p.userVote === value;
        let likes = p.likes;
        let dislikes = p.dislikes;

        if (wasSame) {
          value === "like" ? likes-- : dislikes--;
          return { ...p, likes, dislikes, userVote: null };
        }
        if (p.userVote === "like") likes--;
        if (p.userVote === "dislike") dislikes--;
        value === "like" ? likes++ : dislikes++;
        return { ...p, likes, dislikes, userVote: value };
      });
    });

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId, professorId, value }),
      });
      if (!res.ok) throw new Error("Vote failed");
    } catch {
      // Roll back by refetching truth from the server
      fetch(`/api/professors?voterId=${voterId}`)
        .then((res) => res.json())
        .then(setProfessors);
    }
  }

  return (
    <main className="bg-base">
      <Hero preview={alphabetical.slice(0, 6)} />
      <MostLoved professor={topProfessor} />

      <section className="relative overflow-hidden px-4 pb-20 pt-10 md:px-8 lg:px-12">
        <AnimatedGradient />
        <div className="relative z-10">
        <div className="mx-auto max-w-7xl">
          <h2
            className="text-4xl font-bold text-white md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Rate Them All
          </h2>
          <p className="mt-2 text-sm text-white/50">
            {professors ? `${professors.length} professors, alphabetical.` : "Loading..."}
            {" "}
            <span className="text-white/30">
              Use J/K to move, L to like, D to dislike.
            </span>
          </p>

          <div className="relative mt-6">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              placeholder="Search professors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-control border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white shadow-card backdrop-blur-sm placeholder:text-white/30 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {alphabetical.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`rounded-card transition-shadow ${
                  i === focusedIndex ? "ring-2 ring-accent" : ""
                }`}
              >
                <VoteCard
                  professor={{
                    id: p.id,
                    name: p.name,
                    department: p.department,
                    imageUrl: p.imageUrl,
                  }}
                  likes={p.likes}
                  dislikes={p.dislikes}
                  userVote={p.userVote}
                  onVote={(value) => handleVote(p.id, value)}
                  index={i}
                />
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}
