import { createServiceKey } from '../../context';

/**
 * 变量服务键
 *
 * @description 该服务用于获取变量功能
 * @example
 * ```ts
 * const variableObserverService = usePainterService(VARIABLE_OBSERVER_SERVICE);
 * ```
 */
export const VARIABLE_OBSERVER_SERVICE =
  createServiceKey<IVariableObserverService>('VariableObserverService');

/** 观察回调 */
export type ObserverCb<T = unknown> = (newVal: T, oldVal: T) => void;

export interface IVariableObserverService {
  /** 清除所有变量 */
  clear(): void;
  /** 设置变量 */
  set<T>(symbol: symbol, key: string, newVal: T): void;
  /** 获取变量 */
  get<T>(symbol: symbol, key: string): T | undefined;
  /** 观察变量 */
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
  useVariable<T>(symbol: symbol, key: string): T | undefined;
}
