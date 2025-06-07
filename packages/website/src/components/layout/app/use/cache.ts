import { useEffect, useRef, useState } from 'react';
import { CacheController } from '../../../../libraries';

/** 数据表名 */
const CacheName = 'cache';

/** 缓存钩子 */
export function useCache() {
  const cache = useRef<CacheController>(null);
  const [cacheMethod, setCacheMethod] = useState<Pick<CacheController, 'get' | 'set'>>();

  useEffect(() => {
    cache.current = new CacheController(CacheName);
    setCacheMethod({
      get: cache.current.get.bind(cache.current),
      set: cache.current.set.bind(cache.current),
    });
  }, []);

  return cacheMethod;
}
