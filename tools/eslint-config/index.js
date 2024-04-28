module.exports = {
  root: true,
  extends: [require.resolve('@xiao-ai/eslint-config'), 'plugin:react/recommended'],
  rules: {
    'prettier/prettier': 'off',
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

    'react/prop-types': 'off',

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
    'no-multi-spaces': [
      'error',
      {
        exceptions: {
          Property: true,
          BinaryExpression: true,
          VariableDeclarator: true,
        },
      },
    ],
  },
};
