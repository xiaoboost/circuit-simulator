process.env.NODE_ENV = 'production';

import * as fs from 'fs-extra';
import * as config from './config';

import chalk from 'chalk';
import webpack from 'webpack';
import baseConfig from './webpack.base';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

if (!baseConfig.optimization) {
    baseConfig.optimization = {};
}

if (!baseConfig.optimization.minimizer) {
    baseConfig.optimization.minimizer = [];
}

baseConfig.plugins!.push(
    new OptimizeCSSPlugin(),
);

baseConfig.optimization.minimizer.push(
    new TerserPlugin({
        test: /\.js$/i,
        cache: false,
        terserOptions: {
            ecma: 7,
            ie8: false,
            safari10: false,
            output: {
                comments: /^!/,
            },
        },
    }),
);

baseConfig.performance = {
    hints: false,
    // 以下两个选项单位为 bytes
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
};

if (config.bundleAnalyzer) {
    baseConfig.plugins!.push(new BundleAnalyzerPlugin());
}

// 删除输出文件夹
if (fs.pathExistsSync(config.output)) {
    fs.removeSync(config.output);
}

webpack(baseConfig, (err, stats) => {
    if (err) {
        throw err;
    }

    console.log('\x1Bc');

    console.log(stats.toString({
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        colors: true,
        modules: false,
        children: false,
    }));

    console.log(chalk.cyan('\n  Build complete.\n'));
});
