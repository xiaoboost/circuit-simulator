const path = require('path'),
    chalk = require('chalk'),
    webpack = require('webpack'),
    utils = require('./utils'),
    config = require('./config'),
    buildTag = utils.createBuildTag(),
    isDevelopment = process.env.NODE_ENV === 'development',
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ProgressBarPlugin = require('progress-bar-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

const banner =
`Project: Circuit Simulator
Author: 2015 - ${new Date().getFullYear()} © XiaoBoost

Build: ${buildTag}
filename: [name], chunkhash: [chunkhash]

Nice to meet you ~ o(*￣▽￣*)ブ
Released under the MIT License.`;

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry: {
        // 主业务逻辑文件
        main: resolve('./src/main.ts'),
    },
    output: {
        // 编译输出的静态资源根路径
        path: config.output,
        // 公共资源路径
        publicPath: config.publicPath,
        // 编译输出的文件名
        filename: isDevelopment
            ? 'js/[name].js'
            : 'js/[name].[chunkhash].js',
        // chunk 资源的命名
        chunkFilename: isDevelopment
            ? 'js/[name].js'
            : 'js/[name].[chunkhash].js',
    },
    resolve: {
        // 自动补全的扩展名
        extensions: ['.ts', '.js', '.vue', '.json', '.styl'],
        // 目录下的默认主文件
        mainFiles: ['index.ts', 'index.js'],
        // 默认路径别名
        alias: {
            'src': resolve('src'),
            'vue$': isDevelopment
                ? 'vue/dist/vue.esm.js'
                : 'vue/dist/vue.runtime.esm.js',
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'tslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    typeCheck: true,
                    emitErrors: true,
                    configFile: 'tslint.json',
                    tsConfigFile: 'tsconfig.json',
                    formattersDirectory: 'node_modules/tslint-loader/formatters/',
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        stylus: utils.createLoader('stylus'),
                        styl: utils.createLoader('stylus'),
                    },
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['ie > 8', 'last 2 versions', 'Chrome > 24'],
                        }),
                    ],
                },
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: false,
                    appendTsSuffixTo: [/\.vue$/],
                },
            },
            {
                test: /\.styl(us)?$/,
                use: utils.createLoader('stylus'),
            },
        ],
    },
    plugins: [
        // 添加文件抬头信息
        new webpack.BannerPlugin({
            banner,
            entryOnly: false,
        }),
        // 定义全局注入变量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': isDevelopment ? '"development"' : '"production"',
            '$ENV.NODE_ENV': isDevelopment ? '"development"' : '"production"',
        }),
        // 保持模块的 hash id 不变
        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 6,
        }),
        // 启用模块的作用域提升
        new webpack.optimize.ModuleConcatenationPlugin(),
        // 指定 common 包的内容
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: isDevelopment
                ? 'js/common.js'
                : 'js/common.[chunkhash].js',

            minChunks(module) {
                const source = module.resource;
                const files = ['node_modules'].map((file) => resolve(file));

                return (
                    source && /\.(js|tsx?)$/.test(source) &&
                    files.some((file) => source.indexOf(file) === 0)
                );
            },
        }),
        // 提取出来的所有 css 文件整合
        new ExtractTextPlugin({
            disable: false,
            allChunks: true,
            filename: isDevelopment
                ? 'css/main.css'
                : 'css/main.[contenthash:20].css',
        }),
        // 复制文件
        new CopyWebpackPlugin([{
            ignore: ['.*'],
            from: config.assert,
            to: isDevelopment
                ? config.publicPath
                : config.output,
        }]),
        // 打包后的文件插入 html 模板
        new HtmlWebpackPlugin({
            filename: 'index.html',
            data: {
                build: buildTag,
                year: new Date().getFullYear(),
            },
            template: './src/index.html',
            inject: true,
            minify: {
                removeComments: !isDevelopment,
                collapseWhitespace: !isDevelopment,
                ignoreCustomComments: [/^-/],
                // 更多选项请参考下面的链接:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            chunksSortMode: 'dependency',
            excludeChunks: [],
        }),
        // 进度条插件
        new ProgressBarPlugin({
            width: 40,
            format: `${chalk.green('> building:')} [:bar] ${chalk.green(':percent')} (:elapsed seconds)`,
        }),
    ],
};
