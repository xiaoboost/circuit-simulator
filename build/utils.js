const path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    config = (process.env.NODE_ENV === 'production')
        ? require('../config/prod')
        : require('../config/dev');

exports.assetsPath = function(_path) {
    return path.posix.join(config.assetsSubDirectory, _path);
};

exports.cssLoaders = function(options) {
    options = options || {};

    const cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap,
        },
    };

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        const loaders = [cssLoader];
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap,
                }),
            });
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader',
            });
        } else {
            return ['vue-style-loader'].concat(loaders);
        }
    }

    // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', {
            indentedSyntax: true,
        }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus'),
    };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
    const output = [];
    const loaders = exports.cssLoaders(options);
    for (const extension in loaders) {
        const loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader,
        });
    }
    return output;
};

// Generate tag of version
exports.createVersionTag = function() {
    const now = new Date(),
        year = now.getFullYear(),
        month = String(now.getMonth() + 1).padStart(2, '0'),
        date = String(now.getDate()).padStart(2, '0'),
        time = now.toTimeString().slice(0, 8),
        version = Math.random().toString(36).substr(2, 12);

    return `${year}/${month}/${date} ${time} - ${version}`;
};
