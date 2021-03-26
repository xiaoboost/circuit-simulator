const path = require('path');
const resolve = (input) => path.join(__dirname, '..', input);

module.exports = {
  rootDir: resolve(''),
  moduleFileExtensions: [
    'vue',
    'ts',
    'js',
    'json',
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(css|styl(us)?)$': '<rootDir>/test/mocks/style.js',
  },
  transform: {
    '^.+\\.(j|t)s$': '<rootDir>/node_modules/ts-jest',
    '^.+\\.vue$': '<rootDir>/node_modules/vue-jest',
  },
  testURL: 'http://localhost/',
  testRegex: '(/test/.*spec)\\.ts$',
  modulePathIgnorePatterns: ['<rootDir>\\_文档'],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFilesAfterEnv: ['<rootDir>/test/setups/env.ts'],
  setupFiles: ['<rootDir>/test/setups/vue.ts'],
  coverageDirectory: '<rootDir>/test/coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',

    '!**/*.d.ts',
    '!src/init/*',
    '!src/examples/*',
    '!src/lib/utils/*',
    '!**/node_modules/**',
    '!src/components/slider-menu/*',
    '!src/components/electronic-part/parts/*',

    '!src/main.ts',
    '!src/components/**/index.ts',
    '!src/components/action-menu/icons.ts',
    '!src/lib/{types,debugger,component}.ts',
  ],
  globals: {
    'vue-jest': {
      tsConfig: resolve('tsconfig.jest.json'),
      babelConfig: false,
    },
    'ts-jest': {
      tsConfig: resolve('tsconfig.jest.json'),
    },
  },
};
