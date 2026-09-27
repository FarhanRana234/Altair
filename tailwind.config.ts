import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: "#FFFFFF",
          "blue-light": "#7DA7D9",
          "blue-mid": "#6484B5",
          "blue-deep": "#446391",
          "navy-bg": "#061a3a",
        },
        // Direct utility aliases matching brand tokens
        "navy-bg": "#061a3a",
        "blue-light": "#7DA7D9",
        "blue-mid": "#6484B5",
        "blue-deep": "#446391",
        space: {
          DEFAULT: "#061a3a",
          deep: "#061a3a",
        },
        accent: {
          cyan: "#7DA7D9",
          blue: "#6484B5",
          deep: "#446391",
        },
        platinum: "#FFFFFF",
      },
      fontFamily: {
        display: ["Batangas", "var(--font-display)", "Bodoni Moda", "Cormorant Garamond", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Lekton", "monospace"],
        sans: ["var(--font-mono)", "Lekton", "monospace"],
      },
      letterSpacing: {
        widest2: "0.28em",
        widest3: "0.35em",
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
