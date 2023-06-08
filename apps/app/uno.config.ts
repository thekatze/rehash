import { defineConfig, presetWind } from "unocss";

export default defineConfig({
  presets: [presetWind()],
  theme: {
    colors: {
      "background": {
        DEFAULT: "#121212"
      },
      "line": {
        DEFAULT: "#444444"
      },
      "text": {
        DEFAULT: "#EAEAEA"
      },
      "accent": {
        DEFAULT: "#00ADB5"
      }
    }
  }
});
