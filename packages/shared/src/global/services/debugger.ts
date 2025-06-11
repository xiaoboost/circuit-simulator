import { createServiceKey } from '@circuit/inject';

/**
 * 调试服务键
 *
 * @description 该服务用于获取调试功能
 * @example
 * ```ts
 * const debuggerService = useService(DEBUGGER_SERVICE);
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
  /** 断言非空数组类型 */
  assertNonNull(input: unknown): asserts input is NonNullable<unknown>;
  /**
   * 断言自定义类型
   *
   * @description 允许通过输入回调来进行自定义断言。
   * @example
   * ```ts
   * declare function isString(input: unknown): boolean;
   * declare const input: string | MockData;
   *
   * debuggerService.assert.assertType(input, isString);
   * ```
   */
  assertType<T>(
    input: unknown,
    cb: (input: any) => boolean,
  ): asserts input is T;
}

export interface IDebuggerService {
  /** 断言函数工具集 */
  assert: IAssert;
}
