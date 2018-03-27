/* tslint:disable:ban-types  */

import * as assert from './assertion';

/** 原生属性扩展 */
function nativeExpand(native: Function | Object, props: { [key: string]: any }) {
    Object.keys(props).forEach((key) => {
        const method = props[key];
        props[key] = {
            enumerable: false,
            value: method,
        };
    });

    Object.defineProperties(native, props);
}

nativeExpand(Object.prototype, {
    /** 比较对象是否相等 */
    isEqual(this: Object, obj: Object): boolean {
        if (!assert.isObject(obj)) {
            return (false);
        }
        if (!Object.keys(this).isEqual(Object.keys(obj))) {
            return (false);
        }

        return Object.entries(this).every(
            ([key, value]) =>
                (assert.isObject(value) && assert.isFunction(value.isEqual))
                    ? value.isEqual(obj[key])
                    : value === obj[key],
        );
    },
});

nativeExpand(Array.prototype, {
    /**
     * 当前数组与输入是否相等
     *
     * @param {any} to
     * @returns {boolean}
     */
    isEqual(this: any[], to: any): boolean {
        if (!assert.isArray(to)) {
            return (false);
        }
        if (this.length !== to.length) {
            return (false);
        }

        return this.every(
            (item, i) =>
                (assert.isObject(item) && assert.isFunction(item.isEqual))
                    ? item.isEqual(to[i])
                    : item === to[i],
        );
    },

    /**
     * 根据下标取出当前数组元素
     *
     * @template T
     * @param {T[]} this
     * @param {number} index
     * @returns {T}
     */
    get<T>(this: T[], index: number): T {
        const sub = (index >= 0) ? index : this.length + index;

        if (sub < 0 || sub >= this.length) {
            throw new Error('(array) index out of bounds.');
        }

        return this[sub];
    },

    /**
     * 删除满足条件的元素
     *  - predicate 为函数时，删除 predicate 返回 true 的元素
     *  - predicate 为非函数时，删除与 predicate 严格相等的元素
     *  - 当 whole 为 false 时，只删除匹配到的第一个元素；为 true 时，删除所有匹配到的元素
     *
     * @template T
     * @param {T[]} this
     * @param {(T | ((value: T, index: number) => boolean))} predicate
     * @param {boolean} [whole=true]
     * @returns {boolean}
     */
    delete<T>(this: T[], predicate: T | ((value: T, index: number) => boolean), whole = true): boolean {
        const fn = (
            assert.isFunction(predicate)
                ? predicate
                : (item: T) => item === predicate
        );

        let index = 0, flag = false;
        while (index >= 0) {
            index = this.findIndex(fn);
            if (index !== -1) {
                this.splice(index, 1);
                flag = true;
            }
            if (!whole) {
                break;
            }
        }

        return flag;
    },

    /**
     * 数组去重
     *  - 如果没有输入 label 函数，则对数组元素直接去重
     *  - 如果输入了 label 函数，将会使用该函数对数组元素做一次转换，对转换之后的值进行去重，最后再映射回原数组
     *
     * @template T
     * @param {T[]} this
     * @param {((value: T, index: number) => number | string)} [label]
     * @returns {T[]}
     */
    unique<T>(this: T[], label?: (value: T, index: number) => number | string): T[] {
        if (assert.isNull(label)) {
            return [...new Set(this)];
        }

        const labelMap: { [key: string]: boolean } = {};
        return this
            .map((value, index) => ({ value, key: label(value, index) }))
            .filter(({ key }) => (labelMap[key] ? false : (labelMap[key] = true)))
            .map(({ value }) => value);
    },

    /** 用于 vue 数组的元素赋值 */
    $set<T>(this: T[], i: number, item: T): void {
        if (i > -1 && this[i] !== item) {
            this.splice(i, 1, item);
        }
    },
});

nativeExpand(Number, {
    /**
     * 用于匹配科学记数法表示的字符串
     */
    SCIENTIFIC_COUNT_MATCH: /^\d+(?:\.\d+)?$|^\d+?(?:\.\d+)?[eE]-?\d+$|^\d+(?:\.\d+)?[puμnmkMG]$/,

    /**
     * 将用科学记数法的字符串转换为对应的数字
     *
     * @param {string} notation
     * @returns {number}
     */
    scientificCountParser(notation: string): number {
        if (!Number.SCIENTIFIC_COUNT_MATCH.test(notation)) {
            return NaN;
        }
        else if (/[eE]/.test(notation)) {
            const [base, power] = notation.split(/[eE]/);
            return Number(base) * Math.pow(10, Number(power));
        }
        else if (/[puμnmkMG]$/.test(notation)) {
            const exp = { p: -12, u: -9, μ: -9, n: -6, m: -3, k: 3, M: 6, G: 9 },
                power = exp[notation[notation.length - 1]] as number,
                base = notation.substring(0, notation.length - 1);

            return Number(base) * Math.pow(10, power);
        }
        else {
            return Number(notation);
        }
    },
});

nativeExpand(Number.prototype, {
    /**
     * 按照有效数字的位数进行四舍五入。
     *  - 默认 6 位有效数字 [bits=6]
     *
     * @param {number} [bits=6]
     * @returns {number}
     */
    toRound(this: number, bits: number = 6): number {
        const origin = this.valueOf();

        if (Number.isNaN(origin)) {
            throw new Error('(number) cannot run .toRound() on NaN');
        }

        const value = Math.abs(origin),
            toInt = Math.floor(Math.log10(value)) - bits + 1,
            transform = 10 ** toInt,
            // round 一定是整数
            round = String(Math.round(value / transform)),
            // 原始数据符号
            sign = origin < 0 ? '-' : '';

        // 插入小数点
        let str = '';
        if (toInt > 0) {
            str = round + '0'.repeat(toInt);
        } else if (-toInt >= bits) {
            str = `0.${'0'.repeat(-toInt - bits)}${round}`;
        } else {
            str = `${round.slice(0, toInt)}.${round.slice(toInt)}`;
        }

        return Number.parseFloat(sign + str);
    },

    /**
     * 求数字的数量级
     *
     * @returns {number}
     */
    rank(this: number): number {
        const value = Math.abs(this.valueOf());

        if (Number.isNaN(value)) {
            throw new Error('(number) cannot run .rank() on NaN');
        }

        return Math.floor(Math.log10(value));
    },
});
