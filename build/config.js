const path = require('path');

module.exports = {
    // 静态资源
    assert: path.join(__dirname, '../src/assets/'),
    // 构建输出的文件路径
    output: path.join(__dirname, '../dist/'),
    // 构建时是否显示模块组成分析
    bundleAnalyzer: true,
    // 调试时的公共路径
    publicPath: '',
};
