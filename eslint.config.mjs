import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "prefer-arrow-callback": 0,
      "arrow-body-style": 0,
      "no-console": 0,
      "no-alert": 0
    },
  },
];
