import * as fs from 'fs-extra';
import * as config from './config';

import chalk from 'chalk';
import webpack from 'webpack';
import baseConfig from './webpack.base';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { ESBuildMinifyPlugin } from 'esbuild-loader';

if (!baseConfig.optimization) {
  baseConfig.optimization = {
    minimize: true,
  };
}

if (!baseConfig.optimization.minimizer) {
  baseConfig.optimization.minimizer = [];
}

baseConfig.optimization.minimizer = baseConfig.optimization.minimizer.concat([
  new ESBuildMinifyPlugin({
    target: 'es2015',
    css: true,
  }),
]);

baseConfig.performance = {
  hints: false,
  // 以下两个选项单位为 bytes
  maxAssetSize: 512000,
  maxEntrypointSize: 512000,
};

if (config.bundleAnalyzer) {
  baseConfig.plugins!.push(new (BundleAnalyzerPlugin as any)());
}

// 删除输出文件夹
if (fs.pathExistsSync(config.output)) {
  fs.removeSync(config.output);
}

webpack(baseConfig, (err, stats) => {
  console.log('\x1Bc');

  if (err) {
    throw err;
  }

  if (stats) {
    console.log(stats.toString({
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      colors: true,
      modules: false,
      children: false,
    }));
  
    console.log(chalk.cyan('\n  Build complete.\n'));
  }
});
