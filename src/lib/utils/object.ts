import { checkCircularStructure } from './clone';

import {
    isFunc,
    isArray,
    isBaseType,
    isObject,
} from './assertion';

/**
 * 检查 key 是否存在于 obj 对象中
 * @param obj 检查对象
 * @param key 检查的属性名称
 */
export function hasOwn(obj: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 对象是否为空
 * @param obj 待检测对象
 */
export function isEmpty(obj: object) {
    return Object.keys(obj).length > 0;
}

/**
 * 比较两个值是否相等
 * @param from 被比较值
 * @param to 比较值
 */
export function isEqual(from: any, to: any, deepCheck = false): boolean {
    if (isBaseType(from)) {
        return from === to;
    }

    if (deepCheck && checkCircularStructure(from)) {
        throw new Error('(isEqual) Can not have circular structure.');
    }

    if (isFunc(from.isEqual)) {
        return Boolean(from.isEqual(to));
    }

    if (isArray(from)) {
        if (!isArray(to) || from.length !== to.length) {
            return false;
        }
        else {
            return from.every(
                (item, i) => isBaseType(item)
                    ? item === to[i]
                    : isEqual(item, to[i]),
            );
        }
    }
    else {
        if (
            !isObject(to) ||
            !Object.keys(from).every((key) => to.hasOwnProperty(key)) ||
            !Object.keys(to).every((key) => from.hasOwnProperty(key))
        ) {
            return false;
        }
        else {
            return Object.entries(from).every(
                ([key, value]) => isBaseType(value)
                    ? value === to[key]
                    : isEqual(value, to[key]),
            );
        }
    }
}

/**
 * 在对象中添加隐藏属性
 * @param from 待添加属性的对象
 * @param properties 添加的属性
 */
export function def(from: object, properties: object) {
    Object.entries(properties).forEach(
        ([key, value]) => Object.defineProperty(from, key, {
            configurable: true,
            writable: true,
            enumerable: false,
            value,
        }),
    );
}

/**
 * 代理对象的无效属性
 *  - 比如，`excludeObject({ a: 1, b: 2, c: 3 }, Infinity)`
 *  - 这样生成的对象，访问 a, b, c 属性和普通的对象没区别，但是访问 d, e, f 等属性则会得到`Infinity`
 * @param inside 内部包裹的对象
 * @param other 无效属性的值
 */
export function excludeObject<T extends object, U = undefined>(inside: T, other: U): Readonly<T & AnyObject<U>> {
    return new Proxy(inside, {
        get(target, key) {
            if (key in target) {
                return target[key];
            }
            else {
                return other;
            }
        },
    }) as any;
}
