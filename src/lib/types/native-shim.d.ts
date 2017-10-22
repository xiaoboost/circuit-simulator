interface ObjectConstructor {
    /**
     * 输入对象是否含有可枚举元素
     *
     * @param {object} from
     * @returns {boolean}
     */
    isEmpty(from: object): boolean;
    /**
     * 深复制输入对象
     *  - 输入对象不得含有循环调用，复制出的对象全部是内建对象格式
     *
     * @template T
     * @param {T} from
     * @returns {T}
     */
    // clone<T>(from: T): T;
    /**
     * 将输入对象的所有可枚举属性全部隐藏
     *
     * @param {object} from
     * @returns {boolean}
     */
    hideAll(from: object): void;
    /**
     * 将输入对象以及下属所有对象全部冻结
     *
     * @param {*} from
     * @returns {boolean}
     */
    freezeAll(from: any): boolean;
    /**
     * 将输入对象以及下属所有对象全部封闭
     *
     * @param {*} from
     * @returns {boolean}
     */
    sealAll(from: any): boolean;
}

interface Object {
    /**
     * 当前对象实例与输入对象是否相等
     *
     * @param {*} obj
     * @returns {boolean}
     */
    isEqual(obj: any): boolean;
      /**
       * 原对象的 key 不变，生成新的对象
       *
       * @template T
       * @template U
       * @param {T} this
       * @param {(value: any, key: string) => U} callback
       * @returns {{ [P in keyof T]: U }}
       */
    // map<T, U>(this: T, callback: (value: any, key: string) => U): { [P in keyof T]: U };
}

// interface ArrayConstructor {
//     /**
//      * 深复制数组
//      *
//      * @param {any[]} from
//      * @returns {any[]}
//      */
//     clone<U>(from: U[]): U[];
// }

interface Array<T> {
    /**
     * 当前数组与输入是否相等
     *
     * @param {any} to
     * @returns {boolean}
     */
    isEqual(to: any): boolean;
    /**
     * 根据下标取出当前数组元素
     *
     * @param {T[]} this
     * @param {number} index
     * @returns {T}
     */
    get(index: number): T;
    /**
     * 从下标 0 开始，删除 predicate 第一个返回 true 的元素
     *
     * @param {T[]} this
     * @param {(value: T, index: number) => boolean} predicate
     * @returns {boolean}
     */
    delete(predicate: (value: T, index: number) => boolean): boolean;
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
     * @param {*} value
     */
    $set(index: number, value: any): void;
}

interface NumberConstructor {
    /**
     * 用于匹配科学记数法表示的字符串
     */
    readonly SCIMatch: RegExp;
    /**
     * 将用科学记数法的字符串转换为对应的数字
     *
     * @param {string} notation
     * @returns {number}
     */
    SCIParser(notation: string): number;
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
