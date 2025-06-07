import { definePlugin } from '../../../context';
import { CACHE_SERVICE, ICacheService } from '../../../types';

definePlugin(({ registerService }) => {
  // 真正的初始化在`usePainterAdapter`钩子函数里
  const service: ICacheService = {
    set: () => Promise.resolve(),
    get: () => Promise.resolve(undefined),
  };

  // 注册缓存服务
  registerService(CACHE_SERVICE, service);
});
