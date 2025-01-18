import path from 'path';
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
// eslint-disable-next-line
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import Webpack from 'webpack';

import { startLoading } from '../src/styles/constant';
import { resolve, version, build } from './utils';

const isDevelopment = process.env.NODE_ENV === 'development';
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
      module: 'NodeNext',
      target: 'ES6',
    },
  },
};

const baseConfig: Webpack.Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  target: 'web',
  stats: 'normal',
  entry: resolve('src/init/index.ts'),
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
        exclude: /\.vanilla\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.vanilla\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve('css-loader'),
            options: {
              url: false,
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
    new Webpack.BannerPlugin({
      banner,
      entryOnly: false,
    }),
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': isDevelopment ? '"development"' : '"production"',
    }),
    new VanillaExtractPlugin(),
    new MiniCssExtractPlugin({
      filename: isDevelopment
        ? 'styles/[name].css'
        : 'styles/[name].[contenthash:20].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve('src/assets/favicon.ico'),
          to: path.join(output, 'images/favicon.ico'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      data: {
        build: build,
        version: version,
        year: new Date().getFullYear(),
      },
      styles: {
        loadingId: startLoading,
      },
      template: resolve('src/index.html'),
      inject: true,
      minify: {
        removeComments: !isDevelopment,
        collapseWhitespace: !isDevelopment,
        ignoreCustomComments: [/^-/],
      },
    }),
  ],
};

export default baseConfig;
