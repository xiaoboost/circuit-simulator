module.exports = {
  "extensions": [
    "ts"
  ],
  "require": [
    // "tsx"
    "tsx"
  ],
  "environmentVariables": {
    "TS_NODE_PROJECT": "tsconfig.json",
    "NODE_ENV": "test"
  },
  "files": [
    "tests/**/*.spec.ts"
  ]
};
