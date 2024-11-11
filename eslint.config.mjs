import solid from "eslint-plugin-solid";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import parser from "astro-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "plugin:astro/recommended",
    "plugin:astro/jsx-a11y-recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
), {
    plugins: {
        solid,
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {},
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
    },
}, {
    files: ["**/*.astro"],

    languageOptions: {
        parser: parser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            parser: "@typescript-eslint/parser",
            extraFileExtensions: [".astro"],
        },
    },

    rules: {},
}];
