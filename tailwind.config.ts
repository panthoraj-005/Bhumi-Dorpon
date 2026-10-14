import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: {
          DEFAULT: "var(--surface)",
          alt: "var(--surface-alt)",
        },
        border: "var(--border)",
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          muted: "var(--muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          ink: "var(--accent-ink)",
          deep: "var(--accent-deep)",
          soft: "var(--accent-soft)",
        },
        loss: {
          DEFAULT: "var(--loss)",
          soft: "var(--loss-soft)",
        },
        gain: {
          DEFAULT: "var(--gain)",
          soft: "var(--gain-soft)",
        },
        forecast: {
          DEFAULT: "var(--forecast)",
          soft: "var(--forecast-soft)",
        },
        water: "var(--water)",
        warn: "var(--warn)",
      },
      borderRadius: {
        "card": "20px",
        "pill": "9999px",
        "input": "12px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(20, 23, 15, 0.04)",
        card: "0 1px 3px rgba(20, 23, 15, 0.03)",
        popover: "0 4px 16px rgba(20, 23, 15, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
