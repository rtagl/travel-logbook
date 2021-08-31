module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    'comma-dangle': ['error', 'only-multiline'],
    'prefer-destructuring': ['error', { object: false, array: false }],
    'no-underscore-dangle': ['error', { allow: true }],
  },
};
