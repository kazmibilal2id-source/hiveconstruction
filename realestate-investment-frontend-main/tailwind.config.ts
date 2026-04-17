import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1120",
          gold: "#D4A843"
        }
      },
      boxShadow: {
        glow: "0 10px 40px rgba(212, 168, 67, 0.25)"
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at top, rgba(212, 168, 67, 0.20), rgba(11, 17, 32, 1) 55%)"
      }
    }
  },
  plugins: []
};

export default config;
