import { createServiceKey } from '../../context';

/**
 * 变量服务键
 *
 * @description 该服务用于获取变量功能
 * @example
 * ```ts
 * const variableObserverService = useService(IVariableObserverService);
 * ```
 */
export const IVariableObserverService
  = createServiceKey<IVariableObserverService>('VariableObserverService');

/** 观察回调 */
export type ObserverCb<T = unknown> = (newVal: T, oldVal: T) => void;

export interface IVariableObserverService {
  /** 清除所有变量和监听 */
  clear(): void;
  /**
   * 清除所有变量
   *
   * @description 仅仅是清除变量，观测器本身还在
   * @param {boolean} [triggerWatcher] 是否触发观察回调，默认`true`
   */
  clearVariable(triggerWatcher?: boolean): void;
  /**
   * 设置默认变量的值
   */
  set<T>(symbol: symbol, newVal: T): void;
  /**
   * 设置变量
   *
   * @description 要设置值为空时，必须显式的给出`undefined`或者`null`值，不然会被重载为设置默认变量的值。
   */
  set<T>(symbol: symbol, key: string, newVal: T): void;
  /**
   * 设置变量组
   */
  set<T>(symbol: symbol, keyValues: [key: string, value: T][]): void;
  /** 获取变量 */
  get<T>(symbol: symbol): T | undefined;
  get<T>(symbol: symbol, key: string): T | undefined;
  /** 观察变量 */
  observe<T>(symbol: symbol, callback: ObserverCb<T>): () => void;
  observe<T>(symbol: symbol, key: string, callback: ObserverCb<T>): () => void;
  /**
   * 取消所有观察
   *
   * @description 仅仅是取消观察，变量本身都还在
   */
  unObserve(): void;
  /** 取消观察作用域 */
  unObserve(symbol: symbol): void;
  /** 取消观察变量 */
  unObserve(symbol: symbol, key: string): void;
  /** 取消观察变量 */
  unObserve(symbol: symbol, key: string, callback: ObserverCb): void;
  /** React 订阅变量 */
  useVariable<T>(symbol: symbol): T | undefined;
  useVariable<T>(symbol: symbol, key: string): T | undefined;
}
