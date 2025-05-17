import { useEffect, useState } from 'react';
import { definePlugin, usePainterService } from '../../../context';
import { VARIABLE_OBSERVER_SERVICE, IVariableObserverService, ObserverCb } from '../../../types';

definePlugin(({ registerService }) => {
  const variableMap = new Map<symbol, Map<string, any>>();
  const observerMap = new Map<symbol, Map<string, ObserverCb[]>>();
  const service: IVariableObserverService = {
    clear() {
      this.unObserve();
      variableMap.clear();
      observerMap.clear();
    },
    get(symbol, key) {
      return variableMap.get(symbol)?.get(key);
    },
    set(symbol, key, newVal) {
      const oldVal = this.get(symbol, key);

      if (oldVal !== newVal) {
        variableMap.get(symbol)?.set(key, newVal);
        observerMap.get(symbol)?.get(key)?.forEach(cb => cb(newVal, oldVal));
      }
    },
    observe(symbol, key, callback) {
      const observer = observerMap.get(symbol) ?? new Map();

      if (!observerMap.has(symbol)) {
        observerMap.set(symbol, observer);
      }

      observer.set(key, [...(observer.get(key) ?? []), callback]);

      return () => {
        this.unObserve(symbol, key, callback as any);
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
      const index = cbList.indexOf(callback as any);

      if (index !== -1) {
        cbList.splice(index, 1);
      }
    },
    useVariable(symbol, key) {
      const service = usePainterService(VARIABLE_OBSERVER_SERVICE);
      const [value, setValue] = useState(service.get(symbol, key));

      useEffect(() => {
        return service.observe(symbol, key, setValue);
      }, [symbol, key]);

      return value as any;
    },
  };

  // 注册变量服务
  registerService(VARIABLE_OBSERVER_SERVICE, service);
});
