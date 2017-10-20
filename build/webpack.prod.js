require('./check-versions')();

process.env.NODE_ENV = 'production';

const chalk = require('chalk'),
    shell = require('shelljs'),
    webpack = require('webpack'),
    config = require('./config'),
    baseConfig = require('./webpack.base'),
    spinner = require('ora')('building for production...'),
    OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

baseConfig.plugins.push(
    new OptimizeCSSPlugin({
        cssProcessorOptions: {
            safe: true,
        },
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
    })
);

spinner.start();
shell.rm('-rf', config.output);

webpack(baseConfig, (err, stats) => {
    spinner.stop();
    if (err) {
        throw err;
    }

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
    }) + '\n\n');

    console.log(chalk.cyan('  Build complete.\n'));
});
