import path from "path";
import fs from "fs";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import WindiCSS from "vite-plugin-windicss";
import { VitePWA } from "vite-plugin-pwa";

import { promisify } from "util";
import { exec } from "child_process";

const execute = promisify(exec);

export default defineConfig(async ({ command, mode }) => {
  const isDev = mode == "development";
  const version = isDev
    ? "development"
    : (await execute("git rev-parse --short HEAD")).stdout;

  return {
    plugins: [
      solidPlugin(),
      WindiCSS(),
      Icons({
        compiler: "solid",
      }),
      VitePWA({
        includeAssets: [
          "assets/favicon.svg",
          "assets/favicon.ico",
          "assets/robots.txt",
          "assets/apple-touch-icon.png",
        ],
        manifest: {
          name: "rehash",
          short_name: "rehash",
          description:
            "Offline Passwordmanager that doesn't save your passwords",
          theme_color: "#191724",
          icons: [
            {
              src: "assets/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "assets/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "assets/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
    build: {
      target: "esnext",
    },
    define: {
      __GIT_REVISION__: JSON.stringify(version),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        rosetta: isDev ? "rosetta/debug" : "rosetta",
      },
    },
    https: isDev
      ? {
          key: fs.readFileSync(".cert/key.pem"),
          cert: fs.readFileSync(".cert/cert.pem"),
        }
      : {},
  };
});
