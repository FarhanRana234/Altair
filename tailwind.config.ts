import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          DEFAULT: "#0B132B",
          deep: "#030712",
        },
        accent: {
          cyan: "#00F0FF",
          blue: "#3B82F6",
        },
        platinum: "#E2E8F0",
        gold: "#F59E0B",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      animation: {
        "float-slow": "floatY 6s ease-in-out infinite",
        "pulse-line": "pulseLine 1.6s ease-in-out infinite",
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseLine: {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(8px)", opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};

export default config;