import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "plugin:jsx-a11y/recommended"),
  {
    rules: {
      "prefer-const": "error",
      "no-unused-vars": "off",
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-role": "error", 
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/interactive-supports-focus": "error",
      "jsx-a11y/label-has-associated-control": "error"
    }
  }
];

export default eslintConfig;