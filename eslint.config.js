import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

import eslintJs from "@eslint/js";
import eslintNext from "@next/eslint-plugin-next";
import eslintJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPrettier from "eslint-plugin-prettier/recommended";
import eslintReact from "eslint-plugin-react";
import eslintReactHooks from "eslint-plugin-react-hooks";
import eslintTs from "typescript-eslint";

const config = defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      js: eslintJs,
      ts: eslintTs.plugin,
    },
    extends: [eslintJs.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  eslintTs.configs.recommended,
  eslintReact.configs.flat.recommended,
  eslintReact.configs.flat["jsx-runtime"],
  eslintReactHooks.configs["recommended-latest"],
  eslintJsxA11y.flatConfigs.recommended,
  eslintNext.flatConfig.coreWebVitals,
  eslintPrettier,
  globalIgnores([
    "**/.next/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/out/**",
    "**/coverage/**",
  ]),
]);

export default config;
