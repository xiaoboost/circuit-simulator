import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from "eslint/config";

export default defineConfig(
  tseslint.configs.recommended,
  stylistic.configs.recommended,
  importPlugin.flatConfigs.recommended,
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
    rules: {
      // ========== 基础样式规则 ==========
      '@stylistic/array-bracket-newline': ['error', {
        multiline: true,
        minItems: 3,
      }],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      '@stylistic/brace-style': ['error', 'stroustrup', { 'allowSingleLine': false }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/max-len': ['warn', {
        code: 100,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/member-delimiter-style': ['error', {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": false
        },
        "multilineDetection": "brackets"
      }],

      // ========== 类型规则 ==========
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          "argsIgnorePattern": "^_",
          "ignoreRestSiblings": true,
        },
      ],

      // ========== 导入规则 ==========
      'import/no-named-as-default': 'off',
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          'alphabetize': {
            'order': 'asc',
            'caseInsensitive': true,
          },
        },
      ],
      'no-unused-vars': 'off',
      'import/no-unresolved': 'off',
      // 引入类型的时候这个规则会报错
      'import/named': 'off',
    },
  },
);
