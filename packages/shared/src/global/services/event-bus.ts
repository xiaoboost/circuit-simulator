import { createServiceKey } from '@circuit/inject';
import type { ChannelSubscriber } from '@xiao-ai/utils';

/**
 * 事件总线服务键
 *
 * @description 该服务用于获取事件总线服务
 * @example
 * ```ts
 * const eventBus = useService(EVENT_BUS_SERVICE);
 * ```
 */
export const EVENT_BUS_SERVICE =
  createServiceKey<IEventBus>('EventBus');

/** 鼠标拖动服务 */
export type IEventBus = ChannelSubscriber;
