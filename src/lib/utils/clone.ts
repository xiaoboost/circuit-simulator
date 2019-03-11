import {
    isArray,
    isBaseType,
    isFunc,
} from './assertion';

/**
 * 检查输入数据是否含有循环结构
 * @param {*} data
 * @returns {boolean}
 */
export function checkCircularStructure(data: object, parents: any[] = []): boolean {
    // 如果当前节点与祖先节点中的某一个相等，那么肯定含有循环结构
    if (parents.some((parent) => parent === data)) {
        return true;
    }

    // 队列添加当前节点
    parents.push(data);

    // 检查每个子节点
    return Object.values(data).some(
        (value) =>
            isBaseType(value) ? false : checkCircularStructure(value, parents.slice()),
    );
}

/**
 * 深复制对象
 * @template T
 * @param {T} object
 * @param {boolean} [check=true]
 * @returns {T}
 */
export function clone<T>(data: T, check = true): T {
    // 基础类型和函数，直接返回其本身
    if (isBaseType(data) || isFunc(data)) {
        return data;
    }

    // 非基础类型，首先检查是否含有循环引用
    if (check && checkCircularStructure(data as any)) {
        throw new Error('Can not clone circular structure.');
    }

    // 函数返回其自身
    if (isFunc(data)) {
        return data;
    }
    // Date 对象
    else if (data instanceof Date) {
        return (new Date(data) as any);
    }
    // 数组，深度复制
    else if (isArray(data)) {
        return data.map((n, i) => clone(n)) as any;
    }
    // 其余对象
    else {
        const prototype = Object.getPrototypeOf(data);

        if (
            prototype &&
            prototype.constructor &&
            prototype.constructor.from
        ) {
            return prototype.constructor.from(data);
        }
        else {
            return (Object.keys(data).reduce((obj, key) => ((obj[key] = clone(data[key], false)), obj), {}) as any);
        }
    }
}

/**
 * 按照 keys 复制对象属性
 * @template T extends object
 * @template U extends keyof T
 * @param {T} from 待复制的对象
 * @param {U[]} keys 属性集合
 */
export function copyProperties<T extends object, U extends keyof T>(from: T, keys: U[]): Pick<T, U> {
    const data: T = {} as any;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        data[key] = from[key];
    }

    return clone(data);
}
