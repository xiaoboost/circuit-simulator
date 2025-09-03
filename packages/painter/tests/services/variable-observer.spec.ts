import { renderHook } from '@circuit/test-toolkit';
import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { IVariableObserverService, IVariableObserverService } from '../../src/types';
import { registerPlugin, getPlugin } from '../utils';

describe('变量观察服务', () => {
  registerPlugin('services/variable-observer/register.ts');

  let variableObserver: IVariableObserverService;
  const testSymbol1 = Symbol('test1');
  const testSymbol2 = Symbol('test2');

  beforeAll(async () => {
    variableObserver = await getPlugin(IVariableObserverService);
  });

  beforeEach(() => {
    variableObserver.clear();
  });

  describe('基本设置和获取', () => {
    it('应该能够设置和获取默认键的变量', () => {
      variableObserver.set(testSymbol1, 'test value');
      expect(variableObserver.get(testSymbol1)).toBe('test value');
    });

    it('应该能够设置和获取指定键的变量', () => {
      variableObserver.set(testSymbol1, 'customKey', 'custom value');
      expect(variableObserver.get(testSymbol1, 'customKey')).toBe('custom value');
    });

    it('应该能够批量设置变量', () => {
      variableObserver.set(testSymbol1, [
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]);
      expect(variableObserver.get(testSymbol1, 'key1')).toBe('value1');
      expect(variableObserver.get(testSymbol1, 'key2')).toBe('value2');
    });

    it('获取不存在的变量应该返回 undefined', () => {
      expect(variableObserver.get(testSymbol1)).toBeUndefined();
      expect(variableObserver.get(testSymbol1, 'nonexistent')).toBeUndefined();
    });

    it('不同 symbol 的变量应该独立存储', () => {
      variableObserver.set(testSymbol1, 'sameKey', 'value1');
      variableObserver.set(testSymbol2, 'sameKey', 'value2');
      expect(variableObserver.get(testSymbol1, 'sameKey')).toBe('value1');
      expect(variableObserver.get(testSymbol2, 'sameKey')).toBe('value2');
    });
  });

  describe('变量观察', () => {
    it('应该能够观察变量变化', () => {
      const callback = vi.fn();
      variableObserver.observe(testSymbol1, 'testKey', callback);
      variableObserver.set(testSymbol1, 'testKey', 'new value');
      expect(callback).toHaveBeenCalledWith('new value', undefined);
    });

    it('应该能够观察默认键的变量变化', () => {
      const callback = vi.fn();
      variableObserver.observe(testSymbol1, callback);
      variableObserver.set(testSymbol1, 'new value');
      variableObserver.set(testSymbol1, 'new value22');
      expect(callback).toHaveBeenCalledWith('new value22', 'new value');
    });

    it('相同值不应该触发回调', () => {
      const callback = vi.fn();
      variableObserver.set(testSymbol1, 'testKey', 'initial value');
      variableObserver.observe(testSymbol1, 'testKey', callback);
      variableObserver.set(testSymbol1, 'testKey', 'initial value');
      expect(callback).not.toHaveBeenCalled();
    });

    it('应该能够添加多个观察者', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      variableObserver.observe(testSymbol1, 'testKey', callback1);
      variableObserver.observe(testSymbol1, 'testKey', callback2);

      variableObserver.set(testSymbol1, 'testKey', 'new value');
      expect(callback1).toHaveBeenCalledWith('new value', undefined);
      expect(callback2).toHaveBeenCalledWith('new value', undefined);
    });

    it('observe 应该返回取消观察的函数', () => {
      const callback = vi.fn();
      const unsubscribe = variableObserver.observe(testSymbol1, 'testKey', callback);

      variableObserver.set(testSymbol1, 'testKey', 'value1');
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
      variableObserver.set(testSymbol1, 'testKey', 'value2');
      expect(callback).toHaveBeenCalledTimes(1); // 不应该再被调用
    });

    it('observe 不指定 key 时应该返回取消观察的函数', () => {
      const callback = vi.fn();
      const unsubscribe = variableObserver.observe(testSymbol1, callback);

      variableObserver.set(testSymbol1, 'value1');
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
      variableObserver.set(testSymbol1, 'value2');
      expect(callback).toHaveBeenCalledTimes(1); // 不应该再被调用
    });

    it('observe 不指定 key 时应该返回取消观察的函数', () => {
      const callback = vi.fn();
      const unsubscribe = variableObserver.observe(testSymbol1, callback);

      variableObserver.set(testSymbol1, 'value1');
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
      variableObserver.set(testSymbol1, 'value2');
      expect(callback).toHaveBeenCalledTimes(1); // 不应该再被调用
    });

    it('设置 undefined 应该正确设置值', () => {
      const callback = vi.fn();
      variableObserver.observe(testSymbol1, 'testKey', callback);
      variableObserver.set(testSymbol1, 'testKey', 'test value');
      variableObserver.set(testSymbol1, 'testKey', undefined);
      expect(callback).toHaveBeenCalledWith(undefined, 'test value');
    });
  });

  describe('取消观察', () => {
    beforeEach(() => {
      variableObserver.set(testSymbol1, 'key1', 'value1');
      variableObserver.set(testSymbol1, 'key2', 'value2');
      variableObserver.set(testSymbol2, 'key1', 'value3');
    });

    it('应该能够取消特定回调的观察', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      variableObserver.observe(testSymbol1, 'key1', callback1);
      variableObserver.observe(testSymbol1, 'key1', callback2);

      variableObserver.unObserve(testSymbol1, 'key1', callback1);
      variableObserver.set(testSymbol1, 'key1', 'new value');

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith('new value', 'value1');
    });

    it('应该能够取消特定键的所有观察', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      variableObserver.observe(testSymbol1, 'key1', callback1);
      variableObserver.observe(testSymbol1, 'key2', callback2);

      variableObserver.unObserve(testSymbol1, 'key1');
      variableObserver.set(testSymbol1, 'key1', 'new value');
      variableObserver.set(testSymbol1, 'key2', 'new value');

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith('new value', 'value2');
    });

    it('应该能够取消特定 symbol 的所有观察', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      variableObserver.observe(testSymbol1, 'key1', callback1);
      variableObserver.observe(testSymbol2, 'key1', callback2);

      variableObserver.unObserve(testSymbol1);
      variableObserver.set(testSymbol1, 'key1', 'new value');
      variableObserver.set(testSymbol2, 'key1', 'new value');

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith('new value', 'value3');
    });

    it('应该能够取消所有观察', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      variableObserver.observe(testSymbol1, 'key1', callback1);
      variableObserver.observe(testSymbol2, 'key1', callback2);

      variableObserver.unObserve();
      variableObserver.set(testSymbol1, 'key1', 'new value');
      variableObserver.set(testSymbol2, 'key1', 'new value');

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
  });

  describe('清除功能', () => {
    // 不在 beforeEach 中设置变量，让每个测试自己设置

    it('clear 应该清除所有变量和观察者', () => {
      const callback = vi.fn();

      // 设置变量
      variableObserver.set(testSymbol1, 'key1', 'value1');
      variableObserver.set(testSymbol2, 'key1', 'value2');

      variableObserver.observe(testSymbol1, 'key1', callback);

      variableObserver.clear();

      expect(variableObserver.get(testSymbol1, 'key1')).toBeUndefined();
      expect(variableObserver.get(testSymbol2, 'key1')).toBeUndefined();

      variableObserver.set(testSymbol1, 'key1', 'new value');
      expect(callback).not.toHaveBeenCalled();
    });

    it('clearVariable(false) 不触发观察者回调', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      // 设置变量
      variableObserver.set(testSymbol1, 'key1', 'value1');
      variableObserver.set(testSymbol1, 'key2', 'value2');

      variableObserver.observe(testSymbol1, 'key1', callback1);
      variableObserver.observe(testSymbol1, 'key2', callback2);

      // 清除变量，默认不触发观察者回调
      variableObserver.clearVariable(false);

      expect(variableObserver.get(testSymbol1, 'key1')).toBeUndefined();
      expect(variableObserver.get(testSymbol1, 'key2')).toBeUndefined();

      // 观察者应该还在，设置新值时会触发回调
      variableObserver.set(testSymbol1, 'key1', 'new value');
      expect(callback1).toHaveBeenCalledWith('new value', undefined);

      // 验证 callback2 没有被意外触发
      expect(callback2).toHaveBeenCalledTimes(0);

      // 设置 key2 的新值，验证观察者仍然工作
      variableObserver.set(testSymbol1, 'key2', 'new value2');
      expect(callback2).toHaveBeenCalledWith('new value2', undefined);
    });

    it('clearVariable() 默认应该触发所有观察者回调', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      // 设置变量
      variableObserver.set(testSymbol1, 'key1', 'value1');
      variableObserver.set(testSymbol1, 'key2', 'value2');
      variableObserver.set(testSymbol2, 'key1', 'value3');

      variableObserver.observe(testSymbol1, 'key1', callback1);
      variableObserver.observe(testSymbol1, 'key2', callback2);
      variableObserver.observe(testSymbol2, 'key1', callback3);

      // 触发观察者回调
      variableObserver.clearVariable();

      expect(variableObserver.get(testSymbol1, 'key1')).toBeUndefined();
      expect(variableObserver.get(testSymbol1, 'key2')).toBeUndefined();
      expect(variableObserver.get(testSymbol2, 'key1')).toBeUndefined();

      // 应该触发所有观察者回调，通知变量被清除
      expect(callback1).toHaveBeenCalledWith(undefined, 'value1');
      expect(callback2).toHaveBeenCalledWith(undefined, 'value2');
      expect(callback3).toHaveBeenCalledWith(undefined, 'value3');

      // 观察者应该还在，设置新值时会触发回调
      variableObserver.set(testSymbol1, 'key1', 'new value');
      expect(callback1).toHaveBeenCalledWith('new value', undefined);
    });

    it('clearVariable 应该正确处理嵌套的 Map 结构', () => {
      // 测试多个 symbol 和多个 key 的情况
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      // 设置变量
      variableObserver.set(testSymbol1, 'key1', 'value1');
      variableObserver.set(testSymbol1, 'key2', 'value2');
      variableObserver.set(testSymbol2, 'key1', 'value3');

      variableObserver.observe(testSymbol1, 'key1', callback1);
      variableObserver.observe(testSymbol1, 'key2', callback2);
      variableObserver.observe(testSymbol2, 'key1', callback3);

      variableObserver.clearVariable(true);

      // 验证所有变量都被清除
      expect(variableObserver.get(testSymbol1, 'key1')).toBeUndefined();
      expect(variableObserver.get(testSymbol1, 'key2')).toBeUndefined();
      expect(variableObserver.get(testSymbol2, 'key1')).toBeUndefined();

      // 验证所有观察者都被触发
      expect(callback1).toHaveBeenCalledWith(undefined, 'value1');
      expect(callback2).toHaveBeenCalledWith(undefined, 'value2');
      expect(callback3).toHaveBeenCalledWith(undefined, 'value3');
    });

    it('clearVariable 应该正确处理空变量表的情况', () => {
      // 测试没有变量的情况
      variableObserver.clearVariable();
      expect(variableObserver.get(testSymbol1, 'key1')).toBeUndefined();

      // 测试没有变量的情况下触发观察者
      variableObserver.clearVariable(true);
      // 不应该抛出错误
    });

    it('clearVariable 应该正确处理观察者为空的情况', () => {
      // 设置变量但不添加观察者
      variableObserver.set(testSymbol1, 'key1', 'value1');
      variableObserver.set(testSymbol1, 'key2', 'value2');

      // 应该能正常清除，不会抛出错误
      variableObserver.clearVariable(true);

      expect(variableObserver.get(testSymbol1, 'key1')).toBeUndefined();
      expect(variableObserver.get(testSymbol1, 'key2')).toBeUndefined();
    });
  });

  describe('React Hook 集成', () => {
    it('useVariable 应该返回当前值', () => {
      variableObserver.set(testSymbol1, 'testKey', 'initial value');

      const { result } = renderHook(() => variableObserver.useVariable(testSymbol1, 'testKey'));

      expect(result.current).toBe('initial value');
    });

    it('useVariable 应该使用默认键', () => {
      variableObserver.set(testSymbol1, 'default value');

      const { result } = renderHook(() => variableObserver.useVariable(testSymbol1));

      expect(result.current).toBe('default value');
    });
  });

  describe('边界情况', () => {
    it('应该处理 undefined 和 null 值', () => {
      variableObserver.set(testSymbol1, 'nullKey', null);
      variableObserver.set(testSymbol1, 'undefinedKey', undefined);

      expect(variableObserver.get(testSymbol1, 'nullKey')).toBeNull();
      expect(variableObserver.get(testSymbol1, 'undefinedKey')).toBeUndefined();
    });

    it('应该处理对象和数组值', () => {
      const obj = { test: 'value' };
      const arr = [
        1, 2, 3,
      ];

      variableObserver.set(testSymbol1, 'objKey', obj);
      variableObserver.set(testSymbol1, 'arrKey', arr);

      expect(variableObserver.get(testSymbol1, 'objKey')).toBe(obj);
      expect(variableObserver.get(testSymbol1, 'arrKey')).toBe(arr);
    });

    it('应该处理重复设置相同值', () => {
      const callback = vi.fn();
      variableObserver.set(testSymbol1, 'testKey', 'value');
      variableObserver.observe(testSymbol1, 'testKey', callback);

      variableObserver.set(testSymbol1, 'testKey', 'value'); // 相同值
      expect(callback).not.toHaveBeenCalled();

      variableObserver.set(testSymbol1, 'testKey', 'new value'); // 不同值
      expect(callback).toHaveBeenCalledWith('new value', 'value');
    });

    it('应该正确处理批量设置的边界情况', () => {
      const callback = vi.fn();
      variableObserver.observe(testSymbol1, 'key1', callback);

      // 测试空数组
      variableObserver.set(testSymbol1, []);
      expect(variableObserver.get(testSymbol1, 'key1')).toBeUndefined();

      // 测试无效的数组项
      variableObserver.set(testSymbol1, [
        ['key1', 'value1'],
        ['key2'], // 缺少值
        ['key3', 'value3'],
      ]);

      expect(variableObserver.get(testSymbol1, 'key1')).toBe('value1');
      expect(variableObserver.get(testSymbol1, 'key2')).toBeUndefined();
      expect(variableObserver.get(testSymbol1, 'key3')).toBe('value3');
    });
  });
});
