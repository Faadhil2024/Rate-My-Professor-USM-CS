"use client";

import { motion } from "motion/react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type Props = {
  type: "like" | "dislike";
  active: boolean;
  count: number;
  onClick: () => void;
};

export function VoteButton({ type, active, count, onClick }: Props) {
  const isLike = type === "like";
  const Icon = isLike ? ThumbsUp : ThumbsDown;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-1 items-center justify-center gap-2 rounded-control border px-3 py-2.5 text-sm font-medium transition-all duration-standard ${
        active
          ? isLike
            ? "border-like/50 bg-like/10 text-like shadow-[0_0_16px_rgba(74,222,128,0.15)]"
            : "border-dislike/50 bg-dislike/10 text-dislike shadow-[0_0_16px_rgba(248,113,113,0.15)]"
          : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
      }`}
      aria-pressed={active}
      aria-label={isLike ? "Like this professor" : "Dislike this professor"}
    >
      <Icon
        size={16}
        strokeWidth={2.25}
        fill={active ? "currentColor" : "none"}
      />
      <motion.span
        key={count}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {count}
      </motion.span>
    </motion.button>
  );
}