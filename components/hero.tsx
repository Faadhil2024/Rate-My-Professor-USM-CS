"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

function FloatingPaths({ direction }: { direction: 1 | -1 }) {
  const paths = useMemo(
    () => Array.from({ length: 28 }, (_, i) => ({
      id: i,
      d: `M-${380 - i * 5 * direction} -${189 + i * 6}C-${380 - i * 5 * direction} -${189 + i * 6} -${312 - i * 5 * direction} ${216 - i * 6} ${152 - i * 5 * direction} ${343 - i * 6}C${616 - i * 5 * direction} ${470 - i * 6} ${684 - i * 5 * direction} ${875 - i * 6} ${684 - i * 5 * direction} ${875 - i * 6}`,
      width: 0.45 + i * 0.035,
    })),
    [direction]
  );

  return (
    <svg className="absolute inset-0 h-full w-full text-white" viewBox="0 0 696 316" fill="none" aria-hidden="true">
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          initial={{ pathLength: 0.25, opacity: 0.16 }}
          animate={{ pathLength: 1, opacity: [0.12, 0.46, 0.12], pathOffset: [0, 1, 0] }}
          transition={{ duration: 26 + path.id * 0.22, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </svg>
  );
}

export function Hero({ preview }: { preview?: unknown }) {
  return (
    <section
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#05070d] px-6 text-center"
      data-preview-ready={Boolean(preview)}
    >
      <div className="pointer-events-none absolute inset-0">
        <FloatingPaths direction={1} />
        <FloatingPaths direction={-1} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(59,130,246,0.16),transparent_35%),linear-gradient(180deg,transparent_30%,#0a0a0b)]" />

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  className="relative z-10 -translate-y-4 text-6xl font-bold leading-[1.05] text-white md:text-8xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Rate My
        <br />
        Professor
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-10 max-w-md text-lg text-white/65"
      >
        Anonymous. No login. Just tap like or dislike on the professors you know.
      </motion.p>
    </section>
  );
}
