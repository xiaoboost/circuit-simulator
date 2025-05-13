import { createServiceKey } from '../../context';

/**
 * 日志服务键
 *
 * @description 该服务用于获取日志功能
 * @example
 * ```ts
 * const loggerService = usePainterService(LOGGER_SERVICE);
 * ```
 */
export const LOGGER_SERVICE =
  createServiceKey<ILoggerService>('LoggerService');

export interface ILoggerService {
  /** 日志信息 */
  info(name: string,...messages: string[]): void;
  /** 警告信息 */
  warn(name: string, ...messages: string[]): void;
  /** 错误信息 */
  error(name: string, ...messages: string[]): void;
}
