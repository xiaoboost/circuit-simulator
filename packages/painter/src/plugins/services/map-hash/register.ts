import { definePlugin, IMapHashService } from '@circuit/contracts/painter';
import { createMapHashService } from './factory';

definePlugin(({ registerService }) => {
  const service = createMapHashService(new Map());

  // 注册图纸服务
  registerService(IMapHashService, service);
});
