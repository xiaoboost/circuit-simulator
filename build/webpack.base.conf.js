const fs = require('fs'),
    path = require('path'),
    utils = require('./utils'),
    config = require('../config'),
    vueLoaderConfig = require('./vue-loader.conf');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}
function readdir(dir) {
    const ans = [];

    fs.readdirSync(resolve(`src/${dir}`)).forEach((name) => {
        const nextPath = path.join(dir, name),
            filePath = resolve(`src/${nextPath}`),
            file = fs.statSync(filePath);

        if (file.isDirectory()) {
            ans.push(...readdir(nextPath));
        } else if (/\.(js|tsx?)$/.test(name) && name !== 'debugger.js') {
            ans.push(filePath);
        }
    });

    return (ans);
}

module.exports = {
    entry: {
        // 库集合文件
        common: [
            'vue',
            'vuex',
            ...readdir('plugin'),
            ...readdir('libraries'),
        ],
        // 主业务逻辑文件
        main: resolve('./src/main.js'),
    },
    output: {
        // 编译输出的静态资源根路径
        path: config.build.assetsRoot,
        // 编译输出的文件名
        filename: '[name].js',
        // 根据当前环境配置静态资源路径
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath,
    },
    resolve: {
        // 自动补全的扩展名
        extensions: ['.js', '.ts', '.vue', '.json', '.styl'],
        // 目录下的默认主文件
        mainFiles: ['index.js', 'index.ts', 'index.vue'],
        // 默认路径别名
        alias: {
            'src': resolve('src'),
            'vue$': 'vue/dist/vue.esm.js',
            'vuex$': 'vuex/dist/vuex.esm.js',
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    formatter: require('eslint-friendly-formatter'),
                },
            },
            {
                test: /\.tsx?$/,
                loader: 'tslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    typeCheck: true,
                    emitErrors: true,
                    configFile: 'tslint.json',
                    tsConfigFile: 'tsconfig.json',
                    formattersDirectory: 'node_modules/tslint-loader/formatters/',
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig,
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]'),
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
                },
            },
        ],
    },
};
