import { useEffect, useState } from 'react';
import { definePlugin } from '../../../context';
import { VARIABLE_OBSERVER_SERVICE, IVariableObserverService, ObserverCb } from '../../../types';

const DEFAULT_KEY = '_$default';

definePlugin(({ registerService }) => {
  const variableMap = new Map<symbol, Map<string, any>>();
  const observerMap = new Map<symbol, Map<string, ObserverCb[]>>();

  const service: IVariableObserverService = {
    clear() {
      this.unObserve();
      variableMap.clear();
      observerMap.clear();
    },
    clearVariable(triggerWatcher = true) {
      if (triggerWatcher) {
        // 触发所有观察者，通知变量被清除
        for (const [symbol, keyMap] of variableMap) {
          for (const [key, value] of keyMap) {
            const observers = observerMap.get(symbol)?.get(key);
            if (observers) {
              observers.forEach((callback) => callback(undefined, value));
            }
          }
        }
      }

      variableMap.clear();
    },
    get(symbol, key: string = DEFAULT_KEY) {
      return variableMap.get(symbol)?.get(key);
    },
    set(symbol, key?, newVal?) {
      const setVal = (key: string, val: any) => {
        const valTable = variableMap.get(symbol) ?? new Map();

        if (!variableMap.has(symbol)) {
          variableMap.set(symbol, valTable);
        }

        const oldVal = valTable.get(key);

        if (oldVal !== val) {
          valTable.set(key, val);
          observerMap.get(symbol)?.get(key)?.forEach((cb) => cb(val, oldVal));
        }
      };

      // 首先检查是否是数组（批量设置）
      if (Array.isArray(key)) {
        key.forEach((item) => {
          if (Array.isArray(item) && item.length === 2) {
            setVal(item[0], item[1]);
          }
        });
      }
      // 如果 key 不是字符串，则认为是值
      else if (typeof key !== 'string') {
        setVal(DEFAULT_KEY, key);
      }
      // 如果只有两个参数，且 newVal 是 undefined，说明是 set(symbol, value) 的形式
      else if (arguments.length === 2 && newVal === undefined) {
        setVal(DEFAULT_KEY, key);
      }
      else {
        setVal(key, newVal);
      }
    },
    observe(symbol, key?, callback?) {
      // 如果 key 是函数，说明是 observe(symbol, callback) 的形式
      if (typeof key === 'function') {
        callback = key;
        key = DEFAULT_KEY;
      }

      const observer = observerMap.get(symbol) ?? new Map();

      if (!observerMap.has(symbol)) {
        observerMap.set(symbol, observer);
      }

      const keyStr = key as string;
      const callbackFn = callback as ObserverCb;

      if (!observer.has(keyStr)) {
        observer.set(keyStr, []);
      }

      observer.get(keyStr)!.push(callbackFn);

      return () => {
        service.unObserve(symbol, keyStr, callbackFn);
      };
    },
    unObserve(symbol?, key?, callback?) {
      if (!symbol && !key && !callback) {
        observerMap.clear();
        return;
      }

      if (!key && !callback) {
        observerMap.delete(symbol as symbol);
        return;
      }

      const observer = observerMap.get(symbol as symbol);

      if (!observer) {
        return;
      }

      if (!callback) {
        observer.delete(key as string);
        return;
      }

      const cbList = observer.get(key as string) ?? [];
      const index = cbList.indexOf(callback as ObserverCb);

      if (index !== -1) {
        cbList.splice(index, 1);
      }
    },
    useVariable(symbol, key: string = DEFAULT_KEY) {
      const [value, setValue] = useState(service.get(symbol, key));

      useEffect(() => {
        return service.observe(symbol, key, setValue);
      }, [symbol, key]);

      return value as any;
    },
  };

  // 注册变量服务
  registerService(VARIABLE_OBSERVER_SERVICE, service);

  return () => {
    service.clear();
  };
});
