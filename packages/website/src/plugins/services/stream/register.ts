import { EventStream } from '@circuit/reactive';
import { STREAM_SERVICE, IStreamService } from '@circuit/shared';
import { definePlugin } from '../../../context';

definePlugin(({ registerService }) => {
  const map = new Map<symbol, EventStream<any>>();
  const service: IStreamService = {
    getOrCreateStream(key) {
      if (map.has(key)) {
        return map.get(key)!;
      }

      const stream = new EventStream<any>();
      map.set(key, stream);
      return stream;
    },
    clear() {
      map.clear();
    },
  };

  // 注册事件流服务
  registerService(STREAM_SERVICE, service);

  // 卸载器
  return () => {
    service.clear();
  };
});
