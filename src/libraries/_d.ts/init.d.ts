declare interface ObjectConstructor {
    /**
     * 输入对象是否含有可枚举元素
     * 
     * @param {object} from 
     * @returns {boolean} 
     * @memberof ObjectConstructor
     */
    isEmpty(from: object): boolean,
    /**
     * 深复制输入对象。
     * 输入对象不得含有循环调用，复制出的对象全部是内建对象格式
     * 
     * @param {object} from 
     * @returns {object} 
     * @memberof ObjectConstructor
     */
    clone(from: object): object,
    /**
     * 将输入对象的所有可枚举属性全部隐藏
     * 
     * @param {*} from 
     * @memberof ObjectConstructor
     */
    hideAll(from: any): void,
    /**
     * 将输入对象以及下属所有对象全部冻结
     * 
     * @param {*} from 
     * @memberof ObjectConstructor
     */
    freezeAll(from: any): void,
    /**
     * 将输入对象以及下属所有对象全部封闭
     * 
     * @param {*} from 
     * @memberof ObjectConstructor
     */
    sealAll(from: any): void,
}

declare interface Object {
    /**
     * 当前对象实例与输入对象是否相等
     * 
     * @param {*} obj 
     * @returns {boolean} 
     * @memberof Object
     */
    isEqual(obj: any): boolean,
    /**
     * 原对象的 key 不变，生成新的对象
     * 
     * @template U 
     * @param {(value: any, key: string) => object} fn 
     * @returns {U} 
     * @memberof Object
     */
    map(fn: (value: any, key: string) => any): object,
}

declare interface ArrayConstructor {
    /**
     * 复制数组
     * 
     * @param {any[]} from 
     * @returns {any[]} 
     * @memberof ArrayConstructor
     */
    clone<U>(from: U[]): U[],
}

declare interface Array<T> {
    /**
     * 当前数组与输入数组是否相等
     * 
     * @param {any[]} arr 
     * @returns {boolean} 
     * @memberof Array
     */
    isEqual(arr: any[]): boolean,
    /**
     * 根据下标取出当前数组元素
     * 
     * @param {number} index 
     * @returns {*} 
     * @memberof Array
     */
    get(index: number): any,
    /**
     * 从下标 0 开始，删除 predicate 第一个返回 true 的元素
     * 
     * @param {(value: any, index: number) => boolean} predicate 
     * @returns {boolean} 
     * @memberof Array
     */
    delete(predicate: (value: any, index: number) => boolean): boolean,
    /**
     * 用于 vue 的数组更新
     * 
     * @param {number} i 
     * @param {*} item 
     * @memberof Array
     */
    $set(i: number, item: any): void,
}

declare interface Number {
    /**
     * 按照有效数字的位数进行四舍五入。
     * 默认 6 位有效数字
     * 
     * @param {number} [bits=6] 
     * @returns {number} 
     * @memberof Number
     */
    toRound(bits: number = 6): number,
    /**
     * 求数字的数量级
     * 
     * @returns {number} 
     * @memberof Number
     */
    rank(): number,
}
