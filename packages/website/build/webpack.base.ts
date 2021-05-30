import chalk from 'chalk';
import path from 'path';
import Webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import * as utils from './utils';
import * as config from './config';

const isDevelopment = process.env.NODE_ENV === 'development';

const banner =
`Project: Circuit Simulator
Author: 2016 - ${new Date().getFullYear()} © XiaoBoost

Version: ${utils.version}
Build: ${utils.build}
filename: [name], chunkhash: [chunkhash]

Nice to meet you ~ o(*￣▽￣*)ブ
Released under the MIT License.`;

console.log('\x1Bc');

const baseConfig: Webpack.Configuration = {
  mode: process.env.NODE_ENV as Webpack.Configuration['mode'],
  entry: {
    main: utils.resolve('src/init/index.ts'),
  },
  output: {
    path: config.output,
    publicPath: config.publicPath,
    filename: isDevelopment ? 'js/[name].js' : 'js/[name].[chunkhash].js',
    chunkFilename: isDevelopment ? 'js/[name].js' : 'js/[name].[chunkhash].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json', '.css'],
    mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.css'],
    alias: {
      src: utils.resolve('src'),
      '@xiao-ai/utils/web': utils.resolve('node_modules/@xiao-ai/utils/dist/esm/web/index.js'),
      '@xiao-ai/utils/use': utils.resolve('node_modules/@xiao-ai/utils/dist/esm/use/index.js'),
    },
  },
  module: {
    rules: [
      (
        isDevelopment
          ? {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loader: 'ts-loader',
            options: {
              configFile: utils.resolve('tsconfig.json'),
              compilerOptions: {
                module: 'ESNext',
                target: 'ESNext',
              },
            },
          }
          : {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2015',
              tsconfigRaw: require(utils.resolve('tsconfig.json')),
            },
          }
      ),
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpg|webp|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    ],
  },
  optimization: {
    concatenateModules: true,
    moduleIds: 'deterministic',
    splitChunks: {
      maxInitialRequests: Infinity,
      minSize: 0,
      minChunks: 1,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/][\d\D]+?\.(t|j)s/,
          name: 'common',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    // 添加文件抬头信息
    new Webpack.BannerPlugin({
      banner,
      entryOnly: false,
    }),
    // 定义全局注入变量
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': isDevelopment ? '"development"' : '"production"',
    }),
    // 提取出来的所有 css 文件整合
    new MiniCssExtractPlugin({
      filename: isDevelopment
        ? 'styles/main.css'
        : 'styles/main.[contenthash:20].css',
    }),
    // 复制文件
    new CopyWebpackPlugin({
      patterns: [
        {
          from: utils.resolve('src/assets/favicon.ico'),
          to: path.join(config.output, 'images/favicon.ico')
        },
      ],
    }),
    // 打包后的文件插入 html 模板
    new HtmlWebpackPlugin({
      filename: 'index.html',
      data: {
        version: utils.version,
        build: utils.build,
        year: new Date().getFullYear(),
      },
      template: utils.resolve('src/index.html'),
      inject: true,
      minify: {
        removeComments: !isDevelopment,
        collapseWhitespace: !isDevelopment,
        ignoreCustomComments: [/^-/],
      },
    }),
    new ProgressBarPlugin({
      width: 40,
      format: `${chalk.green('> building:')} [:bar] ${chalk.green(':percent')} (:elapsed seconds)`,
    }),
  ],
};

export default baseConfig;
