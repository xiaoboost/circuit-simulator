import chai from 'chai';
import '@/libraries/init';

/**
 * 比较两个数组是否相等
 * 数组元素必须是严格相等，即 ===
 * @param {Array} actual
 * @param {Array} expected
 * @returns {Boolean}
 */
function compare(actual, expected) {
    return actual.every((value, index) => value === expected[index]);
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
            `expected [${this._obj.join(', ')}] to be equal to [${values}]`,
            `expected [${this._obj.join(', ')}] not to be equal to [${values}]`
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
