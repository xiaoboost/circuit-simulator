const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '../'),
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
    ],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '\\.(css|styl(us)?)$': '<rootDir>/test/mocks/styleMock.js',
    },
    transform: {
        '^.+\\.(j|t)sx?$': '<rootDir>/node_modules/ts-jest',
    },
    testRegex: '(\\.|/)(test|spec)\\.ts$',
    setupTestFrameworkScriptFile: 'jest-extended',
    setupFiles: [
        '<rootDir>/test/setups/vue.ts',
        '<rootDir>/test/setups/env.ts',
    ],
    coverageDirectory: '<rootDir>/test/coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/main.ts',
        '!src/**/*.d.ts',
        '!src/**/{types,icon,debugger}.ts',
        '!src/components/electronic-part/parts/*',
        '!src/components/*/index.ts',
        '!**/node_modules/**',
    ],
    globals: {
        'ts-jest': {
            useBabelrc: true,
        },
    },
};
