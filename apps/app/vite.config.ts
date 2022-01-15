import path from "path";
import fs from "fs";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import WindiCSS from "vite-plugin-windicss";

export default defineConfig(({ command, mode }) => {
  const isDev = mode == "development";

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
        rosetta: isDev ? "rosetta/debug" : "rosetta",
      },
    },
    https: isDev
      ? {
          key: fs.readFileSync(".cert/dev-private.pem"),
          cert: fs.readFileSync(".cert/dev.pem"),
        }
      : {},
  };
});
