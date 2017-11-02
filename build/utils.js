const ExtractTextPlugin = require('extract-text-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

/**
 * create css-loader
 *
 * @param {string} loader
 * @param {object} loaderOptions
 * @returns {object}
 */
exports.createLoader = function(loader, loaderOptions) {
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
                { sourceMap: false },
                loaderOptions
            ),
        });
    }

    return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
    });
};

/**
 * Generate tag of build
 *
 * @returns {string}
 */
exports.createBuildTag = function() {
    const now = new Date(),
        year = now.getFullYear(),
        month = String(now.getMonth() + 1).padStart(2, '0'),
        date = String(now.getDate()).padStart(2, '0'),
        time = now.toTimeString().slice(0, 8);

    return `${year}.${month}.${date} - ${time}`;
};

/**
 * Translate a normal object to a object that used in DefinePlugin
 *
 * @param {object}
 * @returns {object}
 */
exports.dataForDefinePlugin = function expand(obj) {
    return Object
        .entries(obj)
        .reduce((ans, [key, value]) => {
            if (
                ((typeof value !== 'string' && !(value instanceof Object))) ||
                ((typeof value === 'string') && !/^"[\d\D]+"$/.test(value))
            ) {
                ans[key] = JSON.stringify(value);
            } else if (!(ans instanceof Object)) {
                ans[key] = value;
            } else {
                const subObject = expand(value);
                Object
                    .entries(subObject)
                    .forEach(([subKey, subValue]) => (ans[`${key}.${subKey}`] = subValue));
            }

            return ans;
        }, {});
};
