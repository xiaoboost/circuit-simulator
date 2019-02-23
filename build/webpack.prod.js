process.env.NODE_ENV = 'production';

const { rm } = require('shelljs');
const { cyan } = require('chalk');

const webpack = require('webpack');
const config = require('./config');
const baseConfig = require('./webpack.base');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

if (!baseConfig.optimization) {
    baseConfig.optimization = {};
}

if (!baseConfig.optimization.minimizer) {
    baseConfig.optimization.minimizer = [];
}

baseConfig.plugins.push(
    new OptimizeCSSPlugin()
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
    })
);

baseConfig.performance = {
    hints: false,
    // 以下两个选项单位为 bytes
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
};

if (config.bundleAnalyzer) {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    baseConfig.plugins.push(new BundleAnalyzerPlugin());
}

rm('-rf', config.output);

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

    console.log(cyan('\n  Build complete.\n'));
});
