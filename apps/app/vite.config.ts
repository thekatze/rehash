import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import WindiCSS from "vite-plugin-windicss";

export default defineConfig({
  plugins: [
    solidPlugin(),
    WindiCSS(),
    Icons({
      compiler: "solid",
    }),
  ],
  build: {
    target: "esnext",
  },
});
