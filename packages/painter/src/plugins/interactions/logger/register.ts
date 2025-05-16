import { Colors } from '@circuit/shared';
import { definePlugin } from '../../../context';
import {
  LOGGER_SERVICE,
  CONFIGURATION_SERVICE,
  ILoggerService,
} from '../../../types';

const getLoggerStyle = (color: string) => {
  // eslint-disable-next-line
  return `color: white; font-style: normal; background-color: ${color}; border-radius: 4px; padding: 2px`;
};

definePlugin(({ registerService, getService }) => {
  const isDebugMode = () => getService(CONFIGURATION_SERVICE).debuggerMode.data;
  const service: ILoggerService = {
    debug(name, ...messages) {
      if (isDebugMode()) {
        console.debug(`%c[Debug] [${name}]`, getLoggerStyle(Colors.Info.toString()), ...messages);
      }
    },
    info(name, ...messages) {
      console.info(`%c[Info] [${name}]`, getLoggerStyle(Colors.Primary.toString()), ...messages);
    },
    warn(name, ...messages) {
      console.warn(`%c[Warn] [${name}]`, getLoggerStyle(Colors.Warning.toString()), ...messages);
    },
    error(name, ...messages) {
      console.error(`%c[Error] [${name}]`, getLoggerStyle(Colors.Danger.toString()), ...messages);
    },
  };

  // 注册日志服务
  registerService(LOGGER_SERVICE, service);
});
