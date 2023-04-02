import path from 'path';
import Webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { resolve, version, build } from './utils';

/** 是否是调试模式 */
const isDevelopment = process.env.NODE_ENV === 'development';
/** 构建输出的文件路径 */
const output = resolve('dist/');

const banner =
`Project: Circuit Simulator
Author: 2016 - ${new Date().getFullYear()} © XiaoBoost

Version: ${version}
Build: ${build}
filename: [name], chunkhash: [chunkhash]

Nice to meet you ~ o(*￣▽￣*)ブ
Released under the MIT License.`;

const tsLoaderConfig = {
  loader: 'ts-loader',
  options: {
    configFile: resolve('tsconfig.json'),
    compilerOptions: {
      module: 'ESNext',
      target: 'ES6',
    },
  },
};

const baseConfig: Webpack.Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: resolve('src/init/index.ts'),
  },
  output: {
    path: output,
    publicPath: '/',
    filename: isDevelopment ? 'js/[name].js' : 'js/[name].[chunkhash].js',
    chunkFilename: isDevelopment ? 'js/[name].js' : 'js/[name].[chunkhash].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json', '.css'],
    mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.css'],
    mainFields: ['source', 'browser', 'module', 'main'],
    alias: {
      src: resolve('src'),
      // '@xiao-ai/utils/web': utils.resolve('node_modules/@xiao-ai/utils/dist/esm/web/index.js'),
      // '@xiao-ai/utils/use': utils.resolve('node_modules/@xiao-ai/utils/dist/esm/use/index.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.worker\.tsx?$/,
        use: [
          'worker-loader',
          tsLoaderConfig,
        ],
      },
      {
        test: /\.tsx?$/,
        ...tsLoaderConfig,
      },
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
          from: resolve('src/assets/favicon.ico'),
          to: path.join(output, 'images/favicon.ico')
        },
      ],
    }),
    // 打包后的文件插入 html 模板
    new HtmlWebpackPlugin({
      filename: 'index.html',
      data: {
        version: version,
        build: build,
        year: new Date().getFullYear(),
      },
      template: resolve('src/index.html'),
      inject: true,
      minify: {
        removeComments: !isDevelopment,
        collapseWhitespace: !isDevelopment,
        ignoreCustomComments: [/^-/],
      },
    }),
    new ProgressBarPlugin({
      width: 50,
      format: '> building: [:bar] :percent (:elapsed seconds)',
    }),
  ],
  stats: 'normal',
};

export default baseConfig;
