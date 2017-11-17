process.env.NODE_ENV = 'production';

const chalk = require('chalk'),
    shell = require('shelljs'),
    webpack = require('webpack'),
    config = require('./config'),
    baseConfig = require('./webpack.base'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    ProgressBarPlugin = require('progress-bar-webpack-plugin'),
    OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

baseConfig.plugins.push(
    new ProgressBarPlugin({
        width: 40,
        format: `${chalk.green('> building:')} [:bar] ${chalk.green(':percent')} (:elapsed seconds)`,
    }),
    new OptimizeCSSPlugin({
        cssProcessorOptions: {
            safe: true,
        },
    }),
    new UglifyJSPlugin({
        test: /\.js$/i,
        cache: false,
        uglifyOptions: {
            ecma: 7,  // 2016
        },
    })
);

if (config.bundleAnalyzer) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    baseConfig.plugins.push(new BundleAnalyzerPlugin());
}

console.log('\x1Bc');
console.log(chalk.yellow('> Start Compile:\n'));
shell.rm('-rf', config.output);

webpack(baseConfig, (err, stats) => {
    if (err) {
        throw err;
    }

    console.log('\x1Bc');

    const log = stats.toString({
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        colors: true,
        modules: false,
        children: false,
    }).split('\n');

    const suffixs = [
        /cur\//,
        /img\//,
        /\.css/,
        /\.js/,
        /\.html/,
    ];

    const series = suffixs.map((match) => log.filter((msg) => match.test(msg)).join('\n')).join('\n\n');

    console.log(`${log.slice(0, 4).join('\n')}\n${series}\n`);
    console.log(chalk.cyan('  Build complete.\n'));
});
