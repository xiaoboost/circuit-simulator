import * as assert from 'src/lib/assertion';
import { $P, Point } from 'src/lib/point';
import { $M, Matrix } from 'src/lib/matrix';

/**
 * 检查输入数据是否含有循环结构
 * @param {*} data
 * @returns {boolean}
 */
function checkCircularStructure(data, parents = []) {
    // 如果当前节点与祖先节点中的某一个相等，那么肯定含有循环结构
    if (parents.some((parent) => parent === data)) {
        return true;
    }

    // 队列添加当前节点
    parents.push(data);

    // 检查每个子节点
    return Object.values(data).some(
        (value) =>
            assert.isBaseType(value) ? false : checkCircularStructure(value, parents.slice())
    );
}

/**
 * 深复制对象
 * @template T
 * @param {T} object
 * @param {boolean} [check=true]
 * @returns {T}
 */
export function clone(data, check = true) {
    // 基础类型，直接返回其本身
    if (assert.isBaseType(data)) {
        return data;
    }

    // 非基础类型，首先检查是否含有循环引用
    if (check && checkCircularStructure(data)) {
        throw new Error('Can not clone circular structure.');
    }

    if (data instanceof Point) {
        return $P(data);
    }
    else if (data instanceof Matrix) {
        return $M(data);
    }
    else if (assert.isArray(data)) {
        return data.map((n) => clone(n));
    }
    // 默认对象
    else {
        return Object.keys(data).reduce((obj, key) => ((obj[key] = clone(data[key], false)), obj), {});
    }
}

/**
 * 生成异步延迟函数
 * @export
 * @param {number} [time=0]
 * @returns {Promise<void>}
 */
export function delay(time = 0) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 生成一个一次性的事件
 * @export
 * @param {(HTMLElement | Worker)} el
 * @param {string} type
 * @returns {Promise<Event>}
 */
export function onceEvent(el, type) {
    let option;

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
            function once(event) {
                resolve(event);
                if (!supportsOnce) {
                    el.removeEventListener(type, once);
                }
            },
            option
        );
    });
}

/**
 * 生成随机字符串
 * @export
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
 * 从链接中获取参数值
 * @param {string} name 参数名称
 * @return {string}
 */
export function getQueryByName(name) {
    name = name.replace(/[[\]]/g, '\\$&');

    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(window.location.href);

    if (!results || !results[2]) {
        return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
