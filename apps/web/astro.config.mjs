import { defineConfig } from "astro/config";
import UnoCss from "unocss/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [UnoCss({ injectReset: true })],
});
