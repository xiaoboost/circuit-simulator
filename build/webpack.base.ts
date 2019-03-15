import { resolve, buildTag } from './utils';

import chalk from 'chalk';
import Webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import example from './ts-json';
import * as config from './config';

const isDevelopment = process.env.NODE_ENV === 'development';

const banner =
`Project: Circuit Simulator
Author: 2016 - ${new Date().getFullYear()} © XiaoBoost

Build: ${buildTag()}
filename: [name], chunkhash: [chunkhash]

Nice to meet you ~ o(*￣▽￣*)ブ
Released under the MIT License.`;

// 清空屏幕
console.log('\x1Bc');
console.log(chalk.yellow('> Start Compile:\n'));

// 编译 example
example();

type WebpackConfig = GetArrayItem<Parameters<typeof Webpack>[0]>;

const baseConfig: WebpackConfig = {
    mode: process.env.NODE_ENV as WebpackConfig['mode'],
    entry: {
        main: resolve('src/main.ts'),
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
        extensions: ['.vue', '.ts', '.js', '.json', '.styl', '.css'],
        // 目录下的默认主文件
        mainFiles: ['index.vue', 'index.ts', 'index.js'],
        // 默认路径别名
        alias: {
            src: resolve('src'),
            vue$: isDevelopment
                ? 'vue/dist/vue.esm.js'
                : 'vue/dist/vue.runtime.esm.js',
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    /**
                     * a relative path to the configuration file.
                     * It will be resolved relative to the respective `.ts` entry file.
                     */
                    configFile: '../tsconfig.build.json',
                },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'stylus-loader',
                ],
            },
            {
                test: resolve('node_modules/@ant-design/icons/lib/dist.js'),
                loader: resolve('build/ant-icons-loader.ts'),
            },
        ],
    },
    optimization: {
        splitChunks: {
            name: true,
            cacheGroups: {
                commons: {
                    /**
                     * node_modules 中的 js 或 ts 文件会被提出作为单独的 chunk
                     * 其余文件将会仍然和 main 入口文件在同一个 chunk
                     */
                    test: /[\\/]node_modules[\\/][\d\D]+?\.(t|j)s/,
                    name: 'common',
                    chunks: 'initial',
                },
            },
        },
    },
    plugins: [
        // vue loader 配置
        new VueLoaderPlugin(),
        // 添加文件抬头信息
        new Webpack.BannerPlugin({
            banner,
            entryOnly: false,
        }),
        // 定义全局注入变量
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': isDevelopment ? '"development"' : '"production"',
        }),
        // 保持模块的 hash id 不变
        new Webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 6,
        }),
        // 启用模块的作用域提升
        new Webpack.optimize.ModuleConcatenationPlugin(),
        // 提取出来的所有 css 文件整合
        new MiniCssExtractPlugin({
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
                build: buildTag(),
                year: new Date().getFullYear(),
            },
            template: resolve('src/index.html'),
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
        new ProgressBarPlugin({
            width: 40,
            format: `${chalk.green('> building:')} [:bar] ${chalk.green(':percent')} (:elapsed seconds)`,
        }),
    ],
};

export default baseConfig;
