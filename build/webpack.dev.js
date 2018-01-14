process.env.NODE_ENV = 'development';

const host = 'localhost',
    port = 8080,
    chalk = require('chalk'),
    app = new (require('koa'))(),
    shell = require('shelljs'),
    config = require('./config'),
    webpack = require('webpack'),
    baseConfig = require('./webpack.base'),
    WebpackDevServer = require('webpack-dev-server'),
    FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

// 清空屏幕
console.log('\x1Bc');
console.log(chalk.yellow('> Start Compile:\n'));

// webpack 服务器模式
if (config.devMode === 'webpackServer') {
    // 每个模块用 eval() 执行, SourceMap 作为 DataUrl 添加到文件末尾
    baseConfig.devtool = 'eval-source-map';
    // 调试用的插件
    baseConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is already set at http://${host}:${port}/.\n`],
            },
        })
    );

    // 初始化编译器
    const compiler = webpack(baseConfig);
    const server = new WebpackDevServer(compiler, {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        hot: true,
        inline: true,
        compress: true,
        host, port,
        open: false,
        overlay: {
            warnings: false,
            errors: true,
        },
        publicPath: '/',
        quiet: true,
        watchOptions: {
            poll: false,
        },
    });

    server.listen(port, host);
}
// koa 服务器模式
else if (config.devMode === 'koaServer') {
    // 调试用的插件
    baseConfig.plugins.push(
        new FriendlyErrorsPlugin()
    );

    // 设置静态服务器
    app.use(require('koa-static')(config.output));
    app.listen(port);
    shell.rm('-rf', config.output);

    // 初始化编译器
    const compiler = webpack(baseConfig);
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
            console.log('\n' + chalk.yellow(`Your application is already set at http://localhost:${port}/.`));
        }
    );
}
