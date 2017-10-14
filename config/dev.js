const { merge, data } = require('./common');

module.exports = merge(data, {
    // 环境参数
    $ENV: {
        NODE_ENV: 'development',
    },
    // 开发版本监控端口
    port: 8080,
    // 自动打开浏览器
    autoOpenBrowser: true,
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS SourceMaps 默认关闭，因为它使用相对路径似乎有bug，参考 CSS-Loader 的 README：
    // https://github.com/webpack/css-loader#sourcemaps
    // 根据我们的经验，通常情况下一般是没问题的，启用此选项时请注意此问题。
    cssSourceMap: false,
});
