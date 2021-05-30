const path = require('path');
const fs = require('fs');
const workspace = process.cwd();
const isRoot = fs.existsSync(path.join(workspace, 'pnpm-lock.yaml'));
const rootWorkspace = isRoot ? workspace : path.join(workspace, '../../');
const projectConfig = path.join(rootWorkspace, 'tsconfig.test.json');
const relativeRoot = path.relative(rootWorkspace, workspace);

const ignorePaths = [
  'dev/*',
  'dist/*',
  'draft/*',
  'coverage/*',
  '.vscode/*',
  '.eslintrc.js',
  '**/*.js',
].map((name) => path.join(relativeRoot, name).replace(/\\+/g, '/'));

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  ignorePatterns: ignorePaths,
  parserOptions: {
    project: projectConfig,
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  settings: {
    react: {
      pragma: 'React',
      version: '17',
    },
  },
  rules: {
    'no-prototype-builtins': 'off',
    'no-sparse-arrays': 'off',
    'indent': 'off',
    'brace-style': 'off',
    'no-debugger': 'off',

    'max-len': ['warn', {
      code: 100,
    }],
    'keyword-spacing': 'error',
    'curly': 'error',
    'eqeqeq': ['error', 'always'],
    'no-extra-label': 'error',
    'no-implicit-coercion': 'error',
    'no-multi-spaces': 'error',

    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/indent':  ['error', 2, {
      SwitchCase: 1,
    }],
    '@typescript-eslint/brace-style': ['error', 'stroustrup', {
      allowSingleLine: true,
    }],
  },
};
