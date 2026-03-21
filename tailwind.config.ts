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
        background: "#121212",
        surface: "#181818",
        surfaceHover: "#282828",
        love: {
          accent: "#E50914",
          magenta: "#C9184A",
          soft: "#F4C2C2",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#B3B3B3",
        },
      },
      backgroundImage: {
        "gradient-love": "linear-gradient(to bottom, #C9184A 0%, #121212 100%)",
      },
    },
  },
  plugins: [
    require('tailwindcss-safe-area'),
  ],
};
export default config;