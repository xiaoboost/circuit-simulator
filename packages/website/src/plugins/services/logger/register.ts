import {
  LOGGER_SERVICE,
  CONFIGURATION_SERVICE,
  ILoggerService,
} from '@circuit/shared';
import { definePlugin } from '../../../context';

const getLoggerStyle = (color: string) => {
  // eslint-disable-next-line
  return `color: white; font-style: normal; background-color: ${color}; border-radius: 4px; padding: 2px`;
};

definePlugin(({ registerService, getService }) => {
  const isDebugMode = () => getService(CONFIGURATION_SERVICE).openDebugLog.data;
  const service: ILoggerService = {
    debug(name, ...messages) {
      if (isDebugMode()) {
        console.info(`%c[Debug] [${name}]`, getLoggerStyle('CornflowerBlue'), ...messages);
      }
    },
    info(name, ...messages) {
      console.info(`%c[Info] [${name}]`, getLoggerStyle('Silver'), ...messages);
    },
    warn(name, ...messages) {
      console.warn(`%c[Warn] [${name}]`, getLoggerStyle('LightCoral'), ...messages);
    },
    error(name, ...messages) {
      console.error(`%c[Error] [${name}]`, getLoggerStyle('Tomato'), ...messages);
    },
  };

  // 注册日志服务
  registerService(LOGGER_SERVICE, service);
});
