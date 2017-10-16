const path = require('path'),
    utils = require('./utils'),
    webpack = require('webpack'),
    config = require('../config/prod'),
    merge = require('webpack-merge'),
    version = utils.createVersionTag(),
    // 基础配置
    baseWebpackConfig = require('./webpack.base.conf'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    // webpack 插件，用于生成 html 文件
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    // webpack 插件，从文件中分离代码
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    // webpack 插件，优化、最小化 css 文件
    OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

// 将基础配置和当前配置合并
const webpackConfig = merge(baseWebpackConfig, {
    module: {
        // css 的 loader
        rules: utils.styleLoaders({
            sourceMap: config.productionSourceMap,
            extract: true,
        }),
    },
    // 是否使用 #source-map
    devtool: config.productionSourceMap ? '#source-map' : false,
    output: {
        // 编译输出路径
        path: config.assetsRoot,
        // 编译输出文件名
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
    },
    plugins: [
        // 给每个文件创建顶部注释
        new webpack.BannerPlugin({
            banner: `Project: Circuit Simulator\nAuthor: 2015 - 2017 XiaoBoost\n\nBuild: ${version}\nfilename: [name], chunkhash: [chunkhash]\nReleased under the MIT License.`,
        }),
        // js 压缩插件
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //     },
        //     sourceMap: false,
        // }),
        // 从文件中分离 css 部分
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash:20].css'),
        }),
        // 压缩提取出来的 css 文本，这里将会把不同组件中重复的 css 合并
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true,
            },
        }),
        // 输出 index.html 文件，你也可以通过编辑 index.html 自定义输出，具体请参考下面的链接
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: process.env.NODE_ENV === 'testing'
                ? 'index.html'
                : config.index,
            data: { version },
            template: './src/index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                // 更多选项请参考下面的链接:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            chunksSortMode: 'dependency',
            // 排除部分包
            excludeChunks: [],
        }),
        // 指定 common 文件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/common.[chunkhash].js',

            minChunks(module) {
                const source = module.resource;
                const commons = ['../node_modules', '../src/lib', '../src/plugin'];

                return (
                    source && /\.(js|tsx?)$/.test(source) &&
                    commons.some(
                        (dir) => source.indexOf(path.join(__dirname, dir)) === 0
                    )
                );
            },
        }),
        // 复制静态资源文件
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.assetsSubDirectory,
            ignore: ['.*'],
        }]),
    ],
});

if (config.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
