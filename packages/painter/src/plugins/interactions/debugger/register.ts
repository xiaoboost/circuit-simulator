import {
  isNumber,
  isString,
  isBoolean,
  isObject,
  isArray,
  isFunc,
  isDef,
  isPrimitive,
} from '@xiao-ai/utils';
import { definePlugin } from '../../../context';
import {
  IDebuggerService,
  LOGGER_SERVICE,
  CONFIGURATION_SERVICE,
  DEBUGGER_SERVICE,
} from '../../../types';

definePlugin(({ registerService, getService }) => {
  const service: IDebuggerService = {
    assert: {
      assertNumber(input): asserts input is number {
        return assertType(input, '数字', isNumber);
      },
      assertString(input): asserts input is string {
        return assertType(input, '字符串', isString);
      },
      assertBoolean(input): asserts input is boolean {
        return assertType(input, '布尔值', isBoolean);
      },
      assertObject(input): asserts input is object {
        return assertType(input, '对象', isObject);
      },
      assertArray(input): asserts input is unknown[] {
        return assertType(input, '数组', isArray);
      },
      assertFunction(input): asserts input is (...args: unknown[]) => unknown {
        return assertType(input, '函数', isFunc);
      },
      assertNonNull(input): asserts input is NonNullable<unknown> {
        return assertType(input, '非空值', isDef);
      },
      assertType<T>(input: unknown, cb: (input: any) => boolean): asserts input is T {
        return assertType(input, '自定义', cb);
      },
    },
  };

  function assertType<T>(
    input: unknown,
    typeName: string,
    cb: (input: unknown) => boolean,
  ): asserts input is T {
    if (getService(CONFIGURATION_SERVICE).openDebugLog.data) {
      if (!cb(input)) {
        const currentType = isPrimitive(input) ? typeof input : Object.getPrototypeOf(input).name;
        const message = `类型校验未通过，期望类型: ${typeName}，输入值: ${input}，其类型为：${currentType}`;
        getService(LOGGER_SERVICE).debug('Assert', message);
        throw new Error(message);
      }
    }
  }

  // 注册调试服务
  registerService(DEBUGGER_SERVICE, service);
});
