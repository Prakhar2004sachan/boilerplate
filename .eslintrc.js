module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "standard",
    "plugin:import/recommended",
    "plugin:promise/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2025,
    sourceType: "module",
  },
  globals: {
    IS_DEVELOPMENT: "readonly",
  },
  rules: {
    "no-console": ["warn", { allow: ["error", "warn"] }],
    "import/order": ["error", { "newlines-between": "always" }],
  },
};
