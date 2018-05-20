/**
 * 检查输入数据是否含有循环结构
 * @param {*} data
 * @returns {boolean}
 */
export function checkCircularStructure(data: object): boolean;

/**
 * 深复制对象
 * @template T
 * @param {T} object
 * @param {boolean} [check]
 * @returns {T}
 */
export function clone<T>(data: T, check?: boolean): T;

/**
 * 按照 keys 复制对象属性
 * @template T extends object
 * @template U extends keyof T
 * @param {T} from 待复制的对象
 * @param {U[]} keys 属性集合
 */
export function copyProperties<T extends object, U extends keyof T>(from: T, keys: U[]): Pick<T, U>;
