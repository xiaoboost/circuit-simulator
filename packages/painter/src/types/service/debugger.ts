import { createServiceKey } from '../../context';

/**
 * 调试服务键
 *
 * @description 该服务用于获取调试功能
 * @example
 * ```ts
 * const debuggerService = usePainterService(DEBUGGER_SERVICE);
 * ```
 */
export const DEBUGGER_SERVICE =
  createServiceKey<IDebuggerService>('DebuggerService');

/** 断言函数工具集 */
interface IAssert {
  /** 断言数字类型 */
  assertNumber(input: unknown): asserts input is number;
  /** 断言字符串类型 */
  assertString(input: unknown): asserts input is string;
  /** 断言布尔类型 */
  assertBoolean(input: unknown): asserts input is boolean;
  /** 断言对象类型 */
  assertObject(input: unknown): asserts input is object;
  /** 断言数组类型 */
  assertArray(input: unknown): asserts input is unknown[];
  /** 断言函数类型 */
  assertFunction(input: unknown): asserts input is (...args: unknown[]) => unknown;
  /**
   * 断言自定义类型
   *
   * @description 允许通过输入回调来进行自定义断言，断言类型会自动推倒。
   * @example
   * ```ts
   * declare function isString(input: unknown): asserts input is string;
   * declare const input: string | MockData;
   *
   * debuggerService.assert.assertCustomType(input, isString);
   * ```
   */
  assertCustomType<T>(
    input: unknown,
    cb: (input: unknown) => asserts input is T,
  ): asserts input is T;
}

/** 类型守护工具集 */
interface ITypeGuard {
  /** 断言数字 */
  isNumber(input: unknown): input is number;
  /** 断言字符串 */
  isString(input: unknown): input is string;
  /** 断言布尔 */
  isBoolean(input: unknown): input is boolean;
  /** 断言对象 */
  isObject(input: unknown): input is object;
  /** 断言数组 */
  isArray(input: unknown): input is unknown[];
  /** 断言函数 */
  isFunction(input: unknown): input is (...args: unknown[]) => unknown;
}

export interface IDebuggerService {
  /** 断言函数工具集 */
  assert: IAssert;
  /** 类型守护工具集 */
  is: ITypeGuard;
}
