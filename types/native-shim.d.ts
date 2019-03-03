interface Array<T> {
    /**
     * 根据下标取出当前数组元素
     *
     * @param {T[]} this
     * @param {number} index
     * @returns {T}
     */
    get(index: number): T;
    /**
     * 删除满足条件的第一个元素
     *  - predicate 为函数时，删除 predicate 返回 true 的第一个元素
     *  - predicate 为非函数时，删除与 predicate 严格相等的第一个元素
     *
     * @param {(T | ((value: T, index: number) => boolean))} predicate 
     * @param {boolean} [whole=true] 
     * @returns {boolean} 
     * @memberof Array
     */
    delete(predicate: T | ((value: T, index: number) => boolean), whole?: boolean): boolean;
    /**
     * 数组去重
     *  - 如果没有输入 label 函数，则对数组元素直接去重
     *  - 如果输入了 label 函数，将会使用该函数对数组元素做一次转换，对转换之后的值进行去重，最后再映射回原数组
     * 
     * @param {T[]} this
     * @param {((value: T, index: number) => number | string)} [label]
     * @returns {T[]}
     */
    unique(label?: (value: T, index: number) => number | string): T[];
    /**
     * 用于 vue 的数组更新
     *
     * @param {number} index
     * @param {T} value
     */
    $set(index: number, value: T): void;
}

interface Number {
    /**
     * 按照有效数字的位数进行四舍五入。
     *  - 默认 6 位有效数字 [bits=6]
     *
     * @param {number} [bits=6]
     * @returns {number}
     */
    toRound(bits?: number): number;
    /**
     * 求数字的数量级
     *
     * @returns {number}
     */
    rank(): number;
}
