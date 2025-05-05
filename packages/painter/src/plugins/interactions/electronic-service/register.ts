import {
  PartStructuredData,
  LineStructuredData,
  ElectronicKind,
  Electronics,
} from '@circuit/electronics';
import { Watcher } from '@xiao-ai/utils';
import { definePlugin } from '../../../context';
import { ELECTRONIC_SERVICE_KEY, IElectronicService } from '../../../types';

definePlugin(({ registerService }) => {
  const service: IElectronicService = {
    parts: new Watcher<PartStructuredData[]>([]),
    lines: new Watcher<LineStructuredData[]>([]),
    getPartPrototype(kind: ElectronicKind) {
      const result = Electronics[kind];

      if (!result) {
        throw new Error('未找到器件原型');
      }

      return result;
    },
  };

  // 注册元件服务
  registerService(ELECTRONIC_SERVICE_KEY, service);

  // 卸载器
  return () => {
    service.parts.unObserve();
    service.lines.unObserve();
  };
});
