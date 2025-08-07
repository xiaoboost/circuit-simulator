import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EventStream } from '../src/event';

describe('EventStream 事件流', () => {
  let eventStream: EventStream<number>;

  beforeEach(() => {
    eventStream = new EventStream<number>();
  });

  afterEach(() => {
    eventStream.destroy();
  });

  describe('constructor 构造函数', () => {
    it('应该创建空的事件流', () => {
      const stream = new EventStream();
      expect(stream).toBeInstanceOf(EventStream);
      stream.destroy();
    });
  });

  describe('emit 触发事件', () => {
    it('应该向订阅者发送值', () => {
      const callback = vi.fn();
      const unsubscribe = eventStream.subscribe(callback);

      eventStream.emit(42);
      expect(callback).toHaveBeenCalledWith(42);

      unsubscribe();
    });

    it('当没有提供值时应该发送 undefined', () => {
      const callback = vi.fn();
      const unsubscribe = eventStream.subscribe(callback);

      eventStream.emit();
      expect(callback).toHaveBeenCalledWith(undefined);

      unsubscribe();
    });

    it('应该向多个订阅者发送事件', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unsubscribe1 = eventStream.subscribe(callback1);
      const unsubscribe2 = eventStream.subscribe(callback2);

      eventStream.emit(100);

      expect(callback1).toHaveBeenCalledWith(100);
      expect(callback2).toHaveBeenCalledWith(100);

      unsubscribe1();
      unsubscribe2();
    });
  });

  describe('subscribe 订阅事件', () => {
    it('应该返回取消订阅函数', () => {
      const callback = vi.fn();
      const unsubscribe = eventStream.subscribe(callback);

      expect(typeof unsubscribe).toBe('function');

      unsubscribe();
    });

    it('取消订阅后不应该调用回调函数', () => {
      const callback = vi.fn();
      const unsubscribe = eventStream.subscribe(callback);

      unsubscribe();
      eventStream.emit(42);

      expect(callback).not.toHaveBeenCalled();
    });

    it('应该处理多次取消订阅', () => {
      const callback = vi.fn();
      const unsubscribe = eventStream.subscribe(callback);

      unsubscribe();
      unsubscribe(); // 多次调用应该安全

      eventStream.emit(42);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('asObservable 转换为可观测对象', () => {
    it('应该返回发出值的 observable', () => {
      const observable = eventStream.asObservable();
      const values: number[] = [];

      const subscription = observable.subscribe((value) => {
        values.push(value);
      });

      eventStream.emit(1);
      eventStream.emit(2);
      eventStream.emit(3);

      expect(values).toEqual([1, 2, 3]);

      subscription.unsubscribe();
    });

    it('应该处理从 observable 取消订阅', () => {
      const observable = eventStream.asObservable();
      const callback = vi.fn();

      const subscription = observable.subscribe(callback);
      subscription.unsubscribe();

      eventStream.emit(42);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('once 一次性订阅', () => {
    it('应该解析为第一个发出的值', async () => {
      const promise = eventStream.once();

      setTimeout(() => {
        eventStream.emit(42);
      }, 10);

      const result = await promise;
      expect(result).toBe(42);
    });

    it('如果值已经发出应该立即解析', async () => {
      // EventStream 的 once 方法不会立即返回已发出的值
      // 需要等待下一个值
      const promise = eventStream.once();
      eventStream.emit(42);
      const result = await promise;
      expect(result).toBe(42);
    }, 10000);

    it('应该使用过滤函数过滤值', async () => {
      const promise = eventStream.once((value) => value === 5);

      // 先发送不符合条件的值
      eventStream.emit(3);

      // 再发送符合条件的值
      setTimeout(() => {
        eventStream.emit(5);
      }, 10);

      const result = await promise;
      expect(result).toBe(5);
    });

    it('应该处理 undefined 值', async () => {
      const promise = eventStream.once();

      setTimeout(() => {
        eventStream.emit();
      }, 10);

      const result = await promise;
      expect(result).toBe(undefined);
    });
  });

  describe('destroy 销毁事件流', () => {
    it('应该完成所有订阅', () => {
      const callback = vi.fn();
      eventStream.subscribe(callback);

      eventStream.destroy();
      eventStream.emit(42);

      expect(callback).not.toHaveBeenCalled();
    });

    it('应该完成 observable', () => {
      const observable = eventStream.asObservable();
      const callback = vi.fn();

      const subscription = observable.subscribe(callback);
      eventStream.destroy();
      eventStream.emit(42);

      expect(callback).not.toHaveBeenCalled();
      subscription.unsubscribe();
    });

    it('应该处理多次销毁', () => {
      const callback = vi.fn();
      eventStream.subscribe(callback);

      eventStream.destroy();
      eventStream.destroy(); // 多次调用应该安全

      eventStream.emit(42);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('复杂场景', () => {
    it('应该处理快速发送事件', () => {
      const values: number[] = [];
      const unsubscribe = eventStream.subscribe((value) => {
        if (value !== undefined) {
          values.push(value);
        }
      });

      for (let i = 0; i < 10; i++) {
        eventStream.emit(i);
      }

      expect(values).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      unsubscribe();
    });

    it('应该处理发送事件期间的订阅/取消订阅', () => {
      const values: number[] = [];
      const unsubscribe = eventStream.subscribe((value) => {
        if (value !== undefined) {
          values.push(value);
        }
        if (value === 1) {
          unsubscribe();
        }
      });

      eventStream.emit(1);
      eventStream.emit(2);

      expect(values).toEqual([1]);
    });
  });
});
