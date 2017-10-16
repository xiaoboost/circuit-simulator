require('./check-versions')();

process.env.NODE_ENV = 'production';

const ora = require('ora'),
    rm = require('rimraf'),
    path = require('path'),
    chalk = require('chalk'),
    webpack = require('webpack'),
    config = require('../config/prod'),
    webpackConfig = require('./webpack.prod.conf'),
    spinner = ora('building for production...');

spinner.start();
rm(path.join(config.assetsRoot, config.assetsSubDirectory), (err) => {
    if (err) throw err;
    webpack(webpackConfig, function(err, stats) {
        spinner.stop();
        if (err) throw err;
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false,
        }) + '\n\n');

        console.log(chalk.cyan('  Build complete.\n'));
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ));
    });
});
