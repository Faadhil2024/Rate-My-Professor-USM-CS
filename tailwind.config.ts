import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0A0B",
        surface: "#141416",
        accent: "#F5A623",
        like: "#4ADE80",
        dislike: "#F87171",
      },
      borderRadius: {
        chip: "8px",
        control: "12px",
        card: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        hover: "0 2px 4px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.10)",
      },
      transitionDuration: {
        micro: "120ms",
        standard: "200ms",
        page: "320ms",
      },
    },
  },
  plugins: [],
} satisfies Config;