import { IStreamService, definePlugin } from '@circuit/contracts/global';
import { EventStream } from '@circuit/reactive';

definePlugin(({ registerService }) => {
  const map = new Map<symbol, EventStream<any>>();
  const service: IStreamService = {
    get(key) {
      if (map.has(key)) {
        return map.get(key)!;
      }

      const stream = new EventStream<any>();
      map.set(key, stream);
      return stream;
    },
    clear() {
      for (const stream of map.values()) {
        stream.destroy();
      }

      map.clear();
    },
  };

  // 注册事件流服务
  registerService(IStreamService, service);

  // 卸载器
  return () => {
    service.clear();
  };
});
