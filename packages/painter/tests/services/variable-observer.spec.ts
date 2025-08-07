import { renderHook } from '@circuit/test-toolkit';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VARIABLE_OBSERVER_SERVICE, IVariableObserverService } from '../../src/types';
import { registerPlugin, getPlugin } from '../utils';

describe('变量观察服务', () => {
  registerPlugin('services/variable-observer/register.ts');

  let variableObserver: IVariableObserverService;
  const testSymbol1 = Symbol('test1');
  const testSymbol2 = Symbol('test2');

  beforeEach(async () => {
    variableObserver = await getPlugin(VARIABLE_OBSERVER_SERVICE);
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
      expect(callback).toHaveBeenCalledWith('new value', undefined);
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
    beforeEach(() => {
      variableObserver.set(testSymbol1, 'key1', 'value1');
      variableObserver.set(testSymbol2, 'key1', 'value2');
    });

    it('clear 应该清除所有变量和观察者', () => {
      const callback = vi.fn();
      variableObserver.observe(testSymbol1, 'key1', callback);

      variableObserver.clear();

      expect(variableObserver.get(testSymbol1, 'key1')).toBeUndefined();
      expect(variableObserver.get(testSymbol2, 'key1')).toBeUndefined();

      variableObserver.set(testSymbol1, 'key1', 'new value');
      expect(callback).not.toHaveBeenCalled();
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
      const arr = [1, 2, 3];

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
  });
});
