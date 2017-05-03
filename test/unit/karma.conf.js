// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

const webpackConfig = require('../../build/webpack.test.conf');

module.exports = function(config) {
    config.set({
        // 测试浏览器
        browsers: ['Chrome'],
        // 测试框架
        frameworks: ['mocha', 'sinon-chai'],
        // 测试报告处理
        reporters: ['spec', 'coverage'],
        // 测试的文件
        files: ['./index.js'],
        // 预处理文件
        preprocessors: {
            './index.js': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        coverageReporter: {
            dir: './coverage',
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' }
            ]
        }
    });
};
