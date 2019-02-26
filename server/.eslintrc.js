module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  extends: 'eslint:recommended',
  rules: {
    quotes: ['error', 'single'],
    indent: ['error', 2],
    'no-undef': 'off',
    'no-console': ['error', { allow: ['warn', 'error', 'log'] }]
  }
};
