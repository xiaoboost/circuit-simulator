const utils = require('./utils'),
    webpack = require('webpack'),
    config = require('../config'),
    merge = require('webpack-merge'),
    baseWebpackConfig = require('./webpack.base.conf'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

// 将 Hol-reload相对路径添加到webpack.base.conf对应entry前
Object.keys(baseWebpackConfig.entry).forEach((name) => {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

// 将 base 配置和 dev 配置合并
module.exports = merge(baseWebpackConfig, {
    module: {
        // 使用 styleLoaders
        rules: utils.styleLoaders({
            sourceMap: config.dev.cssSourceMap,
        }),
    },
    // 使用 #eval-source-map 模式作为开发工具
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env,
        }),
        // HotModule插件在页面进行变更的时候只会重绘对应的页面模块，不会重绘整个页面
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        // 报错不会阻塞页面程序的运行，但是会在编译结束后提示
        new webpack.NoEmitOnErrorsPlugin(),
        // 将index.html作为入口，注入html代码后生成index.html文件
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: true,
        }),
        new FriendlyErrorsPlugin(),
    ],
});
