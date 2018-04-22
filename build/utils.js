const path = require('path');

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
            }
            else if (!(ans instanceof Object)) {
                ans[key] = value;
            }
            else {
                const subObject = expand(value);
                Object
                    .entries(subObject)
                    .forEach(([subKey, subValue]) => (ans[`${key}.${subKey}`] = subValue));
            }

            return ans;
        }, {});
};

/**
 * 定位到项目根目录
 * @param {string} dir 路径
 */
exports.resolve = function(dir) {
    return path.join(__dirname, '..', dir);
};
