require('./check-versions')();

process.env.NODE_ENV = 'production';

const chalk = require('chalk'),
    shell = require('shelljs'),
    webpack = require('webpack'),
    config = require('./config'),
    baseConfig = require('./webpack.base'),
    OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

// TODO: 使用 uglify-es 压缩 js 代码
baseConfig.plugins.push(
    new OptimizeCSSPlugin({
        cssProcessorOptions: {
            safe: true,
        },
    })
);

if (config.bundleAnalyzer) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    baseConfig.plugins.push(new BundleAnalyzerPlugin());
}

console.log(chalk.yellow('> Start Compile:...'));
shell.rm('-rf', config.output);

webpack(baseConfig, (err, stats) => {
    if (err) {
        throw err;
    }

    console.log('\x1Bc');
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
    }) + '\n\n');

    console.log(chalk.cyan('  Build complete.\n'));
});
