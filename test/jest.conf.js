const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '../'),
    moduleFileExtensions: [
        'ts',
        'js',
        'vue',
    ],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.(j|t)sx?$': '<rootDir>/node_modules/ts-jest',
        '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    },
    testRegex: '(\\.|/)(test|spec)\\.tsx?$',
    snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
    setupFiles: ['<rootDir>/test/setup.ts'],
    mapCoverage: true,
    coverageDirectory: '<rootDir>/test/coverage',
    collectCoverageFrom: [
        // 'src/**/*.{ts,vue}',
        'src/lib/*.ts',
        '!src/main.ts',
        '!src/*/*.d.ts',
        '!src/**/{types,icon,shape,debugger}.ts',
        '!src/components/*/index.ts',
        '!**/node_modules/**',
    ],
};
