// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path');

module.exports = {
    // 生产环境
    build: {
        // 默认编译环境
        env: require('./prod.env'),
        // 编译文件出口
        index: path.resolve(__dirname, '../dist/index.html'),
        // 静态资源路径
        assetsRoot: path.resolve(__dirname, '../dist'),
        // 编译输出的二级目录
        assetsSubDirectory: '',
        // 编译发布的根目录，可配置为资源服务器域名或 CDN 域名
        assetsPublicPath: '/',
        // 是否开启 cssSourceMap
        productionSourceMap: false,
        // 是否开启Gzip，默认不开启，因为现在流行的静态主机已经自动部署Gzip了
        // 如果你确定要开启，在设置为 true 之前请你运行下列代码：
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        // 需要使用Gzip压缩的文件后缀
        productionGzipExtensions: ['js', 'css'],
        // 运行带有额外参数的 build命令以在构建完成后查看 bundle分析器报告：
        // npm run build --report
        // 直接设置为 true 或 false 可以直接打开或者关闭它
        bundleAnalyzerReport: process.env.npm_config_report
    },
    // 开发环境
    dev: {
        env: require('./dev.env'),
        // 开发版本监控端口
        port: 8080,
        autoOpenBrowser: true,
        assetsSubDirectory: '',
        assetsPublicPath: '/',
        proxyTable: {},
        // CSS SourceMaps默认关闭，因为它使用相对路径似乎有bug，参考 CSS-Loader的 README：
        // https://github.com/webpack/css-loader#sourcemaps
        // 根据我们的经验，通常情况下一般是没问题的，启用此选项时请注意此问题。
        cssSourceMap: false
    }
};
