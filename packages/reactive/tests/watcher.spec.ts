import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Watcher, ReadonlyWatcher } from '../src/watcher';

describe('ReadonlyWatcher 只读状态监听器', () => {
  let watcher: ReadonlyWatcher<number>;

  beforeEach(() => {
    watcher = new ReadonlyWatcher(0);
  });

  afterEach(() => {
    watcher.destroy();
  });

  describe('constructor 构造函数', () => {
    it('应该使用初始值创建实例', () => {
      const watcher = new ReadonlyWatcher(42);
      expect(watcher.data).toBe(42);
      watcher.destroy();
    });
  });

  describe('data 当前值属性', () => {
    it('应该返回当前值', () => {
      expect(watcher.data).toBe(0);
    });
  });

  describe('observe 监听值变化', () => {
    it('当值变化时应该调用回调函数', () => {
      const callback = vi.fn();
      const unsubscribe = watcher.observe(callback);

      // 通过内部方法改变值
      watcher['_setData'](5);

      expect(callback).toHaveBeenCalledWith(5, 0);
      unsubscribe();
    });

    it('当值相同时不应该调用回调函数', () => {
      const callback = vi.fn();
      const unsubscribe = watcher.observe(callback);

      // 设置相同的值
      watcher['_setData'](0);

      expect(callback).not.toHaveBeenCalled();
      unsubscribe();
    });

    it('应该返回取消订阅函数', () => {
      const callback = vi.fn();
      const unsubscribe = watcher.observe(callback);

      unsubscribe();
      watcher['_setData'](5);

      expect(callback).not.toHaveBeenCalled();
    });

    it('_setData 调用几次，回调就应该调用几次，不会有多余的重复调用', () => {
      const callback = vi.fn();
      const unsubscribe = watcher.observe(callback);

      // 第一次调用 _setData
      watcher['_setData'](5);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(5, 0);

      // 第二次调用 _setData
      watcher['_setData'](10);
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(10, 5);

      // 第三次调用 _setData
      watcher['_setData'](15);
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(15, 10);

      // 验证总共只调用了3次
      expect(callback).toHaveBeenCalledTimes(3);

      unsubscribe();
    });

    it('多个 observe 监听时，多次 _setData，每个 observe 都分别调用几次，不会重复', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      const unsubscribe1 = watcher.observe(callback1);
      const unsubscribe2 = watcher.observe(callback2);
      const unsubscribe3 = watcher.observe(callback3);

      // 第一次调用 _setData
      watcher['_setData'](5);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
      expect(callback1).toHaveBeenCalledWith(5, 0);
      expect(callback2).toHaveBeenCalledWith(5, 0);
      expect(callback3).toHaveBeenCalledWith(5, 0);

      // 第二次调用 _setData
      watcher['_setData'](10);
      expect(callback1).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(2);
      expect(callback3).toHaveBeenCalledTimes(2);
      expect(callback1).toHaveBeenCalledWith(10, 5);
      expect(callback2).toHaveBeenCalledWith(10, 5);
      expect(callback3).toHaveBeenCalledWith(10, 5);

      // 第三次调用 _setData
      watcher['_setData'](15);
      expect(callback1).toHaveBeenCalledTimes(3);
      expect(callback2).toHaveBeenCalledTimes(3);
      expect(callback3).toHaveBeenCalledTimes(3);
      expect(callback1).toHaveBeenCalledWith(15, 10);
      expect(callback2).toHaveBeenCalledWith(15, 10);
      expect(callback3).toHaveBeenCalledWith(15, 10);

      // 验证每个监听器总共只调用了3次
      expect(callback1).toHaveBeenCalledTimes(3);
      expect(callback2).toHaveBeenCalledTimes(3);
      expect(callback3).toHaveBeenCalledTimes(3);

      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
    });
  });

  describe('once 一次性订阅', () => {
    it('当值变化时应该解析为下一个值', async () => {
      const promise = watcher.once();

      // 异步改变值
      setTimeout(() => {
        watcher['_setData'](10);
      }, 10);

      const result = await promise;
      expect(result).toBe(10);
    });

    it('应该使用过滤函数过滤值', async () => {
      const promise = watcher.once((value) => value === 5);

      // 先设置一个不符合条件的值
      watcher['_setData'](3);

      // 再设置符合条件的值
      setTimeout(() => {
        watcher['_setData'](5);
      }, 10);

      const result = await promise;
      expect(result).toBe(5);
    });
  });

  describe('computed 创建计算属性', () => {
    it('应该创建计算监听器', () => {
      const computed = watcher.computed((value) => value * 2);

      expect(computed.data).toBe(0);

      watcher['_setData'](5);
      expect(computed.data).toBe(10);

      computed.destroy();
    });

    it('当源值变化时应该更新计算值', () => {
      const computed = watcher.computed((value) => value + 10);

      watcher['_setData'](5);
      expect(computed.data).toBe(15);

      computed.destroy();
    });
  });

  describe('asObservable 转换为标准 Observable', () => {
    it('应该返回发出不同值的 observable', () => {
      const observable = watcher.asObservable();
      const values: number[] = [];

      const subscription = observable.subscribe((value) => {
        values.push(value);
      });

      watcher['_setData'](5);
      watcher['_setData'](5); // 重复值
      watcher['_setData'](10);

      expect(values).toEqual([
        0, 5, 10,
      ]);

      subscription.unsubscribe();
    });
  });

  describe('destroy 销毁监听器', () => {
    it('应该完成所有订阅', () => {
      const callback = vi.fn();
      watcher.observe(callback);

      watcher.destroy();
      watcher['_setData'](5);

      expect(callback).not.toHaveBeenCalled();
    });
  });
});

describe('Watcher 状态监听器', () => {
  let watcher: Watcher<number>;

  beforeEach(() => {
    watcher = new Watcher(0);
  });

  afterEach(() => {
    watcher.destroy();
  });

  describe('constructor 构造函数', () => {
    it('应该使用初始值创建实例', () => {
      const watcher = new Watcher(42);
      expect(watcher.data).toBe(42);
      watcher.destroy();
    });
  });

  describe('setData 设置新值', () => {
    it('应该更新数据值', () => {
      watcher.setData(10);
      expect(watcher.data).toBe(10);
    });

    it('应该触发观察者', () => {
      const callback = vi.fn();
      const unsubscribe = watcher.observe(callback);

      watcher.setData(10);
      expect(callback).toHaveBeenCalledWith(10, 0);

      unsubscribe();
    });

    it('对于相同值不应该触发观察者', () => {
      const callback = vi.fn();
      const unsubscribe = watcher.observe(callback);

      watcher.setData(0);
      expect(callback).not.toHaveBeenCalled();

      unsubscribe();
    });
  });

  describe('inheritance 继承关系', () => {
    it('应该继承自 ReadonlyWatcher', () => {
      expect(watcher).toBeInstanceOf(ReadonlyWatcher);
    });

    it('应该拥有所有 ReadonlyWatcher 方法', () => {
      expect(typeof watcher.observe).toBe('function');
      expect(typeof watcher.once).toBe('function');
      expect(typeof watcher.computed).toBe('function');
      expect(typeof watcher.asObservable).toBe('function');
      expect(typeof watcher.destroy).toBe('function');
    });
  });
});
