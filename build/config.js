const { resolve } = require('./utils');

/** 静态资源 */
exports.assert = resolve('src/assets/');
/** 构建输出的文件路径 */
exports.output = resolve('dist/');
/** 例子数据所在文件夹 */
exports.example = 'examples';
/** 构建时是否显示模块组成分析 */
exports.bundleAnalyzer = true;
/** 调试时的公共路径 */
exports.publicPath = '';
