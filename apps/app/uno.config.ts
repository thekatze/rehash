import { defineConfig, presetUno } from "unocss";
import presetWebFonts from "@unocss/preset-web-fonts";

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      provider: "fontshare",
      fonts: {
        sans: {
          name: "Satoshi",
          weights: [500, 700, 900],
          italic: false,
          provider: undefined,
        },
      },
    }),
  ],
  theme: {
    colors: {
      black: "#091110",
      white: "#F4F9F8",
      primary: {
        50: "#F4F9F8",
        100: "#DAEDE8",
        200: "#B5DAD1",
        300: "#88C0B4",
        400: "#599A8E",
        500: "#45877C",
        600: "#356C64",
        700: "#2E5752",
        800: "#284743",
        900: "#253C3A",
        950: "#112221",
      },
    },
  },
});
