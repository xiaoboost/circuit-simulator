import { createServiceKey } from '@circuit/inject';

/**
 * 日志服务键
 *
 * @description 该服务用于获取日志功能
 * @example
 * ```ts
 * const loggerService = useService(ILoggerService);
 * ```
 */
export const ILoggerService
  = createServiceKey<ILoggerService>('LoggerService');

export type Message = string | number | (() => string | number);

export interface ILoggerService {
  /**
   * 调试信息
   *
   * @description 只会在调试模式下打印
   */
  debug(name: string, ...messages: Message[]): void;
  /** 日志信息 */
  info(name: string, ...messages: Message[]): void;
  /** 警告信息 */
  warn(name: string, ...messages: Message[]): void;
  /** 错误信息 */
  error(name: string, ...messages: Message[]): void;
}
