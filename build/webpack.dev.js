const host = 'localhost';
const port = 8080;
const app = new (require('koa'))();

const { rm } = require('shelljs');
const { output } = require('./config');
const { ramMiddleware } = require('./utils');

const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const baseConfig = require('./webpack.base');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

// 删除输出文件夹
rm('-rf', output);

// 每个模块用 eval() 执行, SourceMap 作为 DataUrl 添加到文件末尾
baseConfig.devtool = 'eval-source-map';
// 调试用的插件
baseConfig.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
            messages: [`Your application is already set at http://${host}:${port}/.\n`],
        },
    })
);

const compiler = webpack(baseConfig);

let fs;
if (process.env.SERVER_TYPE === 'memory') {
    compiler.outputFileSystem = fs = new MemoryFS();
}
else {
    fs = require('fs');
}

compiler.watch(
    { ignored: /node_modules/ },
    (err) => (
        (err && console.error(err.stack || err)) ||
        (err && err.details && console.error(err.details))
    )
);

app
    .use(ramMiddleware(fs, output))
    .listen(port);
