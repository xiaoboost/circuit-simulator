const common = require('./common');
const merge = require('./merge');
const path = require('path');

module.exports = merge({}, common, {
    // 默认编译环境参数
    $ENV: {
        NODE_ENV: 'production',
    },
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
    // 是否开启 Gzip，默认不开启
    productionGzip: false,
    // 需要使用 Gzip 压缩的文件后缀
    productionGzipExtensions: ['js', 'css'],
    // 运行带有额外参数的 build 命令以在构建完成后查看 bundle 分析器报告：
    // npm run build --report
    // 直接设置为 true 或 false 可以直接打开或者关闭它
    bundleAnalyzerReport: process.env.npm_config_report,
});
