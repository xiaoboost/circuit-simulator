/**
 * 深复制对象
 * @template T
 * @param {T} object
 * @param {boolean} [check]
 * @returns {T}
 */
export function clone<T>(data: T, check?: boolean): T;

/**
 * 获取该元素的 css 作用域标签
 * @export
 * @param {HTMLElement} el
 * @returns {string}
 */
export function getScopedName(el: HTMLElement): string;
