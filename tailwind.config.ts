import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0306", // Super dark moody rose/black
        surface: "#14070A",    // Slightly lighter glass surface
        surfaceHover: "#2A1116", // Rich burgundy hover
        love: {
          accent: "#FF2A5F",    // Vibrant ruby/pink
          magenta: "#D90429",   // Deep passionate red
          soft: "#FFB3C1",      // Very soft pastel pink
          glow: "#FF4D6D"
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#FFD1DC", // Soft blush text instead of gray
        },
      },
      backgroundImage: {
        "gradient-love": "linear-gradient(to bottom, #D90429 0%, #0A0306 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        blob: "blob 7s infinite",
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(40px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 15px 0px rgba(255, 42, 95, 0.4)" },
          "50%": { boxShadow: "0 0 25px 5px rgba(255, 42, 95, 0.8)" },
        }
      }
    },
  },
  plugins: [
    require('tailwindcss-safe-area'),
  ],
};
export default config;
