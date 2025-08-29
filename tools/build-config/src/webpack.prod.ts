import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { BuildConfig } from './types';
import { buildBaseConfig } from './webpack.base';

export function buildProdConfig(config: BuildConfig) {
  const baseConfig = buildBaseConfig(config);

  if (!baseConfig.optimization) {
    baseConfig.optimization = {
      minimize: true,
    };
  }

  if (!baseConfig.optimization.minimizer) {
    baseConfig.optimization.minimizer = [];
  }

  if (config.analyze) {
    baseConfig.plugins!.push(new BundleAnalyzerPlugin());
  }

  baseConfig.optimization.minimizer = baseConfig.optimization.minimizer.concat([
    new CssMinimizerPlugin(),
    new TerserPlugin({
      extractComments: false,
      terserOptions: {
        ecma: 2015,
        module: false,
        format: undefined,
        nameCache: undefined,
        ie8: false,
        safari10: false,
      },
    }),
  ]);

  baseConfig.performance = {
    hints: false,
    // 以下两个选项单位为 bytes
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
  };

  return baseConfig;
}
