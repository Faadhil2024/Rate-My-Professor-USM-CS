"use client";

import React from "react";
import { motion } from "motion/react";

type SpotlightProps = {
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
};

export const SpotlightNew = ({
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
}: SpotlightProps) => {
  const gradientFirst =
    "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(42, 100%, 65%, .12) 0, hsla(42, 100%, 55%, .04) 50%, hsla(42, 100%, 45%, 0) 80%)";
  const gradientSecond =
    "radial-gradient(50% 50% at 50% 50%, hsla(42, 100%, 65%, .08) 0, hsla(42, 100%, 55%, .03) 80%, transparent 100%)";
  const gradientThird =
    "radial-gradient(50% 50% at 50% 50%, hsla(42, 100%, 65%, .06) 0, hsla(42, 100%, 45%, .03) 80%, transparent 100%)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <motion.div
        animate={{ x: [0, xOffset, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-0 top-0 z-40 h-full w-full"
      >
        <div
          style={{ transform: `translateY(${translateY}px) rotate(-45deg)`, background: gradientFirst, width, height }}
          className="absolute left-0 top-0"
        />
        <div
          style={{ transform: "rotate(-45deg) translate(5%, -50%)", background: gradientSecond, width: smallWidth, height }}
          className="absolute left-0 top-0 origin-top-left"
        />
        <div
          style={{ transform: "rotate(-45deg) translate(-180%, -70%)", background: gradientThird, width: smallWidth, height }}
          className="absolute left-0 top-0 origin-top-left"
        />
      </motion.div>

      <motion.div
        animate={{ x: [0, -xOffset, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-0 top-0 z-40 h-full w-full"
      >
        <div
          style={{ transform: `translateY(${translateY}px) rotate(45deg)`, background: gradientFirst, width, height }}
          className="absolute right-0 top-0"
        />
        <div
          style={{ transform: "rotate(45deg) translate(-5%, -50%)", background: gradientSecond, width: smallWidth, height }}
          className="absolute right-0 top-0 origin-top-right"
        />
        <div
          style={{ transform: "rotate(45deg) translate(180%, -70%)", background: gradientThird, width: smallWidth, height }}
          className="absolute right-0 top-0 origin-top-right"
        />
      </motion.div>
    </motion.div>
  );
};