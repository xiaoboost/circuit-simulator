const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '../'),
    moduleFileExtensions: [
        'ts',
        'js',
        'vue',
    ],
    moduleNameMapper: {
        '^worker-loader!(.*)$': '$1',
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.vue$': '<rootDir>/node_modules/vue-jest',
        '^.+\\.worker\\.(j|t)sx?$': '<rootDir>/test/transform/worker-loader',
        '^.+\\.(j|t)sx?$': '<rootDir>/node_modules/ts-jest',
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
