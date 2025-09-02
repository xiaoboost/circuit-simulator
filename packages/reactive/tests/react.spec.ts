import { renderHook, act } from '@circuit/test-toolkit';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useWatcher, useArrayWatcher, useObjectWatcher } from '../src/react';
import { Watcher, ReadonlyWatcher } from '../src/watcher';

describe('useWatcher 监听器钩子', () => {
  describe('with Watcher 与可写监听器', () => {
    let watcher: Watcher<number>;

    beforeEach(() => {
      watcher = new Watcher(0);
    });

    afterEach(() => {
      watcher.destroy();
    });

    it('应该返回当前值和设置器', () => {
      const { result } = renderHook(() => useWatcher(watcher));

      expect(result.current[0]).toBe(0);
      expect(typeof result.current[1]).toBe('function');
    });

    it('当调用设置器时应该更新值', () => {
      const { result } = renderHook(() => useWatcher(watcher));

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
      expect(watcher.data).toBe(42);
    });

    it('当监听器数据外部变化时应该更新', () => {
      const { result } = renderHook(() => useWatcher(watcher));

      act(() => {
        watcher.setData(100);
      });

      expect(result.current[0]).toBe(100);
    });
  });

  describe('with ReadonlyWatcher 与只读监听器', () => {
    let watcher: ReadonlyWatcher<number>;

    beforeEach(() => {
      watcher = new ReadonlyWatcher(0);
    });

    afterEach(() => {
      watcher.destroy();
    });

    it('应该只返回当前值', () => {
      const { result } = renderHook(() => useWatcher(watcher));

      expect(result.current[0]).toBe(0);
      expect(result.current).toHaveLength(1);
    });

    it('当监听器数据外部变化时应该更新', () => {
      const { result } = renderHook(() => useWatcher(watcher));

      act(() => {
        watcher['_setData'](50);
      });

      expect(result.current[0]).toBe(50);
    });
  });
});

