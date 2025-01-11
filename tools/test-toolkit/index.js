module.exports = {
  extensions: ['ts'],
  require: [
    require.resolve("tsx/cjs"),
  ],
  environmentVariables: {
    TS_NODE_PROJECT: 'tsconfig.json',
    NODE_ENV: 'testing',
  },
  files: [
    'tests/**/*.spec.ts',
  ],
};
