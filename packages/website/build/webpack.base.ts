import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';
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

Nice to meet you ~ o(*￣▽￣*)ブ
Released under the MIT License.`;

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
    assetModuleFilename: 'assets/[name].[hash:20][ext]',
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
        test: /\.tsx?$/,
        loader: 'swc-loader',
        options: {
          jsc: {
            target: 'es2015',
            parser: {
              syntax: 'typescript',
              decorators: true,
              tsx: true,
            },
          },
        },
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
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
        ],
      },
      {
        test: /\.(ico|svg)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          esModule: false,
          minimize: false,
          sources: {
            list: [
              { tag: 'img', attribute: 'src', type: 'src' },
              { tag: 'link', attribute: 'href', type: 'src' },
            ],
          },
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
    new HtmlWebpackPlugin({
      filename: 'index.html',
      templateParameters: {
        banner,
        loadingId: startLoading,
      },
      template: resolve('src/index.ejs'),
      inject: true,
      minify: false,
    }),
    new TsCheckerRspackPlugin({
      typescript: {
        configFile: resolve('tsconfig.json'),
      },
      devServer: true,
    }),
  ],
};

export default baseConfig;
