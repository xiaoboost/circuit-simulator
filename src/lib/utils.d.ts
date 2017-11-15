/**
 * 深复制对象
 * @template T
 * @param {T} object
 * @param {boolean} [check]
 * @returns {T}
 */
export function clone<T>(data: T, check?: boolean): T;
