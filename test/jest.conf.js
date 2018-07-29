const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '../'),
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
        '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    },
    testURL: 'http://localhost/',
    testRegex: '(/test/.*spec)\\.ts$',
    snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
    setupTestFrameworkScriptFile: '<rootDir>/test/setups/env.ts',
    coverageDirectory: '<rootDir>/test/coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,vue}',

        '!src/main.ts',
        '!src/**/*.d.ts',
        '!src/lib/utils/*',
        '!src/components/electronic-part/parts/*',
        '!src/**/{types,icons,debugger,component}.ts',
        '!**/node_modules/**',
    ],
    globals: {
        'vue-jest': {
            tsConfigFile: 'tsconfig.jest.json',
        },
        'ts-jest': {
            tsConfigFile: 'tsconfig.jest.json',
        },
    },
};
