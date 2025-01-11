import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  tseslint.configs.recommended,
  {
    files: ['{src,tests}/**/*.{js,ts,jsx,tsx'],
  },
  {
    extends: [importPlugin.flatConfigs.recommended],
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single'],
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
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
      'max-len': ['warn', {
        code: 100,
      }],
    },
  },
);
