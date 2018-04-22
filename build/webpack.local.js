process.env.NODE_ENV = 'development';

const host = 'localhost',
    port = 8080,
    chalk = require('chalk'),
    app = new (require('koa'))(),
    shell = require('shelljs'),
    config = require('./config'),
    webpack = require('webpack'),
    baseConfig = require('./webpack.base'),
    FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

// 每个模块用 eval() 执行, SourceMap 作为 DataUrl 添加到文件末尾
baseConfig.devtool = 'eval-source-map';
// 调试用的插件
baseConfig.plugins.push(
    new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
            messages: [`Your application is already set at http://${host}:${port}/.\n`],
        },
    })
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

        // 清空屏幕
        console.log('\x1Bc');
        // 编译信息
        console.log(stats.toString({
            chunks: false,
            chunkModules: false,
            chunkOrigins: false,
            colors: true,
            modules: false,
            children: false,
        }));

        // 网站信息
        console.log('\n' + chalk.yellow(`Your application is already set at http://localhost:${port}/.`));
    }
);
