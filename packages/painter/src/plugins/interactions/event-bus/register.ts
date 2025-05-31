import { ChannelSubscriber } from '@xiao-ai/utils';
import { definePlugin } from '../../../context';
import { EVENT_BUS_SERVICE, IEventBus } from '../../../types';

definePlugin(({ registerService }) => {
  const service: IEventBus = new ChannelSubscriber();

  // 注册事件总线服务
  registerService(EVENT_BUS_SERVICE, service);

  // 卸载器
  return () => {
    service.unObserve();
  };
});
