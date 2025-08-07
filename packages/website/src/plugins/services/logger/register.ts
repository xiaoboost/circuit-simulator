import {
  LOGGER_SERVICE,
  CONFIGURATION_SERVICE,
  ILoggerService,
  Message,
} from '@circuit/shared';
import { definePlugin } from '../../../context';

const getLoggerStyle = (color: string) => {
  // eslint-disable-next-line
  return `color: white; font-style: normal; background-color: ${color}; border-radius: 4px; padding: 2px`;
};

definePlugin(({ registerService, getService }) => {
  const isDebugMode = () => getService(CONFIGURATION_SERVICE).openDebugLog.data;
  const getMessage = (messages: Message[]) => {
    return messages.map((message) => {
      return typeof message === 'function' ? message() : message;
    });
  };

  let lastLogKey: string | undefined;

  const service: ILoggerService = {
    debug(name, ...messages) {
      if (isDebugMode()) {
        const realMessages = getMessage(messages);
        // 生成日志的唯一标识
        const logKey = `${name}:${realMessages.join(' ')}`;

        // 重复的不打印
        if (lastLogKey === logKey) {
          return;
        }

        lastLogKey = logKey;
        console.info(`%c[Debug] [${name}]`, getLoggerStyle('CornflowerBlue'), ...realMessages);
      }
    },
    info(name, ...messages) {
      console.info(`%c[Info] [${name}]`, getLoggerStyle('Silver'), ...getMessage(messages));
    },
    warn(name, ...messages) {
      console.warn(`%c[Warn] [${name}]`, getLoggerStyle('LightCoral'), ...getMessage(messages));
    },
    error(name, ...messages) {
      console.error(`%c[Error] [${name}]`, getLoggerStyle('Tomato'), ...getMessage(messages));
    },
  };

  // 注册日志服务
  registerService(LOGGER_SERVICE, service);
});
