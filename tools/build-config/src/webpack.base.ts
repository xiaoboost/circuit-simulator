import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import Webpack from 'webpack';

import { transformLess } from './less';
import { BuildConfig } from './types';
import { resolve, build } from './utils';

export function buildBaseConfig(config: BuildConfig) {
  const { mode, rootDir, entry, outputDir, version, template, tsConfig, meta } = config;
  const isDevelopment = mode === 'dev';
  const banner
    = `Project: Circuit Simulator
  Author: 2016 - ${new Date().getFullYear()} © XiaoBoost

  Version: ${version}
  Build: ${build}

  Nice to meet you ~ o(*￣▽￣*)ブ
  Released under the MIT License.`;

  const baseConfig: Webpack.Configuration = {
    mode: isDevelopment ? 'development' : 'production',
    target: 'web',
    stats: 'normal',
    entry: resolve(rootDir, entry),
    output: {
      path: resolve(rootDir, outputDir),
      publicPath: '/',
      filename: isDevelopment ? 'js/[name].js' : 'js/[name].[chunkhash].js',
      chunkFilename: isDevelopment ? 'js/[name].js' : 'js/[name].[chunkhash].js',
      assetModuleFilename: 'assets/[name].[hash:20][ext]',
    },
    resolve: {
      extensions: [
        '.tsx', '.ts', '.js', '.json', '.css',
      ],
      mainFiles: [
        'index.tsx', 'index.ts', 'index.js', 'index.css',
      ],
      mainFields: [
        'source', 'browser', 'module', 'main',
      ],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: require.resolve('swc-loader'),
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
          use: [
            MiniCssExtractPlugin.loader,
            require.resolve('css-loader'),
          ],
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                esModule: true,
                modules: {
                  namedExport: true,
                  exportLocalsConvention: 'camel-case',
                  localIdentName: isDevelopment
                    ? '[local]__[hash:base64:8]'
                    : 'styles__[hash:base64:8]',
                },
              },
            },
            {
              loader: require.resolve('less-loader'),
              options: {
                additionalData(code: string, context: Webpack.LoaderContext<any>) {
                  return transformLess(code, rootDir, context.resourcePath);
                },
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
      new MiniCssExtractPlugin({
        filename: isDevelopment
          ? 'styles/[name].css'
          : 'styles/[name].[contenthash:20].css',
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        templateParameters: {
          banner,
          loadingId: meta.startLoading,
        },
        template: resolve(rootDir, template),
        inject: true,
        minify: false,
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: resolve(rootDir, tsConfig),
        },
        devServer: true,
      }),
    ],
  };
  return baseConfig;
}
