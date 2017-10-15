// 这里是在webpack中的 vue-loader 的具体配置
// 默认只有两项，sourceMap 和 postcss 的配置

const utils = require('./utils'),
    isProduction = process.env.NODE_ENV === 'production',
    config = (process.env.NODE_ENV === 'production')
        ? require('../config/prod')
        : require('../config/dev');

module.exports = {
    loaders: utils.cssLoaders({
        sourceMap: isProduction
            ? config.productionSourceMap
            : config.cssSourceMap,
        extract: isProduction,
    }),
    postcss: [
        require('autoprefixer')({
            browsers: ['ie > 8', 'last 2 versions', 'Chrome > 24'],
        }),
    ],
};
