module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['jest-e2e.cjs', 'node_modules', 'dist', '.eslintrc.cjs'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'semi': ['error', 'always'],
  },
};
