export default {
    /**
     * 断言：输入是否是数字
     *
     * @param {*} x
     * @returns {x is number}
     */
    isNumber(x: any): x is number {
        return (typeof x === 'number');
    },

    /**
     * 断言：输入是否是字符串
     *
     * @param {*} x
     * @returns {x is string}
     */
    isString(x: any): x is string {
        return (typeof x === 'string');
    },

    /**
     * 断言：输入是否是布尔值
     *
     * @param {*} x
     * @returns {x is boolean}
     */
    isBoolean(x: any): x is boolean {
        return (typeof x === 'boolean');
    },

    /**
     * 断言：输入是否是 Symbol 类型
     *
     * @param {*} x
     * @returns {x is symbol}
     */
    isSymbol(x: any): x is symbol {
        return (typeof x === 'symbol');
    },

    /**
     * 断言：输入是否是函数
     *
     * @param {*} x
     * @returns {x is () => any}
     */
    isFuncton(x: any): x is () => any {
        return (typeof x === 'function');
    },

    /**
     * 断言：输入是否是 null 或 undefined
     *
     * @param {*} x
     * @returns {(x is null | undefined)}
     */
    isNull(x: any): x is null | undefined {
        const type: string = Object.prototype.toString.call(x);
        return (type === '[object Null]' || type === '[object Undefined]');
    },

    /**
     * 断言：输入是否是对象
     *
     * @param {*} x
     * @returns {x is {}}
     */
    isObject(x: any): x is {} {
        return (Object.prototype.toString.call(x) === '[object object]');
    },

    /**
     * 断言：输入是否是 Array 的实例（包含继承 Array 类的实例）
     *
     * @param {*} x
     * @returns {x is any[]}
     */
    isArray(x: any): x is any[] {
        return (Object.prototype.toString.call(x) === '[object Array]');
    },

    /**
     * 断言：输入是否是正则表达式
     *
     * @param {*} x
     * @returns {x is RegExp}
     */
    isRegExp(x: any): x is RegExp {
        return (Object.prototype.toString.call(x) === '[object RegExp]');
    },

    /**
     * 断言：输入是否是 DOM 元素
     *
     * @param {*} x
     * @returns {x is HTMLElement}
     */
    isElement(x: any): x is HTMLElement {
        return (/^\[object HTML([a-zA-Z]+)?Element\]$/.test(Object.prototype.toString.call(x)));
    },
};
