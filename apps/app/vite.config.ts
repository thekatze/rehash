import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCss from "unocss/vite";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [UnoCss(), solid(), Icons({ compiler: "solid" })],
});
