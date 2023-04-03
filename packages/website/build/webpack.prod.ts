import baseConfig from './webpack.base';
import TerserPlugin from 'terser-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

if (!baseConfig.optimization) {
  baseConfig.optimization = {
    minimize: true,
  };
}

if (!baseConfig.optimization.minimizer) {
  baseConfig.optimization.minimizer = [];
}

if (process.env.ANALYZE === 'true') {
  baseConfig.plugins!.push(new BundleAnalyzerPlugin());
}

baseConfig.plugins!.push(
  new ProgressBarPlugin({
    width: 50,
    format: '> building: [:bar] :percent (:elapsed seconds)',
  }),
)

baseConfig.optimization.minimizer = baseConfig.optimization.minimizer.concat([
  new CssMinimizerPlugin(),
  new TerserPlugin({
    extractComments: false,
    terserOptions: {
      ecma: 'es6',
      module: false,
      format: null,
      nameCache: null,
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

export default baseConfig;
