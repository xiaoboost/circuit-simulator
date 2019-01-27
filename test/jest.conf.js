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
        '.*\\.vue$': '<rootDir>/node_modules/vue-jest',
    },
    testURL: 'http://localhost/',
    testRegex: '(/test/.*spec)\\.ts$',
    snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
    setupTestFrameworkScriptFile: '<rootDir>/test/setups/env.ts',
    setupFiles: ['<rootDir>/test/setups/vue.ts'],
    coverageDirectory: '<rootDir>/test/coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,vue}',

        '!src/main.ts',
        '!src/**/*.d.ts',
        '!src/lib/utils/*',
        '!src/components/slider-menu/*',
        '!src/components/electronic-part/parts/*',
        '!src/**/{types,icons,debugger,component}.ts',
        '!**/node_modules/**',
    ],
    globals: {
        'vue-jest': {
            tsConfig: resolve('tsconfig.jest.json'),
        },
        'ts-jest': {
            tsConfig: resolve('tsconfig.jest.json'),
        },
    },
};
