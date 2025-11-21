import {
  ILoggerService,
  IConfigurationService,
  Message,
} from '@circuit/shared';
import { definePlugin } from '../../../context';

const getLoggerStyle = (color: string) => {
  return `color: white; font-style: normal; background-color: ${color}; border-radius: 4px; padding: 2px`;
};

function getFormattedTime() {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `[${hour}:${minute}:${second}]`;
}

definePlugin(({ registerService, getService }) => {
  const isDebugMode = () => getService(IConfigurationService).openDebugLog.data;
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
        console.info(`%c[Debug] ${getFormattedTime()} [${name}]`, getLoggerStyle('Silver'), ...realMessages);
      }
    },
    info(name, ...messages) {
      console.info(`%c[Info] ${getFormattedTime()} [${name}]`, getLoggerStyle('CornflowerBlue'), ...getMessage(messages));
    },
    warn(name, ...messages) {
      console.warn(`%c[Warn] ${getFormattedTime()} [${name}]`, getLoggerStyle('LightCoral'), ...getMessage(messages));
    },
    error(name, ...messages) {
      console.error(`%c[Error] ${getFormattedTime()} [${name}]`, getLoggerStyle('Tomato'), ...getMessage(messages));
    },
  };

  // 注册日志服务
  registerService(ILoggerService, service);
});
