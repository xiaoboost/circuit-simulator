import {
    isArray,
    isBaseType,
} from './assertion';

/**
 * 检查输入数据是否含有循环结构
 * @param {*} data
 * @returns {boolean}
 */
export function checkCircularStructure(data, parents = []) {
    // 如果当前节点与祖先节点中的某一个相等，那么肯定含有循环结构
    if (parents.some((parent) => parent === data)) {
        return true;
    }

    // 队列添加当前节点
    parents.push(data);

    // 检查每个子节点
    return Object.values(data).some(
        (value) =>
            isBaseType(value) ? false : checkCircularStructure(value, parents.slice())
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
    if (isBaseType(data)) {
        return data;
    }

    // 非基础类型，首先检查是否含有循环引用
    if (check && checkCircularStructure(data)) {
        throw new Error('Can not clone circular structure.');
    }

    // 数组，深度复制
    if (isArray(data)) {
        return data.map((n) => clone(n));
    }
    // FIXME: 全部改成使用 from 静态接口
    // 默认对象
    else {
        return Object.keys(data).reduce((obj, key) => ((obj[key] = clone(data[key], false)), obj), {});
    }
}

/**
 * 按照 keys 复制对象属性
 * @template T extends object
 * @template U extends keyof T
 * @param {T} from 待复制的对象
 * @param {U[]} keys 属性集合
 */
export function copyProperties(object, keys) {
    return clone(keys.reduce((v, k) => ((v[k] = object[k]), v), {}));
}
