import { definePlugin } from '../../../context';
import { IMapHashService } from '../../../types';
import { createMapHashService } from './factory';

definePlugin(({ registerService }) => {
  const service = createMapHashService(new Map());

  // 注册图纸服务
  registerService(IMapHashService, service);
});
