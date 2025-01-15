import { ESLint } from "eslint";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["node_modules", "dist"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    rules: {
      // Add or customize rules as needed
      "no-unused-vars": "warn",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
