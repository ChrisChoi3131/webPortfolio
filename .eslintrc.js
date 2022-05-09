module.exports = {
  env: {
    es2021: true,
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['prettier', 'html'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  settings: {
    'html/report-bad-indent': 'error',
    'html/html-extensions': ['.html'],
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        singleQuote: true,
        useTabs: false,
        tabWidth: 2,
        arrowParens: 'avoid',
      },
    ],
  },
};
