import {
  ILoggerService,
  IStateCoreService,
  ILifeCycleHook,
} from '@circuit/shared';
import { definePlugin } from '../../../context';
import {
  ICollisionService,
  IMapHashMarkService,
  IConnectionService,
} from '../../../types';

const LoggerName = '画布';

definePlugin(({ registerHook, getService }) => {
  // 画布初始化
  registerHook(ILifeCycleHook, {
    afterPluginInit() {
      const { state: { data } } = getService(IStateCoreService);
      const logger = getService(ILoggerService);

      if (data.lines.length === 0 && data.parts.length === 0) {
        logger.info(LoggerName, '初始化数据为空，跳过初始化');
        return;
      }

      const mapHashService = getService(IMapHashMarkService);
      const collisionService = getService(ICollisionService);
      const connectionService = getService(IConnectionService);

      // 初始化碰撞系统
      collisionService.createFromData(data);
      // 初始化图纸标记
      mapHashService.createFromData(data);
      // 初始化连接关系
      connectionService.createFromData(data);
      // 完成日志
      logger.info(LoggerName, '初始化完成');

      // 延迟到下一帧
      return Promise.resolve();
    },
  });
});
