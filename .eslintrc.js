module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: [
    '@typescript-eslint',
    'n8n-nodes-base',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:n8n-nodes-base/nodes',
    'plugin:n8n-nodes-base/credentials',
    'prettier',
  ],
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    
    // n8n specific overrides
    'n8n-nodes-base/node-param-description-missing-final-period': 'off',
    'n8n-nodes-base/node-param-description-excess-final-period': 'off',
    'n8n-nodes-base/node-param-description-unencoded-angle-brackets': 'off',
    'n8n-nodes-base/node-param-placeholder-missing': 'off',
    'n8n-nodes-base/node-param-options-type-unsorted-items': 'off',
    
    // General rules
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '*.js',
    'gulpfile.js',
    'jest.config.js',
  ],
  overrides: [
    {
      files: ['**/*.spec.ts', '**/*.test.ts'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
