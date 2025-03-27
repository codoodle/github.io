import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";
import globals from "globals";

import eslintJs from "@eslint/js";
import eslintPrettier from "eslint-plugin-prettier/recommended";
import eslintReact from "eslint-plugin-react";
import eslintReactHooks from "eslint-plugin-react-hooks";
import eslintTs from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      js: eslintJs,
    },
    extends: ["js/recommended"],
  },
  eslintTs.configs.recommended,
  eslintReact.configs.flat.recommended,
  eslintReact.configs.flat["jsx-runtime"],
  eslintReactHooks.configs["recommended-latest"],
  ...compat.config({
    plugins: ["@next/next"],
    extends: ["plugin:@next/next/recommended"],
    rules: {
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-sync-scripts": "error",
    },
  }),
  eslintPrettier,
]);
