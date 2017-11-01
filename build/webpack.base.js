const path = require('path'),
    webpack = require('webpack'),
    utils = require('./utils'),
    config = require('./config'),
    version = utils.createVersionTag(),
    isDevelopment = process.env.NODE_ENV === 'development',
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

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
        // 编译输出的文件名
        filename: isDevelopment
            ? 'js/[name].js'
            : 'js/[name].[chunkhash].js',
    },
    resolve: {
        // 自动补全的扩展名
        extensions: ['.js', '.ts', '.vue', '.json', '.styl'],
        // 目录下的默认主文件
        mainFiles: ['index.vue', 'index.js', 'index.ts'],
        // 默认路径别名
        alias: {
            'src': resolve('src'),
            'vue$': isDevelopment ? 'vue/dist/vue.js' : 'vue/dist/vue.esm.js',
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
        new webpack.BannerPlugin({
            banner: `Project: Circuit Simulator\nAuthor: 2015 - 2017 XiaoBoost\n\nBuild: ${version}\nfilename: [name], chunkhash: [chunkhash]\nReleased under the MIT License.`,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: isDevelopment
                ? 'js/common.js'
                : 'js/common.[chunkhash].js',

            minChunks(module) {
                const source = module.resource;
                const files = [
                    'node_modules',
                    'src/plugin',
                    'src/lib',
                    'src/vuex',
                ];
                return (
                    source && /\.(js|tsx?)$/.test(source) &&
                    files.some((file) => source.indexOf(resolve(file)) === 0)
                );
            },
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            '$ENV.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new ExtractTextPlugin({
            disable: false,
            allChunks: true,
            filename: isDevelopment
                ? 'css/main.css'
                : 'css/main.[contenthash:20].css',
        }),
        new CopyWebpackPlugin([{
            from: resolve('src/assets'),
            to: config.output,
            ignore: ['.*'],
        }]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            data: { version },
            template: './src/index.html',
            inject: true,
            minify: {
                removeComments: !isDevelopment,
                collapseWhitespace: !isDevelopment,
                // 更多选项请参考下面的链接:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            chunksSortMode: 'dependency',
            excludeChunks: [],
        }),
    ],
};
