module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "no-console": true,
    quotes: ["error", "single", { avoidEscape: true }],
    indent: ["error", 2]
  }
};
