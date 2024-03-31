import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCss from "unocss/vite";
import Icons from "unplugin-icons/vite";

import { promisify } from "util";
import { exec } from "child_process";

const execute = promisify(exec);

export default defineConfig(async ({ mode }) => {
  const version =
    mode == "development"
      ? "development"
      : (await execute("git rev-parse --short HEAD")).stdout;

  return {
    plugins: [UnoCss(), solid(), Icons({ compiler: "solid" })],
    define: {
      __GIT_REVISION__: JSON.stringify(version),
    },
  };
});
