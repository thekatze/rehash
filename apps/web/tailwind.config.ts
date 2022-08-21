import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      primary: {
        DEFAULT: "#048da9",
        500: "#05a2c2",
        400: "#00b1cc",
      },
      secondary: {
        400: "#00cc81",
      },
      white: "#ecedee",
      black: "#151718",
      subtle: "#9ba1a6",
      surface: "#1e1f20",
      transparent: "transparent",
    },
    boxShadow: {
      DEFAULT: "0 0 0.5em #ecedee0a",
    },
  },
  plugins: [],
};

export default config;
