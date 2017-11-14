import * as assert from 'src/lib/assertion';
import { $P, Point } from 'src/lib/point';
import { $M, Matrix } from 'src/lib/matrix';

/**
 * 检查输入数据是否含有循环结构
 * @param {*} data
 * @returns {boolean}
 */
// function checkCircularStructure(data: any, parents: object[] = []): boolean {
function checkCircularStructure(data, parents = []) {
    // 当前输入值为基础类型
    if (assert.isBaseType(data)) {
        return false;
    }
    // 如果当前节点与祖先节点中的某一个相等，那么肯定含有循环结构
    if (parents.some((parent) => parent === data)) {
        return true;
    }

    // 队列添加当前节点
    parents.push(data);

    // 检查每个子节点
    return Object.values(data).some((value) => {
        return checkCircularStructure(value, parents.slice());
    });
}

/**
 * 深复制对象
 * @template T
 * @param {T} object
 * @returns {T}
 */
// export function clone<T = any>(data: T): T {
export function clone(data) {
    if (checkCircularStructure(data)) {
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
    else if (assert.isObject(data)) {
        return Object.keys(data).reduce((obj, key) => ((obj[key] = clone(data[key])), obj), {});
    }
    else {
        return data;
    }
}
