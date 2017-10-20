const ExtractTextPlugin = require('extract-text-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

function generateLoaders(loader, loaderOptions) {
    const loaders = [{
        loader: 'css-loader',
        options: {
            minimize: isProduction,
            sourceMap: false,
        },
    }];

    if (loader) {
        loaders.push({
            loader: loader + '-loader',
            options: Object.assign(
                {}, loaderOptions,
                { sourceMap: false }
            ),
        });
    }

    return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
    });
}

module.exports = {
    loaders: {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', {
            indentedSyntax: true,
        }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus'),
    },
    postcss: [
        require('autoprefixer')({
            browsers: ['ie > 8', 'last 2 versions', 'Chrome > 24'],
        }),
    ],
};
