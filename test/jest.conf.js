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
    },
    transform: {
        '^.+\\.vue$': '<rootDir>/node_modules/vue-jest',
        '^.+\\.(j|t)sx?$': '<rootDir>/node_modules/ts-jest',
    },
    testRegex: '(\\.|/)(test|spec)\\.tsx?$',
    setupTestFrameworkScriptFile: 'jest-extended',
    snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
    setupFiles: [
        '<rootDir>/test/setups/vue.ts',
        '<rootDir>/test/setups/env.ts',
    ],
    coverageDirectory: '<rootDir>/test/coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,vue}',
        '!src/main.ts',
        '!src/**/*.d.ts',
        '!src/examples/*.ts',
        '!src/**/{types,icon,debugger}.ts',
        '!src/components/electronic-part/parts/*',
        '!src/components/*/index.ts',
        '!**/node_modules/**',
    ],
};
