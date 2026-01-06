import {
  ILoggerService,
  IStateCoreService,
  ILifeCycleHook,
  LifeCycleStage,
} from '@circuit/contracts/global';
import {
  definePlugin,
  ICollisionService,
  IMapHashService,
  IConnectionService,
} from '@circuit/contracts/painter';

const LoggerName = '画布';

definePlugin(({ getService, root }) => {
  root().registerHook(ILifeCycleHook, {
    order: LifeCycleStage.LATE,
    onMounted() {
      const stateCore = getService(IStateCoreService);
      const { data } = stateCore.state;
      const logger = getService(ILoggerService);

      if (data.lines.length === 0 && data.parts.length === 0) {
        logger.info(LoggerName, '初始数据为空，跳过装载');
        return;
      }

      const mapHashService = getService(IMapHashService);
      const collisionService = getService(ICollisionService);
      const connectionService = getService(IConnectionService);

      // 初始化碰撞系统
      collisionService.createFromData(data);
      // 初始化图纸标记
      mapHashService.createFromData(data);
      // 初始化连接关系
      connectionService.createFromData(data);
      // 完成日志
      logger.info(LoggerName, '初始数据装载完成');

      // 延迟到下一帧
      return Promise.resolve();
    },
  });
});