describe('useArrayWatcher 数组监听器钩子', () => {
  let watcher: Watcher<number[]>;

  beforeEach(() => {
    watcher = new Watcher([
      1, 2, 3,
    ]);
  });

  afterEach(() => {
    watcher.destroy();
  });

  it('应该返回数组和操作函数', () => {
    const { result } = renderHook(() => useArrayWatcher(watcher));

    expect(result.current[0]).toEqual([
      1, 2, 3,
    ]);
    expect(typeof result.current[1].push).toBe('function');
    expect(typeof result.current[1].pop).toBe('function');
    expect(typeof result.current[1].shift).toBe('function');
    expect(typeof result.current[1].unshift).toBe('function');
    expect(typeof result.current[1].splice).toBe('function');
    expect(typeof result.current[1].remove).toBe('function');
    expect(typeof result.current[1].update).toBe('function');
    expect(typeof result.current[1].clear).toBe('function');
    expect(typeof result.current[1].map).toBe('function');
    expect(typeof result.current[1].filter).toBe('function');
    expect(typeof result.current[1].sort).toBe('function');
  });

  it('应该添加项目到数组末尾', () => {
    const { result } = renderHook(() => useArrayWatcher(watcher));

    act(() => {
      result.current[1].push(4, 5);
    });

    expect(result.current[0]).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it('应该从数组末尾移除项目', () => {
    const { result } = renderHook(() => useArrayWatcher(watcher));

    act(() => {
      result.current[1].pop();
    });

    expect(result.current[0]).toEqual([1, 2]);
  });

  it('应该清空数组', () => {
    const { result } = renderHook(() => useArrayWatcher(watcher));

    act(() => {
      result.current[1].clear();
    });

    expect(result.current[0]).toEqual([]);
  });

  it('应该从数组开头移除项目', () => {
    const { result } = renderHook(() => useArrayWatcher(watcher));

    act(() => {
      result.current[1].shift();
    });

    expect(result.current[0]).toEqual([2, 3]);
  });

  it('应该在数组开头添加项目', () => {
    const { result } = renderHook(() => useArrayWatcher(watcher));

    act(() => {
      result.current[1].unshift(0, -1);
    });

    expect(result.current[0]).toEqual([
      0, -1, 1, 2, 3,
    ]);
  });

  it('应该拼接数组', () => {
    const { result } = renderHook(() => useArrayWatcher(watcher));

    act(() => {
      result.current[1].splice(1, 1, 10);
    });

    expect(result.current[0]).toEqual([
      1, 10, 3,
    ]);
  });

  it('应该根据索引移除项目', () => {
    const { result } = renderHook(() => useArrayWatcher(watcher));

    act(() => {
      result.current[1].remove(1);
    });

    expect(result.current[0]).toEqual([1, 3]);
  });

  it('应该根据索引更新项目', () => {
    const { result } = renderHook(() => useArrayWatcher(watcher));

    act(() => {
      result.current[1].update(1, 20);
    });

    expect(result.current[0]).toEqual([
      1, 20, 3,
    ]);
  });

  it('当索引超出范围时不应该更新', () => {
    const { result } = renderHook(() => useArrayWatcher(watcher));

    act(() => {
      result.current[1].update(10, 100);
    });

    expect(result.current[0]).toEqual([
      1, 2, 3,
    ]);
  });

  it('应该映射数组', () => {
    const { result } = renderHook(() => useArrayWatcher(watcher));

    act(() => {
      result.current[1].map((item, index) => item * 2 + index);
    });

    expect(result.current[0]).toEqual([
      2, 5, 8,
    ]); // 1*2+0, 2*2+1, 3*2+2
  });

  it('应该过滤数组', () => {
    const { result } = renderHook(() => useArrayWatcher(watcher));

    act(() => {
      result.current[1].filter((item) => item > 1);
    });

    expect(result.current[0]).toEqual([2, 3]);
  });

  it('应该排序数组', () => {
    const { result } = renderHook(() => useArrayWatcher(new Watcher([
      3, 1, 2,
    ])));

    act(() => {
      result.current[1].sort();
    });

    expect(result.current[0]).toEqual([
      1, 2, 3,
    ]);
  });

  it('应该使用自定义比较器排序数组', () => {
    const { result } = renderHook(() => useArrayWatcher(new Watcher([
      1, 2, 3,
    ])));

    act(() => {
      result.current[1].sort((a, b) => b - a);
    });

    expect(result.current[0]).toEqual([
      3, 2, 1,
    ]);
  });
});

describe('useObjectWatcher 对象监听器钩子', () => {
  let watcher: Watcher<{ name: string; age: number; city?: string }>;

  beforeEach(() => {
    watcher = new Watcher({ name: 'John', age: 25 });
  });

  afterEach(() => {
    watcher.destroy();
  });

  it('应该返回对象和操作函数', () => {
    const { result } = renderHook(() => useObjectWatcher(watcher));

    expect(result.current[0]).toEqual({ name: 'John', age: 25 });
    expect(typeof result.current[1].set).toBe('function');
    expect(typeof result.current[1].setAll).toBe('function');
    expect(typeof result.current[1].remove).toBe('function');
    expect(typeof result.current[1].clear).toBe('function');
    expect(typeof result.current[1].merge).toBe('function');
  });

  it('应该设置属性', () => {
    const { result } = renderHook(() => useObjectWatcher(watcher));

    act(() => {
      result.current[1].set('age', 30);
    });

    expect(result.current[0]).toEqual({ name: 'John', age: 30 });
  });

  it('应该设置多个属性', () => {
    const { result } = renderHook(() => useObjectWatcher(watcher));

    act(() => {
      result.current[1].setAll({ age: 30 });
    });

    expect(result.current[0]).toEqual({ name: 'John', age: 30 });
  });

  it('应该清空对象', () => {
    const { result } = renderHook(() => useObjectWatcher(watcher));

    act(() => {
      result.current[1].clear();
    });

    expect(result.current[0]).toEqual({});
  });

  it('应该移除属性', () => {
    const { result } = renderHook(() => useObjectWatcher(watcher));

    act(() => {
      result.current[1].remove('age');
    });

    expect(result.current[0]).toEqual({ name: 'John' });
  });

  it('应该合并对象', () => {
    const { result } = renderHook(() => useObjectWatcher(watcher));

    act(() => {
      result.current[1].merge({ age: 30, city: 'New York' });
    });

    expect(result.current[0]).toEqual({
      name: 'John',
      age: 30,
      city: 'New York',
    });
  });
});
