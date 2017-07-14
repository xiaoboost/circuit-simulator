// 检查当前运行环境
require('./check-versions')();
// 读取当前配置文件
const config = require('../config');
// 如果当前系统环境设置为空，那么使用config中的环境设置
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

const // opn插件可以强制打开浏览器并跳转到指定url
    opn = require('opn'),
    path = require('path'),
    express = require('express'),
    webpack = require('webpack'),
    // http代理中间件
    proxyMiddleware = require('http-proxy-middleware'),
    // 读取dev版本配置
    webpackConfig = process.env.NODE_ENV === 'testing'
        ? require('./webpack.prod.conf')
        : require('./webpack.dev.conf'),
    // 调试时运行的端口
    port = process.env.PORT || config.dev.port,
    // 是否自动打开浏览器，如果没有设置那么此项将会为false
    autoOpenBrowser = !!config.dev.autoOpenBrowser,
    // 读取http代理的配置
    // 配置详情请看：https://github.com/chimurai/http-proxy-middleware
    proxyTable = config.dev.proxyTable,
    // 生成服务器
    app = express(),
    // webpack加载编译配置并生成编译器
    compiler = webpack(webpackConfig),
    // 启动webpack编译器，并将编译好的文件保存到内存中
    devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        quiet: true,
    }),
    // 设定热更新中间件
    hotMiddleware = require('webpack-hot-middleware')(compiler, { log: () => {} });

// 监控文件，当它们有变化时热更新至网站
compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        hotMiddleware.publish({ action: 'reload' });
        cb();
    });
});

// 将proxyTable中的请求配置挂在到启动的express服务上
Object.keys(proxyTable).forEach((context) => {
    let options = proxyTable[context];
    if (typeof options === 'string') {
        options = { target: options };
    }
    app.use(proxyMiddleware(options.filter || context, options));
});

// 当使用 history-api 进行跳转的时候，使用下面的中间件来匹配资源，如果不匹配就重定向到指定地址
app.use(require('connect-history-api-fallback')());
// 将内存中编译好的文件挂载到express服务器上
app.use(devMiddleware);
// 将热更新的资源也挂载到express的服务器上
app.use(hotMiddleware);
// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

console.log('> Starting dev server...');
// 设定虚拟网站地址
const uri = 'http://localhost:' + port;
// 定义 ready 事件，等待服务运行
const readyPromise = new Promise((resolve) => {
    devMiddleware.waitUntilValid(() => {
        console.log('> Listening at ' + uri + '\n');
        // 如果不是测试环境，强制打开浏览器并跳转到开发地址
        if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
            opn(uri);
        }
        // 服务启动完毕，触发 ready事件
        resolve();
    });
});

// 监听端口，启动服务
const server = app.listen(port);
// 对外暴露 ready的异步对象
module.exports = {
    ready: readyPromise,
    close: () => server.close(),
};
