"use client";

import { AnimatePresence, motion } from "motion/react";
import { Crown, ThumbsUp } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight-ui";

type Professor = {
  id: number;
  name: string;
  department: string | null;
  imageUrl: string | null;
  likes: number;
  dislikes: number;
};

export function MostLoved({ professor }: { professor: Professor | null }) {
  return (
    <section
      id="spotlight"
      className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-black px-6 py-20 text-center"
    >
      <Spotlight className="-top-40 -left-40 md:-left-20 md:-top-20" fill="white" />
      <Spotlight className="-top-40 -right-40 md:-right-20 md:-top-20" fill="white" />

      <div className="relative z-10 flex flex-col items-center">
        <p className="mb-6 text-sm uppercase tracking-wide text-accent/80">
          Most Loved Right Now
        </p>

        <AnimatePresence mode="wait">
          {professor ? (
            <motion.div
              key={professor.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xs rounded-card bg-gradient-to-br from-accent/50 via-white/10 to-transparent p-[1.5px] shadow-[0_0_70px_rgba(245,166,35,0.15)]"
            >
              <div className="rounded-[19px] bg-black px-8 pb-8 pt-8 backdrop-blur-md">
                <Crown
                  size={40}
                  className="mx-auto mb-2 text-accent"
                  fill="currentColor"
                  strokeWidth={1}
                />

                {professor.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={professor.imageUrl}
                    alt={professor.name}
                    className="mx-auto aspect-square w-24 rounded-full border-2 border-accent object-cover object-top shadow-[0_0_24px_rgba(245,166,35,0.35)]"
                  />
                ) : (
                  <div className="mx-auto flex aspect-square w-24 items-center justify-center rounded-full border-2 border-accent bg-white/5 text-xs text-white/30">
                    No photo
                  </div>
                )}

                <h2 className="mt-5 text-xl font-medium text-white">
                  {professor.name}
                </h2>
                <p className="mt-2 flex items-center justify-center gap-1.5 text-2xl font-semibold text-accent">
                  {professor.likes}
                  <ThumbsUp size={20} fill="currentColor" strokeWidth={2} />
                </p>
              </div>
            </motion.div>
          ) : (
            <p className="text-white/30">No votes yet, be the first.</p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}