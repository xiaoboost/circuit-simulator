import chai from 'chai';
import '@/libraries/init';

/**
 * 比较两个数组是否相等
 * 数组元素必须是严格相等，即 ===；允许嵌套数组
 * @param {Array} actual
 * @param {Array} expected
 * @returns {Boolean}
 */
function compare(actual, expected) {
    if (!expected || !actual) {
        return (false);
    }
    if (actual.length !== expected.length) {
        return (false);
    }

    return actual.every((item, i) => (item instanceof Array)
        ? compare(item, expected[i])
        : item === expected[i]
    );
}

/**
 * 比较数组是否相等
 * 与上面那个的不同点在于，这里这个不在乎顺序，重复元素将会被当作只有一个
 * @param {Array} actual
 * @param {Array} expected
 * @returns {Boolean}
 */
function compareSet(actual, expected) {
    if (!expected || !actual) {
        return (false);
    }
    if (actual.length !== expected.length) {
        return (false);
    }

    return actual.every((item_a) => (item_a instanceof Array)
        ? expected.some((item_e) => compare(item_a, item_e))
        : expected.some((item_e) => item_a === item_e)
    );
}

/**
 * 约等于
 * a, b 中下标为 0 和 1 的两个数字，在10位有效数字内相等是否都相等
 * @param {Point|Array} a
 * @param {Point|Array} b
 * @return {Boolean}
 */
function approximate(actual, expected) {
    const i = 10;
    return actual[0].toRound(i) === expected[0].toRound(i) &&
        actual[1].toRound(i) === expected[1].toRound(i);
}

chai.use((chai) => {
    chai.Assertion.addMethod('equalTo', function(values) {
        this.assert(
            compare(this._obj, values),
            `expected ${JSON.stringify(this._obj)} to be equal to [${values}]`,
            `expected ${JSON.stringify(this._obj)} not to be equal to [${values}]`
        );
    });
    chai.Assertion.addMethod('equalWithoutOrder', function(values) {
        this.assert(
            compareSet(this._obj, values),
            `expected ${JSON.stringify(this._obj)} to be equal to ${JSON.stringify(values)}`,
            `expected ${JSON.stringify(this._obj)} not to be equal to ${JSON.stringify(values)}`
        );
    });
    chai.Assertion.addMethod('approximate', function(values) {
        this.assert(
            approximate(this._obj, values),
            `expected [${this._obj.join(', ')}] to be about equal to to [${values}]`,
            `expected [${this._obj.join(', ')}] not to be about equal to [${values}]`
        );
    });
});

exports.expect = chai.expect;
