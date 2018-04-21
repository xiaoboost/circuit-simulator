/**
 * 深复制对象
 * @template T
 * @param {T} object
 * @param {boolean} [check]
 * @returns {T}
 */
export function clone<T>(data: T, check?: boolean): T;

/**
 * 生成异步延迟函数
 * @export
 * @param {number} [time]
 * @returns {Promise<void>} 
 */
export function delay(time?: number): Promise<void>;

/**
 * 生成一个一次性的事件
 * @export
 * @param {(HTMLElement | Worker)} el
 * @param {string} type
 * @returns {Promise<Event>}
 */
export function onceEvent(el: Worker, type: 'message'): Promise<MessageEvent>
export function onceEvent(el: HTMLElement, type: string): Promise<Event>;

/**
 * 生成随机字符串
 * @export
 * @param {number} [len=16] 字符串长度
 * @returns {string}
 */
export function randomString(len?: number): string;

/**
 * 从链接中获取参数值
 * @param {string} name 参数名称
 * @return {string}
 */
export function getQueryByName(name: string): string;

/**
 * 按照 keys 复制对象属性
 * @template T extends object
 * @template U extends keyof T
 * @param {T} from 待复制的对象
 * @param {U[]} keys 属性集合
 */
export function copyProperties<T extends object, U extends keyof T>(from: T, keys: U[]): Pick<T, U>;

/**
 * 将`props`中的属性混入`native`中
 * @param {object} native 待混入的对象
 * @param {{ [key: string]: any }} props 待混入的属性
 */
export function mixins(native: object, props: { [key: string]: any }): void;
