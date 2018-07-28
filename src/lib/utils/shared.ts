import { checkCircularStructure } from './clone';
import { supportsOnce, supportsPassive } from './env';

import {
    isFunc,
    isArray,
    isBaseType,
    isObject,
} from './assertion';

/**
 * 生成异步延迟函数
 * @param {number} [time=0]
 * @returns {Promise<void>}
 */
export function delay(time = 0) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 生成一个一次性的事件
 * @param {Element} el
 * @param {string} type
 * @returns {Promise<Event>}
 */
export function onceEvent(el: Element, type: string): Promise<Event> {
    let option: boolean | {
        passive?: boolean;
        once?: boolean;
    };

    if (!supportsPassive && !supportsOnce) {
        option = false;
    }
    else {
        option = {};

        if (supportsPassive) {
            option.passive = true;
        }
        if (supportsOnce) {
            option.once = true;
        }
    }

    return new Promise((resolve) => {
        el.addEventListener(
            type,
            function once(event: Event) {
                resolve(event);
                if (!supportsOnce) {
                    el.removeEventListener(type, once);
                }
            },
            option,
        );
    });
}

/**
 * 生成随机字符串
 * @param {number} [len=16] 字符串长度
 * @returns {string}
 */
export function randomString(len = 16) {
    const start = 48, end = 126;
    const exclude = '\\/[]?{};,<>:|`';

    let codes = '';
    while (codes.length < len) {
        const code = String.fromCharCode(Math.random() * (end - start) + start);

        if (!exclude.includes(code)) {
            codes += code;
        }
    }

    return codes;
}

/**
 * Hyphenate a camelCase string.
 * @param {string} str
 */
export function hyphenate(str: string) {
    return str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
}

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

    if (isArray(from)) {
        if (!isArray(to) || from.length !== to.length) {
            return false;
        }
        else {
            return from.every((item, i) => isEqual(item, to[i]));
        }
    }
    else {
        if (!isObject(to) || isEqual(Object.keys(from), Object.keys(to))) {
            return false;
        }
        else {
            return Object.entries(from).every(([key, value]) => isEqual(value, to[key]));
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
