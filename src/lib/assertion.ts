/**
 * 断言：输入是否是数字
 *
 * @param {*} x
 * @returns {x is number}
 */
function isNumber(x: any): x is number {
    return (typeof x === 'number');
}

/**
 * 断言：输入是否是字符串
 *
 * @param {*} x
 * @returns {x is string}
 */
function isString(x: any): x is string {
    return (typeof x === 'string');
}

/**
 * 断言：输入是否是布尔值
 *
 * @param {*} x
 * @returns {x is boolean}
 */
function isBoolean(x: any): x is boolean {
    return (typeof x === 'boolean');
}

/**
 * 断言：输入是否是 Symbol 类型
 *
 * @param {*} x
 * @returns {x is symbol}
 */
function isSymbol(x: any): x is symbol {
    return (typeof x === 'symbol');
}

/**
 * 断言：输入是否是 null 或 undefined
 *
 * @param {*} x
 * @returns {(x is null | undefined)}
 */
function isNull(x: any): x is null | undefined {
    const type = Object.prototype.toString.call(x) as string;
    return (type === '[object Null]' || type === '[object Undefined]');
}

/**
 * 断言：输入是否是函数
 *
 * @param {*} x
 * @returns {x is () => any}
 */
function isFuncton(x: any): x is () => any {
    return (typeof x === 'function');
}

/**
 * 断言：输入是否是严格意义上的对象
 *  - 不包括 Array、Function、Promise 等内建类的实例以及它们继承类的实例
 *
 * @param {*} x
 * @returns {x is object}
 */
function isStrictObject(x: any): x is { [key: string]: any } {
    return (Object.prototype.toString.call(x) === '[object object]');
}

/**
 * 断言：输入是否是广义上的对象
 *  - 包括所有 Object 类的实例，以及 Object 继承类的实例
 *
 * @param {*} x
 * @returns {x is object}
 */
function isObject(x: any): x is { [key: string]: any } {
    const type = typeof x;
    return (
        (type === 'object') ||
        (type === 'function')
    );
}

/**
 * 断言：输入是否是 Array 的实例（包含继承 Array 类的实例）
 *
 * @param {*} x
 * @returns {x is any[]}
 */
function isArray(x: any): x is any[] {
    return (Object.prototype.toString.call(x) === '[object Array]');
}

/**
 * 断言：输入是否是正则表达式
 *
 * @param {*} x
 * @returns {x is RegExp}
 */
function isRegExp(x: any): x is RegExp {
    return (Object.prototype.toString.call(x) === '[object RegExp]');
}

/**
 * 断言：输入是否是 DOM 元素
 *
 * @param {*} x
 * @returns {x is HTMLElement}
 */
function isElement(x: any): x is HTMLElement {
    return (/^\[object HTML([a-zA-Z]+)?Element\]$/.test(Object.prototype.toString.call(x) as string));
}

/**
 * 断言：输入是否是基础类型
 *
 * @param {*} x
 * @returns {(x is number | string | boolean | symbol | null | undefined)}
 */
function isBaseType(x: any): x is number | string | boolean | symbol | null | undefined {
    return (!isObject(x));
}

/**
 * 断言：输入是否是除 null 和 undefined 之外的基础类型
 *
 * @param {*} x
 * @returns {(x is number | string | boolean | symbol)}
 */
function isBaseTypeExNull(x: any): x is number | string | boolean | symbol {
    return (
        isBaseType(x) && !isNull(x)
    );
}

export default {
    isNumber,
    isString,
    isBoolean,
    isSymbol,
    isNull,
    isBaseType,
    isBaseTypeExNull,
    isFuncton,
    isObject,
    isStrictObject,
    isArray,
    isRegExp,
    isElement,
};
