import { ChannelSubscriber } from '@xiao-ai/utils';
import { definePlugin } from '../../../context';
import { EVENT_BUS_KEY, IEventBus } from '../../../types';

definePlugin(({ registerService }) => {
  const service: IEventBus = new ChannelSubscriber();

  // 注册事件总线服务
  registerService(EVENT_BUS_KEY, service);

  // 卸载器
  return () => {
    service.unObserve();
  };
});
