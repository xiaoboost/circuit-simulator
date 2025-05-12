import { MarkMap } from '@circuit/map';
import { definePlugin } from '../../../context';
import { MAP_SERVICE_KEY, LIFE_CYCLE_HOOK, ELECTRONIC_SERVICE_KEY } from '../../../types';

definePlugin(({ registerService, registerHook, getService }) => {
  const service = {
    markService: new MarkMap(),
  };

  // 注册图纸服务
  registerService(MAP_SERVICE_KEY, service);

  // 注册图纸钩子
  registerHook(LIFE_CYCLE_HOOK, {
    // 初始化之前需要先初始化图纸标记
    beforeInit: () => {
      debugger;
      const electronicService = getService(ELECTRONIC_SERVICE_KEY);
      const { parts: { data: parts }, lines: { data: lines } } = electronicService;

      if (parts.length === 0 && lines.length === 0) {
        return;
      }

      // TODO:
    },
  });

  // 卸载器
  return () => {
    service.markService.clear();
  };
});
