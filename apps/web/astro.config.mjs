import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import cssnano from "cssnano";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.rehash.one",
  integrations: [solidJs(), tailwind(), sitemap()],
  vite: {
    css: {
      postcss: {
        plugins: [cssnano({ preset: "advanced" })],
      },
    },
  },
});
