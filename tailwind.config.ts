import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#09090B",
        "bg-secondary": "#111318",
        card: "#181A20",
        border: "#2A2E36",
        "text-primary": "#FFFFFF",
        "text-secondary": "#C8CDD6",
        "text-muted": "#7A808C",
        accent: "#2563EB",
        "accent-hover": "#3B82F6",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(3.5rem, 9vw, 8.5rem)", { lineHeight: "0.92", letterSpacing: "0.01em" }],
        "section": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "0.95", letterSpacing: "0.01em" }],
      },
      letterSpacing: {
        eyebrow: "0.2em",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
