const path = require('path');

module.exports = {
    /**
     * 调试服务器设置
     *  - webpackServer 使用 webpack-dev-server，有热更新功能，但无法直接操作生成的源文件
     *  - koaServer 使用 koa 手动搭建的静态服务器，没有热更新功能，但是生成的文件会直接放在硬盘中，可以直接对其进行操作
     */
    devMode: 'webpackServer',
    // 静态资源
    assert: path.join(__dirname, '../src/assets/'),
    // 构建输出的文件路径
    output: path.join(__dirname, '../dist/'),
    // 构建时是否显示模块组成分析
    bundleAnalyzer: true,
    // 调试时的公共路径
    publicPath: '',
};
