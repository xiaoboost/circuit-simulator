import { MarkMap } from '@circuit/map';
import { definePlugin } from '../../../context';
import { MAP_MARK_SERVICE_KEY } from '../../../types';

definePlugin(({ registerService }) => {
  const service = new MarkMap();

  // 注册图纸标记服务
  registerService(MAP_MARK_SERVICE_KEY, service);

  // 卸载器
  return () => {
    service.clear();
  };
});
