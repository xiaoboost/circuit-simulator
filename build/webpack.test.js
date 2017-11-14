const webpack = require('webpack'),
    baseConfig = require('./webpack.base');

// 测试状态不需要入口文件
Reflect.deleteProperty(baseConfig, 'entry');
// SourceMap 文件使用 DataUrl 形式
baseConfig.devtool = '#inline-source-map';
// 环境配置为生产环境
baseConfig.plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"',
        '$ENV.NODE_ENV': '"development"',
    })
);

module.exports = baseConfig;
