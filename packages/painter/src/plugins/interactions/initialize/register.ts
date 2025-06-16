import {
  LOGGER_SERVICE,
  STATE_CORE_SERVICE,
  LIFE_CYCLE_HOOK,
} from '@circuit/shared';
import { definePlugin } from '../../../context';
import {
  COLLISION_SERVICE,
  CONNECTION_SERVICE,
  MAP_HASH_SERVICE,
} from '../../../types';

const LoggerName = '画布';

definePlugin(({ registerHook, getService }) => {
  // 画布初始化
  registerHook(LIFE_CYCLE_HOOK, {
    afterPluginInit() {
      const { state: { data } } = getService(STATE_CORE_SERVICE);
      const logger = getService(LOGGER_SERVICE);

      if (data.lines.length === 0 && data.parts.length === 0) {
        logger.info(LoggerName, '初始化数据为空，画布跳过初始化');
        return;
      }

      const { setPartMark, setLineMark } = getService(MAP_HASH_SERVICE);
      const collisionService = getService(COLLISION_SERVICE);
      const connectionService = getService(CONNECTION_SERVICE);

      for (const part of data.parts ?? []) {
        setPartMark(part);
        collisionService.setEntity(part);
      }

      for (const line of data.lines ?? []) {
        setLineMark(line);
        collisionService.setEntity(line);
      }

      // 初始化连接关系
      connectionService.createConnectionFromData(data);
      // 日志
      logger.info(LoggerName, '初始化完成');
      // 延迟到下一帧
      return Promise.resolve();
    },
  });
});
