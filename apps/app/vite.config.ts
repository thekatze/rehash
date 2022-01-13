import path from "path";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import WindiCSS from "vite-plugin-windicss";

export default defineConfig(({ command, mode }) => {
  return {
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
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        rosetta: mode === "development" ? "rosetta/debug" : "rosetta",
      },
    },
  };
});
