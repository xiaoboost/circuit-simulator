const host = 'localhost';
const port = 8080;
const webpack = require('webpack');
const baseConfig = require('./webpack.base');
const WebpackDevServer = require('webpack-dev-server');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

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

// 服务器配置
// baseConfig.devServer = {
//     noInfo: true,
//     clientLogLevel: 'warning',
//     historyApiFallback: true,
//     host, port,
//     open: false,
//     overlay: {
//         warnings: false,
//         errors: true,
//     },
//     publicPath: '/',
//     quiet: true,
//     watchOptions: {
//         poll: false,
//     },
// };

// module.exports = baseConfig;

const compiler = webpack(baseConfig);
const server = new WebpackDevServer(compiler, {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    inline: true,
    compress: true,
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
