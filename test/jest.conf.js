const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '../'),
    moduleFileExtensions: [
        'vue',
        'ts',
        'tsx',
        'js',
    ],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '\\.(css|styl(us)?)$': '<rootDir>/test/mocks/style.js',
    },
    transform: {
        '^.+\\.(j|t)sx?$': '<rootDir>/node_modules/ts-jest',
        '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    },
    testURL: 'http://localhost/',
    testRegex: '(/test/.*spec)\\.ts$',
    snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
    setupTestFrameworkScriptFile: '<rootDir>/test/setups/env.ts',
    coverageDirectory: '<rootDir>/test/coverage',
    collectCoverageFrom: [
        'src/**/*.ts',

        '!src/main.ts',
        '!src/**/*.d.ts',
        '!src/lib/utils/*',
        '!src/**/{types,icons,debugger}.ts',
        '!src/components/electronic-part/parts/*',
        '!**/node_modules/**',
    ],
    globals: {
        'vue-jest': {
            tsConfigFile: 'tsconfig.json',
        },
    },
};
