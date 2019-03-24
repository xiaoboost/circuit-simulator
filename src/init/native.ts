import {
    def,
    isFunc,
    isUndef,
} from '../lib/utils';

def(Array.prototype, {
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
        const fn = isFunc(predicate) ? predicate : (item: T) => item === predicate;

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
        if (isUndef(label)) {
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
