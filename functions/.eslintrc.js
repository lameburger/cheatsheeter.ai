module.exports = {
  env: {
    es6: true,
    node: true, // Add Node.js environment globally
    browser: true, // For frontend files
  },
  parserOptions: {
    ecmaVersion: 2021, // Modern syntax support
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended", // Add React plugin
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", { allowTemplateLiterals: true }],
    "max-len": ["error", { code: 100, ignoreUrls: true }],
    "indent": ["error", 2],
    "semi": ["error", "always"],
    "react/prop-types": "off", // Disable PropTypes if using TypeScript
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["functions/**/*.js"], // Node.js files (e.g., Firebase functions)
      env: {
        node: true,
      },
    },
    {
      files: ["src/**/*.js"], // Frontend files
      env: {
        browser: true,
      },
    },
  ],
};