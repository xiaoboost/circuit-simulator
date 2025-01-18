import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  tseslint.configs.recommended,
  {
    files: ['*/{src,tests}/**/*.{js,ts,jsx,tsx'],
  },
  {
    ignores: [
      '**/dist/',
      '**/tmp/',
      '**/draft/',
      '**/node_modules/',
      '**/ava.config.js',
    ],
  },
  {
    extends: [importPlugin.flatConfigs.recommended],
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'brace-style': ['error', 'stroustrup', { 'allowSingleLine': false }],
      'comma-dangle': ['error', 'always-multiline'],
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
          'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
        },
      ],
      'no-unused-vars': 'off',
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          "argsIgnorePattern": "^_",
          "ignoreRestSiblings": true,
        },
      ],
      '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
      'import/no-named-as-default': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // 引入类型的时候这个规则会报错
      'import/named': 'off',
      'max-len': ['warn', {
        code: 100,
      }],
    },
  },
);
