import { defineConfig, presetWind } from "unocss";

export default defineConfig({
  presets: [presetWind()],
  theme: {
    colors: {
      grayscale: {
        "100": "rgb(242, 242, 242)",
        "200": "rgb(215, 215, 215)",
        "300": "rgb(190, 190, 190)",
        "400": "rgb(166, 166, 166)",
        "500": "rgb(143, 143, 143)",
        "600": "rgb(120, 120, 120)",
        "700": "rgb(96, 96, 96)",
        "800": "rgb(71, 71, 71)",
        "900": "rgb(39, 39, 39)",
      },
    },
  },
});
