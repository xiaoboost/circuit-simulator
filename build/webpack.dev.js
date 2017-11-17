process.env.NODE_ENV = 'development';

const chalk = require('chalk'),
    path = require('path'),
    app = new (require('koa'))(),
    shell = require('shelljs'),
    config = require('./config'),
    webpack = require('webpack'),
    baseConfig = require('./webpack.base'),
    FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

baseConfig.plugins.push(
    new FriendlyErrorsPlugin()
);

// start info
console.log(chalk.yellow('> Start Compile:...'));
// delete all files
shell.rm('-rf', path.join(__dirname, '../dist/'));

// set the static server
app.use(require('koa-static')(config.output));
// turn on the server
app.listen(config.port);

// webpack compiler
const compiler = webpack(baseConfig);
// turn on the webpack
compiler.watch(
    {
        ignored: /node_modules/,
    },
    (err, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }

        const info = stats.toString({
            chunks: false,
            chunkModules: false,
            chunkOrigins: false,
            colors: true,
            modules: false,
            children: false,
        });

        // 清空屏幕
        console.log('\x1Bc');
        // 打印除图片和字体之外的所有文件
        console.log(
            info
                .split('\n')
                .filter((line) => !/\.(png|ttf|woff2?|eot|svg|ico|cur)/.test(line))
                .join('\n')
        );
        console.log('\n' + chalk.yellow(`The website is already set at http://localhost:${config.port}/.`));
    }
);
