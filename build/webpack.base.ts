import chalk from 'chalk';
import path from 'path';
import Webpack from 'webpack';
import typescript from 'typescript';
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
    extensions: ['.tsx', '.ts', '.js', '.json', '.styl', '.css'],
    mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.styl'],
    alias: {
      src: utils.resolve('src'),
      '@utils': utils.resolve('src/utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: utils.resolve('build/tsconfig.build.json'),
          compilerOptions: {
            target: isDevelopment ? 'esnext' : 'es5',
            module: 'ESNext',
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.styl(us)?$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentContext: utils.resolve('src'),
                exportLocalsConvention: 'camelCaseOnly',
                localIdentName: isDevelopment ? '[local]__[hash:base64:5]' : '[hash:base64:6]',
              },
            },
          },
          {
            loader: 'stylus-loader',
            options: {
              stylusOptions: {
                paths: [
                  utils.resolve('node_modules'),
                  utils.resolve('src/styles'),
                ],
              },
            },
          },
        ],
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
        },
        {
          from: utils.resolve('src/examples/*.ts'),
          to({ absoluteFilename }) {
            const fileName = path.parse(absoluteFilename).base;
            return path.join(config.output, 'examples', `${fileName}.json`);
          },
          transform(content) {
            const code = typescript.transpile(content.toString(), {
              target: typescript.ScriptTarget.ES5,
              module: typescript.ModuleKind.CommonJS,
            });
            return JSON.stringify(utils.runScript(code).data);
          },
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
