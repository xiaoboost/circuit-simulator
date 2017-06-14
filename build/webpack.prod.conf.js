const path = require('path'),
    utils = require('./utils'),
    webpack = require('webpack'),
    config = require('../config'),
    merge = require('webpack-merge'),
    // 基础配置
    baseWebpackConfig = require('./webpack.base.conf'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    // webpack插件，用于生成html文件
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    // webpack插件，从文件中分离代码
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    // webpack插件，优化、最小化css文件
    OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'),
    // 当前环境
    env = process.env.NODE_ENV === 'testing'
        ? require('../config/test.env')
        : config.build.env;

// 将基础配置和当前配置合并
const webpackConfig = merge(baseWebpackConfig, {
    module: {
        // css的 loader
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    // 是否使用 #source-map
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        // 编译输出路径
        path: config.build.assetsRoot,
        // 编译输出文件名
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        // 没有指定输出文件名的输出文件名
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        // js压缩插件
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: false
        }),
        // 从文件中分离css部分
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),
        // 压缩提取出来的css文本，这里将会把不同组件中重复的css合并
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        // 输出 index.html文件，你也可以通过编辑 index.html自定义输出，具体请参考下面的链接
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: process.env.NODE_ENV === 'testing'
                ? 'index.html'
                : config.build.index,
            template: './src/index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // 更多选项请参考下面的链接:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        // 没有指定输出文件名的文件输出的静态文件名
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks(module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                );
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.build.assetsSubDirectory,
            ignore: ['.*']
        }])
    ]
});

// 如果开启了 Gzip，那么启用下方的配置
if (config.build.productionGzip) {
    // 加载 compression-webpack-plugin 插件
    const CompressionWebpackPlugin = require('compression-webpack-plugin');
    // 向 webpackconfig.plugins 中加入下方的插件
    webpackConfig.plugins.push(
        // 启用插件对文件进行压缩
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    );
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
