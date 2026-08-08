"use client";

import { motion } from "motion/react";
import { VoteButton } from "./vote-button";
import styles from "./vote-card.module.css";

type Props = {
  professor: { id: number; name: string; department: string | null; imageUrl: string | null };
  likes: number;
  dislikes: number;
  userVote: "like" | "dislike" | null;
  onVote: (value: "like" | "dislike") => void;
  index: number;
};

export function VoteCard({ professor, likes, dislikes, userVote, onVote, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.32, delay: (index % 12) * 0.03, ease: [0.16, 1, 0.3, 1] }}
      className={`${styles.card} group transition-shadow duration-standard hover:border-white/20 hover:shadow-hover`}
    >
      <div className={styles.hero}>
        {professor.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={professor.imageUrl}
            alt={professor.name}
            className={styles.photo}
            loading="lazy"
          />
        ) : null}
      </div>

      <div className={styles.info}>
        <h3 className="text-base font-semibold leading-snug tracking-[-0.01em] text-white">
          {professor.name}
        </h3>
        {professor.department && (
          <p className="mt-1 text-xs text-white/45">{professor.department}</p>
        )}

        <div className="mt-4 flex gap-2">
          <VoteButton type="like" active={userVote === "like"} count={likes} onClick={() => onVote("like")} />
          <VoteButton type="dislike" active={userVote === "dislike"} count={dislikes} onClick={() => onVote("dislike")} />
        </div>
      </div>
    </motion.div>
  );
}
